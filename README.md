# @deepseek-ai/dsh-client-ui-salted-fish-pet

> **咸鱼宠物（Salted Fish Pet）** —— 为 DeepSeek Harness Web UI 打造的桌面宠物插件。一只悬浮在右下角的咸鱼吉祥物，叠加全视口工程师主题壁纸。纯前端展示插件，无服务端行为。

[English](./README_EN.md)

## 简介

`ui-salted-fish-pet` 是一个基于 [Cordis](https://cordis.js.org/) 的客户端 UI 插件（`platform: 'web'`）。它向 DeepSeek Harness（DSH）Web Shell 的 `shell.overlay` 槽位注入两部分内容：

1. **咸鱼宠物**：一只可拖拽、可喂食、会随机吐槽的咸鱼吉祥物；
2. **工程师壁纸**：随主题切换的深色 / 浅色全屏壁纸，透过透明主题背景显示。

两部分通过模块级共享状态（`visibility.ts`）联动：点击「隐藏咸鱼」会同时收起宠物与壁纸。

## 功能特性

### 咸鱼宠物

- **固定锚点**：默认吸附在视口右下角（`MARGIN = 20px` 内边距）。
- **拖拽移动**：按住鱼身拖拽，自动钳制在视口可见区域内；窗口缩放导致越界时自动重新锚定。
- **点击喂食**：点击鱼身恢复饱腹度 +25（上限 100），触发「开心」心情与随机台词。
- **饱腹度系统**：每 30 秒自然衰减 1 点；饿到 0 会自动切换到「有 Bug」心情。
- **8 种心情**：开心 🐟、晕乎乎 🐡、燃烧 🔥、睡着 😴、有 Bug 🐛、续命 ☕、起飞 🚀、摔桌 😡。
- **气泡台词**：每种心情附带程序员笑话 + 开发技巧提示，自动 3 秒消失。
- **闲置自动唠叨**：8–15 秒随机触发一次随机心情与台词。

### 工程师壁纸

- **深色主题**：内嵌 base64 JPEG 壁纸（源自 `src/client/desktop.jpg`，导出为 `BG_DARK`）。
- **浅色主题**：赛博科技风 SVG（网格、电路线、发光节点、数据流，源自 `src/client/light-bg.svg`，导出为 `BG_LIGHT`）。
- **主题联动**：监听 `body[data-ds-dark-theme]` 属性变化（`MutationObserver`），主题切换瞬间无缝切换壁纸。
- **透出机制**：通过 CSS 变量将主题背景基色设为透明（`--dsw-alias-bg-base: transparent`），壁纸从 `body` 透出，无需额外 DOM 节点或 z-index 争用。
- **鼠标跟随**：`mousemove`（`passive`）实时写入 `--bg-mx/--bg-my` CSS 变量，为鼠标跟随光晕（见 `Background.tsx` 的 `EngineerBackground`）提供定位。

### 召唤 / 隐藏

- 顶部导航栏「Session log」按钮左侧内联一个 **召唤咸鱼 / 隐藏咸鱼** 按钮（由宠物组件动态定位）。
- 点击一次隐藏宠物**同时**移除背景壁纸，恢复原主题背景。
- 再次点击召唤，宠物与背景同步恢复。

## 架构定位

| 层级 | 说明 |
|------|------|
| **包类型** | 纯客户端 UI 插件（`platform: 'web'`） |
| **宿主端行为** | 无（`src/index.ts` 仅导出空 `apply()` 以满足 Cordis Loader） |
| **浏览器端入口** | `exports["./client"]` → `src/client/index.ts` |
| **槽位注册** | `shell.overlay`，条目 `id: 'saltedFish'`（宠物组件） |
| **壁纸挂载** | 在 `src/client/index.ts` 的 `apply()` 内直接作用于 `body`，非独立槽位 |
| **共享状态** | `visibility.ts` 模块级 store 同步宠物与背景的显隐 |

### 目录结构

```
src/
├── index.ts                 # 宿主端入口（空 apply）
├── invariant.ts             # 插件不变量占位
├── client/
│   ├── index.ts             # 浏览器端插件：壁纸 + 槽位注册
│   ├── SaltedFishPet.tsx    # 咸鱼宠物 React 组件
│   ├── visibility.ts        # 宠物/背景共享显隐状态
│   ├── bg-images.ts         # 内嵌壁纸（BG_DARK / BG_LIGHT）
│   ├── bg-image.ts          # 旧版单壁纸常量（BG_IMAGE，遗留）
│   ├── Background.tsx       # 工程师壁纸组件（EngineerBackground，遗留）
│   ├── desktop.jpg          # 深色壁纸源图
│   ├── light-bg.svg         # 浅色壁纸源图（矢量）
│   ├── light-bg.jpg         # 浅色壁纸位图版本
│   ├── SaltedFishPet.module.css
│   └── Background.module.css
└── css-modules.d.ts
```

## 安装方式

### 前提：从源码编译 DeepSeek Harness

以下步骤适用于从 DeepSeek Harness 源码启动的场景。克隆官方仓库后确保能正常 `pnpm dsh web` 启动。

### 步骤一：将插件放入 client 目录

```bash
cd $DSH_HOME/packages/client/
git clone https://github.com/tangyuewei/dsh-salted-fish-pet.git ui-salted-fish-pet
cd ui-salted-fish-pet
pnpm run build
```

> **关于目录命名**：目录名可任意（如 `dsh-salted-fish-pet`），不影响功能。本项目约定使用 `ui-salted-fish-pet` 以与仓库中其他 `ui-*` 插件保持一致。

### 步骤二：将插件注册到 Web Bundle

插件需要在 `packages/bundle/web-app` 中注册才会被 Loader 加载。需要修改两个文件：

**1. `packages/bundle/web-app/package.json`** — 在 `dependencies` 中添加：

```json
"@deepseek-ai/dsh-client-ui-salted-fish-pet": "workspace:^"
```

**2. `packages/bundle/web-app/cordis.patch.yml`** — 在 browser plugin roster（`- insert:` 下的 `ui-*` 条目列表末尾）添加：

```yaml
    - id: ui-salted-fish-pet
      name: '@deepseek-ai/dsh-client-ui-salted-fish-pet'
```

### 步骤三：重新安装依赖并构建

```bash
cd $DSH_HOME
pnpm install
pnpm run build:lib:host
pnpm run build:web
```

### 步骤四：启动

```bash
pnpm dsh web
```

插件加载后可在浏览器中看到右下角的咸鱼宠物与工程师壁纸。可通过 Settings → Plugins 确认 `@deepseek-ai/dsh-client-ui-salted-fish-pet` 已启用。

## 自定义配置

| 文件 | 可修改内容 |
|------|------------|
| `src/client/SaltedFishPet.tsx` | `MOODS`（emoji/tag）、`SPEECH` 台词库、饱腹度衰减间隔、闲置触发间隔、鱼尺寸（`PET_W`/`PET_H`）与边距（`MARGIN`） |
| `src/client/bg-images.ts` | `BG_DARK` / `BG_LIGHT` 内嵌壁纸（深色 JPEG / 浅色 SVG） |
| `src/client/desktop.jpg` · `light-bg.svg` · `light-bg.jpg` | 壁纸源图，修改后需重新编码进 `bg-images.ts` |
| `src/client/index.ts` | 透明背景变量名、鼠标跟随变量、壁纸应用逻辑 |
| `src/client/SaltedFishPet.module.css` · `Background.module.css` | 宠物 / 气泡 / 饱腹度条样式、动画关键帧 |

### 常见调整示例

**修改饱腹度衰减速度**（`SaltedFishPet.tsx`）：

```ts
// 原：每 30 秒 -1
setHunger(h => Math.max(0, h - 1))
}, 30000)
// 改：每 60 秒 -1
}, 60000)
```

**切换深色 / 浅色壁纸源**（`bg-images.ts`）：

```ts
// 替换 BG_DARK（深色，建议 ≥2000px 宽 JPEG）
export const BG_DARK = 'data:image/jpeg;base64,' + '<your-base64>'
// 替换 BG_LIGHT（浅色，矢量 SVG 无损缩放）
export const BG_LIGHT = 'data:image/svg+xml;base64,' + '<your-base64>'
```

> 将图片转为 base64：`base64 -i your-image.jpg | tr -d '\n'`

## 兼容性说明

- **仅 Web 平台**：`package.json` 声明 `dsh.client.platform: 'web'`，无 Node / CLI / ACP 入口。
- **零依赖服务**：不消费任何 Cordis 服务（仅依赖 `slots` 槽位注入），纯 React 组件 + 模块级 store。
- **样式隔离**：CSS Modules（`SaltedFishPet.module.css`、`Background.module.css`），无全局污染。
- **主题联动**：依赖 DSH Web Shell 的 `body[data-ds-dark-theme]` 属性切换。

## 已知限制

- **无持久化**：宠物位置、饱腹度、心情、显隐状态均为会话级内存，刷新即重置。
- **无配置面板**：所有参数需改源码重新构建，未暴露给用户设置。
- **壁纸硬编码**：深色 / 浅色壁纸以 base64 内嵌于 `bg-images.ts`，无外部请求；如需动态加载需自行改造。
- **召唤按钮定位依赖 DOM 查找**：通过查找「Session log」按钮定位，若 Shell 结构变更可能失效。
- **无障碍支持有限**：宠物交互区标注 `role="button"` 与 `tabIndex`，但缺少完整 ARIA 属性与键盘操作。
- **光晕为遗留实现**：鼠标跟随光晕样式定义在未挂载的 `Background.tsx`（`EngineerBackground`），当前壁纸路径不渲染光晕。

## 许可证

MIT