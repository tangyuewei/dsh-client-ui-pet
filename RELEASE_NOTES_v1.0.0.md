# @tangyuewei/dsh-client-ui-pet v1.0.0 发布说明

> **咸鱼宠物（Salted Fish Pet）** —— 为 DeepSeek Harness（DSH）Web UI 打造的桌面宠物插件。  
> 一只悬浮在右下角的咸鱼吉祥物，叠加全视口工程师主题壁纸。纯前端展示插件，无服务端行为。

- **发布版本**：`1.0.0`
- **发布日期**：2026-08-19
- **包名**：`@tangyuewei/dsh-client-ui-pet`
- **平台**：Web（`dsh.client.platform: 'web'`）
- **许可证**：MIT
- **首个提交**：2026-08-18（v0.1.0 种子）→ 本版本历经 33 次提交打磨为首个稳定版

---

## 1. 概述

本版本是 `ui-pet` 插件的**首个正式稳定版（1.0.0）**。自 0.1.0 种子提交以来，围绕「咸鱼宠物 + 工程师壁纸」两大核心能力完成了完整的产品化打磨，重点解决了主题适配、可读性、运行时切换与一键安装等关键体验问题。

v1.0.0 标志着插件 API 与功能边界已稳定，后续将遵循语义化版本（SemVer）进行迭代。

## 2. 核心亮点

- 🐟 **完整咸鱼宠物交互**：可拖拽、可喂食、8 种程序员心情、随机吐槽台词、饱腹度系统。
- 🖼️ **工程师壁纸体系**：7 张候选壁纸，运行时一键切换，支持 📌 置顶对比。
- 🎨 **玻璃拟态主题融合**：侧边栏与中间列毛玻璃透出壁纸，深浅主题均保障文字可读。
- 🪄 **一键安装脚本**：`install.sh` 自动完成依赖注册、插件条目注入与构建，幂等可重跑。
- 🔌 **零服务端依赖**：不消费任何 Cordis 服务，仅依赖 `shell.overlay` 槽位注入，纯 React + 模块级 store。

## 3. 功能特性

### 3.1 咸鱼宠物（SaltedFishPet）

| 能力    | 说明                                                 |
| ----- | -------------------------------------------------- |
| 固定锚点  | 默认吸附视口右下角（`MARGIN = 20px` 内边距）                     |
| 拖拽移动  | 按住鱼身拖拽，自动钳制在视口可见区；窗口缩放越界时自动重新锚定                    |
| 点击喂食  | 点击鱼身恢复饱腹度 +25（上限 100），触发「开心」心情与随机台词                |
| 饱腹度系统 | 每 30 秒自然衰减 1 点；饿到 0 自动切换到「有 Bug」心情                 |
| 8 种心情 | 开心 🐟、晕乎乎 🐡、燃烧 🔥、睡着 😴、有 Bug 🐛、续命 ☕、起飞 🚀、摔桌 😡 |
| 气泡台词  | 每种心情附带程序员笑话 + 开发技巧，自动 3 秒消失                        |
| 闲置唠叨  | 8–15 秒随机触发一次随机心情与台词                                |

### 3.2 工程师壁纸（Wallpaper）

- **多壁纸候选**：7 张图（Porsche 718 / Yu7 ×3 / Macan S / Su7 ×2）由 `scripts/build-wallpapers.mjs` 自动缩放到 1920px JPEG 并 base64 编码进 `bg-images.generated.ts`，丢图即加入候选。
- **主题无关**：所有壁纸在任何主题下均可选，不再按浅色/深色分组；选择全局共享一个 id，写入 `localStorage`（`dsh-ui-pet.wallpaper`）。
- **运行时切换**：右下角 🎨 按钮（`WallpaperPicker`）弹出全部缩略图面板，点击即切换；支持 📌 置顶（背景图全屏置顶、面板保持打开可对比，取消置顶返回原状）。
- **默认壁纸**：召唤咸鱼时默认使用 `yu7.jpg`。
- **丢图即生效（开发）**：`npm run watch` 后往 `src/client/wallpapers/` 丢图自动重编码重建，无需手动 `npm run bundle`。
- **透出机制**：通过 CSS 变量将主题背景基色设为透明（`--dsw-alias-bg-base: transparent`），壁纸从 `body` 透出，无额外 DOM 节点或 z-index 争用。
- **玻璃拟态列**：侧边栏与中间列采用半透明 + `backdrop-filter: blur + saturate`，通过 `[class$="sidebarCol"]` / `[class$="centerCol"]` 结尾选择器命中上层层级；深浅主题分别适配透明度（浅色 centerCol 不透明度 0.74 + 22px 模糊保障可读）。
- **鼠标跟随**：`mousemove`（`passive`）实时写入 `--bg-mx/--bg-my` CSS 变量，为壁纸氛围提供定位。

### 3.3 召唤 / 隐藏（visibility）

- 顶部导航栏「Session log」按钮左侧内联 **召唤咸鱼 / 隐藏咸鱼** 按钮（由宠物组件动态定位）。
- 点击一次隐藏宠物**同时**移除背景壁纸，恢复原主题背景；再次点击召唤，宠物与背景同步恢复。
- 宠物与壁纸通过模块级共享状态（`visibility.ts`）联动。

## 4. 架构定位

| 层级     | 说明                                                      |
| ------ | ------------------------------------------------------- |
| 包类型    | 纯客户端 UI 插件（`platform: 'web'`）                           |
| 宿主端行为  | 无（`src/index.ts` 仅导出空 `apply()` 以满足 Cordis Loader）      |
| 浏览器端入口 | `exports["./client"]` → `src/client/index.ts`           |
| 槽位注册   | `shell.overlay`，条目 `id: 'uiPet'`（宠物组件）                  |
| 壁纸挂载   | 在 `src/client/index.ts` 的 `apply()` 内直接作用于 `body`，非独立槽位 |
| 共享状态   | `visibility.ts` 模块级 store 同步宠物与背景显隐                     |

**目录结构**

```
src/
├── index.ts                 # 宿主端入口（空 apply）
├── invariant.ts             # 插件不变量占位
├── client/
│   ├── index.ts             # 浏览器端插件：壁纸 + 毛玻璃 + 槽位注册
│   ├── SaltedFishPet.tsx    # 咸鱼宠物 React 组件
│   ├── WallpaperPicker.tsx  # 右下角 🎨 浮动按钮 + 缩略图选择面板
│   ├── visibility.ts        # 宠物/背景共享显隐状态
│   ├── bg-images.ts         # 壁纸 API：WALLPAPERS + localStorage 持久化 + 事件总线
│   ├── bg-image.ts          # 旧版单壁纸常量（遗留）
│   ├── Background.tsx       # 工程师壁纸组件（遗留，光晕未挂载）
│   └── wallpapers/          # 壁纸源图目录
scripts/
└── build-wallpapers.mjs      # prebuild：扫描 wallpapers/ → sips 缩放 → base64 → bg-images.generated.ts
```

## 5. 安装方式

### 前提

从 DeepSeek Harness 源码编译（克隆官方仓库并确保 `pnpm dsh web` 可启动）。

### 步骤

```bash
# 1. 将插件放入 client 目录
cd $DSH_HOME/packages/client/
git clone https://github.com/tangyuewei/dsh-client-ui-pet.git

# 2. 运行一键安装脚本（自动注册依赖、注入插件条目、安装并构建）
cd dsh-client-ui-pet
bash install.sh

# 3. 启动
pnpm dsh web
```

`install.sh` 幂等：注册条目已存在时自动跳过，重复运行安全；任一步失败打印 `[ERROR]` 并中断（退出码非 0）。

## 6. 兼容性说明

- **仅 Web 平台**：`package.json` 声明 `dsh.client.platform: 'web'`，无 Node / CLI / ACP 入口。
- **零依赖服务**：不消费任何 Cordis 服务（仅依赖 `slots` 槽位注入），纯 React 组件 + 模块级 store。
- **样式隔离**：CSS Modules，无全局污染。
- **主题联动**：依赖 DSH Web Shell 的 `body[data-ds-dark-theme]` 属性切换。

## 7. 已知限制（v1.0.0）

- **无持久化**：宠物位置、饱腹度、心情、显隐状态均为会话级内存，刷新即重置。
- **无配置面板**：所有参数需改源码重新构建，未暴露给用户设置。
- **壁纸候选统一管理**：候选壁纸以 base64 内嵌于 `bg-images.generated.ts`，无外部请求；动态加载需自行改造。
- **召唤按钮定位依赖 DOM 查找**：通过查找「Session log」按钮定位，若 Shell 结构变更可能失效。
- **无障碍支持有限**：宠物交互区标注 `role="button"` 与 `tabIndex`，但缺少完整 ARIA 属性与键盘操作。
- **光晕为遗留实现**：鼠标跟随光晕样式定义在未挂载的 `Background.tsx`（`EngineerBackground`），当前壁纸路径不渲染光晕。

## 8. 升级与迁移

- **从 0.1.0 升级**：无破坏性变更。直接拉取最新代码，`bash install.sh` 重新构建即可。
- 本版本已将插件注册名统一为 `@tangyuewei/dsh-client-ui-pet`（cordis 条目 `id: 'uiPet'`），若旧有手写注册需同步更新。
- 壁纸选择已改为**主题无关**，旧版「深浅分组」心智模型不再适用；用户选择持久化键仍为 `dsh-ui-pet.wallpaper`。

## 9. 本版本关键变更（精选自 33 次提交）

**特性（feat）**

- 咸鱼宠物 + 交互式工程师背景初版（`6971472`）
- 鼠标跟随光晕 + 静态壁纸，GPU 占用约 0（`12870b3`）
- 深浅主题双壁纸 + `MutationObserver` 自动切换（`8a450f0`）
- 玻璃拟态侧边栏/中间列，壁纸氛围透出且文字清晰（`6ae968f`）
- 7 张候选壁纸 + 右下角运行时切换面板 + 浅色可读性优化（`e9ff9cf`）
- 壁纸面板置顶/取消置顶，置顶保持打开且不遮挡 🎨 按钮（`d1dd53e` / `395f271`）
- 壁纸选择不再区分深浅主题 + 默认 `yu7` + watch 丢图自动重编码（`692218b`）
- 插件注册名同步为 `@tangyuewei/dsh-client-ui-pet`（`814a303`）

**修复（fix）**

- `backdrop-filter` 移至伪元素并去掉 `isolation`，修复设置弹窗被裁剪（`6bbd02d`）
- 壁纸缩略图点击被外部关闭监听吞掉导致切换无效（`3e1d16f`）
- `use hasAttribute` 判断 `data-ds-dark-theme`（`1ccbb6f`）
- 背景层不得阻断 UI 事件（`6b560a3`）
- 多次修复 body 透明、z-index 与 DSH 主题覆盖冲突（`1e50808` / `064d45c` / `1686ba0` 等）

**文档与工程（docs / chore / perf）**

- 双语 README（中文 + English）（`2308eb6`）
- 新增 `install.sh` 一键安装脚本（`fda1c80`）
- README 插入功能演示 GIF（`f18a878`）

---

> 完整提交历史见仓库 `git log`。本版本为首个稳定版，建议通过 Git tag `v1.0.0` 标记发布。

