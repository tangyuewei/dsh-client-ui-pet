#!/usr/bin/env bash
#
# dsh-client-ui-pet — 一键卸载脚本（源码编译版）
#
# 与 install.sh 严格互逆。install.sh 在 $DSH_HOME 中做了三件事：
#   1. 在 packages/bundle/web-app/package.json 的 dependencies 注册插件依赖；
#   2. 在 packages/bundle/web-app/cordis.patch.yml 的 - insert: 块追加插件条目；
#   3. 在 $DSH_HOME 执行 pnpm install 与 pnpm run build。
# 本脚本按相反顺序撤销上述全部写操作，并将 DSH 工作区恢复到一致状态。
#
# 插件包名 / 插件 id 均从插件自身的 package.json / cordis.patch.yml 读取，
# 与 install.sh 使用同一事实源，始终保持一致，无需手动同步。
#
# 用法：
#   bash uninstall.sh                  # 完整卸载（含 pnpm install + build）
#   DSH_HOME=/path/to/dsh bash uninstall.sh
#   bash uninstall.sh --dry-run        # 预演，不修改任何文件
#   bash uninstall.sh --no-rebuild     # 仅撤销注册，不重新 install / build
#   bash uninstall.sh --help
#
# 幂等：插件未注册时自动跳过对应步骤，可安全重跑。
# 退出码：0 = 成功（或 dry-run 预演成功）；非 0 = 失败（失败步骤打印 [ERROR]）。
#
set -euo pipefail

# ----------------------------------------------------------------------------
# 参数解析
# ----------------------------------------------------------------------------
DRY_RUN=false
NO_REBUILD=false
for arg in "$@"; do
  case "$arg" in
    --dry-run)    DRY_RUN=true ;;
    --no-rebuild) NO_REBUILD=true ;;
    -h|--help)
      grep -E '^#' "$0" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *)
      printf "[ERROR] 未知参数：%s\n" "$arg" >&2
      printf "运行 bash uninstall.sh --help 查看用法。\n" >&2
      exit 2 ;;
  esac
done

# ----------------------------------------------------------------------------
# 常量与日志工具
# ----------------------------------------------------------------------------
if [[ -t 1 ]]; then
  C_RED=$'\033[0;31m';  C_GREEN=$'\033[0;32m'
  C_YELLOW=$'\033[1;33m'; C_CYAN=$'\033[0;36m'; C_BOLD=$'\033[1m'; C_NC=$'\033[0m'
else
  C_RED=''; C_GREEN=''; C_YELLOW=''; C_CYAN=''; C_BOLD=''; C_NC=''
fi

info()  { printf "${C_CYAN}[INFO]${C_NC}  %s\n" "$*"; }
ok()    { printf "${C_GREEN}[ OK ]${C_NC}  %s\n" "$*"; }
warn()  { printf "${C_YELLOW}[WARN]${C_NC} %s\n" "$*"; }
error() { printf "${C_RED}[ERROR]${C_NC} %s\n" "$*" >&2; }

fail() {
  error "$*"
  printf "${C_RED}[ERROR]${C_NC} 卸载中断：请根据上方错误信息排查后重新运行。\n" >&2
  exit 1
}

# ----------------------------------------------------------------------------
# 定位脚本目录与 DSH_HOME
# ----------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_DSH_HOME="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
DSH_HOME="${DSH_HOME:-${DEFAULT_DSH_HOME}}"

# 预演模式只读取、不写入，动作统一设为 check
[[ "${DRY_RUN}" == true ]] && ACTION='check' || ACTION='remove'

# 临时文件：node 子进程把状态（removed/present/absent）写入此处，shell 再读取，
# 避免在 $( ... <<'NODE' ) 内联命令替换中夹杂 || 导致 bash 语法错误。
TMP_DIR="$(mktemp -d)"
STATUS_FILE="${TMP_DIR}/status"
trap 'rm -rf "${TMP_DIR}"' EXIT

echo ""
if [[ "${DRY_RUN}" == true ]]; then
  info "=================== dsh-client-ui-pet 卸载预演（dry-run） ==================="
else
  info "=================== dsh-client-ui-pet 一键卸载 ==================="
fi
info "脚本目录 : ${SCRIPT_DIR}"
info "DSH_HOME : ${DSH_HOME}"
[[ "${NO_REBUILD}" == true ]] && info "重建模式 : 跳过 pnpm install / build"
echo ""

# ----------------------------------------------------------------------------
# 步骤 1/5：环境与目录校验
# ----------------------------------------------------------------------------
info "步骤 1/5：校验环境与 DSH 源码目录 ..."

command -v node >/dev/null 2>&1 \
  || fail "未找到命令 node，请先安装 Node.js 并将其加入 PATH。"

if [[ "${NO_REBUILD}" != true ]]; then
  command -v pnpm >/dev/null 2>&1 \
    || fail "未找到命令 pnpm，请先安装并将其加入 PATH（或使用 --no-rebuild 仅撤销注册）。"
fi

[[ -d "${DSH_HOME}/packages/client" ]] \
  || fail "DSH_HOME 下不存在 packages/client 目录（${DSH_HOME}）。若 DSH 源码不在该位置，请用 DSH_HOME=/path/to/dsh 重新指定。"

WEB_APP_DIR="${DSH_HOME}/packages/bundle/web-app"
[[ -f "${WEB_APP_DIR}/package.json" ]] \
  || fail "未找到 ${WEB_APP_DIR}/package.json，请确认 DSH_HOME 指向 DeepSeek Harness 源码根目录。"
[[ -f "${WEB_APP_DIR}/cordis.patch.yml" ]] \
  || fail "未找到 ${WEB_APP_DIR}/cordis.patch.yml，请确认 DSH_HOME 指向 DeepSeek Harness 源码根目录。"

# 读取插件事实源：包名（package.json）
PLUGIN_NAME="$(node -e "
  const fs = require('fs');
  try { console.log(require(process.argv[1]).name || ''); }
  catch { console.log(''); }
" "${SCRIPT_DIR}/package.json" 2>/dev/null || true)"
[[ -n "${PLUGIN_NAME}" ]] \
  || fail "无法读取插件 package.json 中的 name，请确认在 dsh-client-ui-pet 插件仓库内运行本脚本。"

# 读取插件事实源：插件 id（cordis.patch.yml）
PLUGIN_ID="$(node -e "
  const fs = require('fs');
  try {
    const y = fs.readFileSync(process.argv[1], 'utf8');
    const m = y.match(/^[ \t]*-[ \t]+id:[ \t]+(\S+)/m);
    console.log(m ? m[1] : '');
  } catch { console.log(''); }
" "${SCRIPT_DIR}/cordis.patch.yml" 2>/dev/null || true)"
PLUGIN_ID="${PLUGIN_ID:-ui-pet}"

info "插件包名 : ${PLUGIN_NAME}"
info "插件 id   : ${PLUGIN_ID}"
ok "环境与目录校验通过。"
echo ""

# ----------------------------------------------------------------------------
# 步骤 2/5：从 web-app/package.json 移除依赖
# ----------------------------------------------------------------------------
info "步骤 2/5：从 packages/bundle/web-app/package.json 移除依赖 ..."

node - "${WEB_APP_DIR}/package.json" "${PLUGIN_NAME}" "${ACTION}" "${STATUS_FILE}" <<'NODE' \
  || fail "web-app/package.json 处理失败：请检查该文件是否为合法 JSON。"
const fs = require('fs');
const [file, dep, action, statusFile] = process.argv.slice(2);
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
pkg.dependencies = pkg.dependencies || {};
let result;
if (pkg.dependencies[dep]) {
  if (action === 'check') { result = 'present'; }
  else { delete pkg.dependencies[dep]; fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n'); result = 'removed'; }
} else { result = 'absent'; }
fs.writeFileSync(statusFile, result);
NODE
DEP_OUT="$(cat "${STATUS_FILE}")"

CHANGED=false
case "${DEP_OUT}" in
  removed) CHANGED=true; ok "已从 web-app/package.json 移除依赖 ${PLUGIN_NAME}。" ;;
  present) info "[dry-run] web-app/package.json 中存在依赖 ${PLUGIN_NAME}，将移除。" ;;
  absent)  warn "web-app/package.json 中未找到依赖 ${PLUGIN_NAME}，跳过。" ;;
esac
echo ""

# ----------------------------------------------------------------------------
# 步骤 3/5：从 web-app/cordis.patch.yml 移除插件条目
# ----------------------------------------------------------------------------
info "步骤 3/5：从 packages/bundle/web-app/cordis.patch.yml 移除插件条目 ..."

node - "${WEB_APP_DIR}/cordis.patch.yml" "${PLUGIN_ID}" "${ACTION}" "${STATUS_FILE}" <<'NODE' \
  || fail "web-app/cordis.patch.yml 处理失败：请检查该文件格式。"
const fs = require('fs');
const [file, id, action, statusFile] = process.argv.slice(2);
const text = fs.readFileSync(file, 'utf8');
const lines = text.split('\n');
const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const re = new RegExp('^(\\s*)- id:\\s*' + escaped + '\\s*$');
let idx = -1;
for (let i = 0; i < lines.length; i++) {
  if (re.test(lines[i])) { idx = i; break; }
}
let result = 'absent';
if (idx !== -1) {
  if (action === 'check') { result = 'present'; }
  else {
    // 仅删除该条目自身：id 行 + 其下所有缩进更深的属性行；空行 / 同级条目 / 注释均保留
    const idIndent = lines[idx].match(/^\s*/)[0].length;
    let j = idx;
    for (let k = idx + 1; k < lines.length; k++) {
      const raw = lines[k];
      if (raw.trim() === '') break;
      const m = raw.match(/^(\s*)\S/);
      const ind = m ? m[1].length : 0;
      if (ind <= idIndent) break;
      j = k;
    }
    lines.splice(idx, j - idx + 1);
    // 精确还原尾部换行：仅当原文以 \n 结尾时输出才以 \n 结尾，避免重复空行
    const hadTrailingNl = text.endsWith('\n');
    let out = lines.join('\n');
    if (hadTrailingNl) { if (!out.endsWith('\n')) out += '\n'; }
    else { if (out.endsWith('\n')) out = out.replace(/\n$/, ''); }
    fs.writeFileSync(file, out);
    result = 'removed';
  }
}
fs.writeFileSync(statusFile, result);
NODE
PATCH_OUT="$(cat "${STATUS_FILE}")"

case "${PATCH_OUT}" in
  removed) CHANGED=true; ok "已从 web-app/cordis.patch.yml 移除插件条目 ${PLUGIN_ID}（${PLUGIN_NAME}）。" ;;
  present) info "[dry-run] web-app/cordis.patch.yml 中存在条目 ${PLUGIN_ID}，将移除。" ;;
  absent)  warn "web-app/cordis.patch.yml 中未找到条目 ${PLUGIN_ID}，跳过。" ;;
esac
echo ""

# 若插件根本未注册，则无重建必要
if [[ "${CHANGED}" != true && "${DRY_RUN}" != true ]]; then
  info "插件未在任何位置注册，无需卸载；跳过 pnpm install / build。"
  SKIP_REBUILD=true
else
  SKIP_REBUILD=false
fi

# ----------------------------------------------------------------------------
# 步骤 4/5：pnpm install（撤销 workspace 依赖软链、更新 lockfile）
# ----------------------------------------------------------------------------
if [[ "${SKIP_REBUILD}" != true && "${NO_REBUILD}" != true ]]; then
  info "步骤 4/5：在 ${DSH_HOME} 执行 pnpm install（更新依赖与 lockfile）..."
  ( cd "${DSH_HOME}" && pnpm install ) \
    || fail "pnpm install 失败：请检查网络连接、pnpm 版本与依赖冲突（见上方输出）。"
  ok "依赖更新完成。"
  echo ""
else
  info "步骤 4/5：跳过 pnpm install（${DRY_RUN} / ${NO_REBUILD}）。"
  echo ""
fi

# ----------------------------------------------------------------------------
# 步骤 5/5：pnpm run build（重新构建不含该插件的产物）
# ----------------------------------------------------------------------------
if [[ "${SKIP_REBUILD}" != true && "${NO_REBUILD}" != true ]]; then
  info "步骤 5/5：在 ${DSH_HOME} 执行 pnpm run build ..."
  ( cd "${DSH_HOME}" && pnpm run build ) \
    || fail "pnpm run build 失败：请检查上方编译输出中的错误信息。"
  ok "构建完成。"
  echo ""
else
  info "步骤 5/5：跳过 pnpm run build（--no-rebuild 或无需重建）。"
  echo ""
fi

# ----------------------------------------------------------------------------
# 校验：确认两处注册均已消失
# ----------------------------------------------------------------------------
if [[ "${DRY_RUN}" != true ]]; then
  info "校验：确认两处注册均已撤销 ..."
  node - "${WEB_APP_DIR}/package.json" "${WEB_APP_DIR}/cordis.patch.yml" "${PLUGIN_NAME}" "${PLUGIN_ID}" <<'NODE' \
    || fail "校验未通过：插件注册仍残留，请检查上方各步骤输出。"
  const fs = require('fs');
  const [pkgFile, patchFile, name, id] = process.argv.slice(2);
  const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
  const patch = fs.readFileSync(patchFile, 'utf8');
  const depLeft = !!(pkg.dependencies && pkg.dependencies[name]);
  const idLeft = new RegExp('^[ \\t]*-[ \\t]+id:[ \\t]+' + id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[ \\t]*$', 'm').test(patch);
  if (depLeft || idLeft) {
    console.error(`残留检测：package.json 依赖=${depLeft}, cordis.patch.yml 条目=${idLeft}`);
    process.exit(1);
  }
  console.log('clean');
NODE
  ok "校验通过：web-app 已不再引用 ${PLUGIN_NAME}。"
  echo ""
fi

# ----------------------------------------------------------------------------
# 完成
# ----------------------------------------------------------------------------
if [[ "${DRY_RUN}" == true ]]; then
  printf "${C_CYAN}${C_BOLD}"
  echo "====================== 预演完成（未做任何修改） ======================"
  echo "  将撤销 : ${PLUGIN_NAME}（${PLUGIN_ID}）"
  echo "  正式执行：bash uninstall.sh"
  echo "====================================================================="
  printf "${C_NC}"
  echo ""
  exit 0
fi

printf "${C_GREEN}${C_BOLD}"
echo "=========================== 卸载成功 ==========================="
echo "  已移除 : ${PLUGIN_NAME}（${PLUGIN_ID}）"
echo "  影响   : web-app/package.json 依赖、cordis.patch.yml 条目"
echo "  已重建 : ${SKIP_REBUILD}${NO_REBUILD:+ / 跳过}"
echo "  注意   : 插件源码目录（${SCRIPT_DIR}）已保留，未删除。"
echo "  重装   : 在本目录重新运行 bash install.sh 即可。"
echo "==============================================================="
printf "${C_NC}"
echo ""
