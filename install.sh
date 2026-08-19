#!/usr/bin/env bash
#
# dsh-client-ui-pet — DeepSeek Harness 一键安装脚本
#
# 在用户 clone 本插件仓库后运行，自动完成：
#   1. 环境与目录校验（git / node / pnpm、DSH 源码结构）
#   2. 将插件注册到 packages/bundle/web-app（package.json + cordis.patch.yml）
#   3. 在 $DSH_HOME 执行 pnpm install 与 pnpm run build
#
# 插件包名 / 插件 id 均从插件自身的 package.json / cordis.patch.yml 读取，
# 脚本始终与插件实际配置保持一致，无需手动同步。
#
# 用法：
#   bash install.sh
#   DSH_HOME=/path/to/deepseek-harness bash install.sh
#
# 幂等：注册条目已存在时自动跳过，可安全重跑。
# 退出码：0 = 成功；非 0 = 失败（失败步骤会打印 [ERROR] 与排查提示）。
#
set -euo pipefail

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
  printf "${C_RED}[ERROR]${C_NC} 安装中断：请根据上方错误信息排查后重新运行。\n" >&2
  exit 1
}

# ----------------------------------------------------------------------------
# 定位脚本目录与 DSH_HOME
# ----------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_DSH_HOME="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
DSH_HOME="${DSH_HOME:-${DEFAULT_DSH_HOME}}"

echo ""
info "=================== dsh-client-ui-pet 一键安装 ==================="
info "脚本目录 : ${SCRIPT_DIR}"
info "DSH_HOME : ${DSH_HOME}"
echo ""

# ----------------------------------------------------------------------------
# 步骤 1/5：环境与目录校验
# ----------------------------------------------------------------------------
info "步骤 1/5：校验环境与 DSH 源码目录 ..."

for cmd in git node pnpm; do
  command -v "${cmd}" >/dev/null 2>&1 || fail "未找到命令 ${cmd}，请先安装并将其加入 PATH。"
done

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
  || fail "无法读取插件 package.json 中的 name，请确认已在 dsh-client-ui-pet 插件仓库内运行本脚本。"
info "插件包名 : ${PLUGIN_NAME}"

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
info "插件 id   : ${PLUGIN_ID}"

ok "环境与目录校验通过（git / node / pnpm 可用，DSH 目录结构完整）。"
echo ""

# ----------------------------------------------------------------------------
# 步骤 2/5：注册依赖到 web-app/package.json
# ----------------------------------------------------------------------------
info "步骤 2/5：注册依赖到 packages/bundle/web-app/package.json ..."

node - "${WEB_APP_DIR}/package.json" "${PLUGIN_NAME}" <<'NODE' \
  || fail "web-app/package.json 注册失败：请检查该文件是否为合法 JSON。"
const fs = require('fs');
const [file, dep] = process.argv.slice(2);
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
pkg.dependencies = pkg.dependencies || {};
if (!pkg.dependencies[dep]) {
  pkg.dependencies[dep] = 'workspace:^';
  fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`  已添加依赖 ${dep}: workspace:^`);
} else {
  console.log(`  ${dep} 已在 dependencies 中，跳过。`);
}
NODE
ok "web-app/package.json 注册完成。"
echo ""

# ----------------------------------------------------------------------------
# 步骤 3/5：注册插件条目到 web-app/cordis.patch.yml
# ----------------------------------------------------------------------------
info "步骤 3/5：注册插件条目到 packages/bundle/web-app/cordis.patch.yml ..."

node - "${WEB_APP_DIR}/cordis.patch.yml" "${PLUGIN_ID}" "${PLUGIN_NAME}" <<'NODE' \
  || fail "web-app/cordis.patch.yml 注册失败：请检查该文件中是否存在 '- insert:' 块。"
const fs = require('fs');
const [file, id, name] = process.argv.slice(2);
const lines = fs.readFileSync(file, 'utf8').split('\n');
if (lines.some(l => l.includes(`- id: ${id}`) || l.includes(name))) {
  console.log(`  ${id} / ${name} 已注册，跳过。`);
  process.exit(0);
}
const insertIdx = lines.findIndex(l => /^[ \t]*- insert:/.test(l));
if (insertIdx === -1) {
  console.error(`未在 ${file} 中找到 "- insert:" 块，请手动添加插件条目。`);
  process.exit(1);
}
// 定位 - insert: 块内最后一个条目的末尾（id 行 + 其属性行），保持同缩进追加
let anchor = insertIdx;
let indent = '    ';
for (let i = insertIdx + 1; i < lines.length; i++) {
  const l = lines[i];
  if (/^\S/.test(l)) break;                 // 遇到下一个顶层键，结束
  const m = l.match(/^([ \t]+)- id:/);
  if (m) { anchor = i; indent = m[1]; continue; }
  // 当前条目的属性行（缩进比 id 行更深，如 name:），属于该条目末尾
  const lead = l.match(/^[ \t]*\S/);
  if (lead && lead[0].length > indent.length) { anchor = i; }
}
const entry = [`${indent}- id: ${id}`, `${indent}  name: '${name}'`];
lines.splice(anchor + 1, 0, ...entry);
fs.writeFileSync(file, lines.join('\n'));
console.log(`  已追加插件条目 ${id}（${name}）。`);
NODE
ok "web-app/cordis.patch.yml 注册完成。"
echo ""

# ----------------------------------------------------------------------------
# 步骤 4/5：pnpm install
# ----------------------------------------------------------------------------
info "步骤 4/5：在 ${DSH_HOME} 执行 pnpm install（首次耗时较长，请耐心等待）..."
( cd "${DSH_HOME}" && pnpm install ) \
  || fail "pnpm install 失败：请检查网络连接、pnpm 版本与依赖冲突（见上方输出）。"
ok "依赖安装完成。"
echo ""

# ----------------------------------------------------------------------------
# 步骤 5/5：pnpm run build
# ----------------------------------------------------------------------------
info "步骤 5/5：在 ${DSH_HOME} 执行 pnpm run build ..."
( cd "${DSH_HOME}" && pnpm run build ) \
  || fail "pnpm run build 失败：请检查上方编译输出中的错误信息。"
ok "构建完成。"
echo ""

# ----------------------------------------------------------------------------
# 完成
# ----------------------------------------------------------------------------
printf "${C_GREEN}${C_BOLD}"
echo "=========================== 安装成功 ==========================="
echo "  已就绪 : ${PLUGIN_NAME}（${PLUGIN_ID}）"
echo "  启动   : pnpm dsh web"
echo "  验证   : 浏览器中点击导航栏「召唤咸鱼」按钮，"
echo "           或打开 Settings → Plugins 确认插件已启用。"
echo "==============================================================="
printf "${C_NC}"
echo ""
