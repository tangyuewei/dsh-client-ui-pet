# @deepseek-ai/dsh-client-ui-salted-fish-pet

**咸鱼宠物**：全栈工程师专属 QQ 风格宠物，始终悬浮在页面右下角。跟 QQ 没有关系，是 DSH 的个人宠物插件。

## Features

- 🐟 **咸鱼宠物**：全栈工程师专属 QQ 风格宠物，始终悬浮在页面右下角
- 🎨 **工程师专属背景**：你的 `desktop.jpg` 做壁纸 + 鼠标跟随蓝光 + 点击涟漪，全屏沉浸
- **交互能力**：点击喂食、拖拽移动、自动闲聊、8种心情+台词
- **召回/隐藏**：顶部按钮一键隐藏/显示宠物（同时隐藏背景）
- **情绪价值**：程序员笑话+开发技巧提示，气泡自动弹出
- **饱腹度系统**：点击恢复，缓慢衰减
- **视口边界**：拖拽时不会超出屏幕

## 安装

### 方法1：dsh plugin 命令（推荐）

```bash
# 在 dsh 安装目录下克隆
cd $DSH_HOME/profiles/node_modules
git clone https://github.com/tangyuewei/dsh-salted-fish-pet.git @deepseek-ai/dsh-client-ui-salted-fish-pet

# 重新构建前端
cd $DSH_HOME
pnpm --filter @deepseek-ai/dsh-web-frontend build
```

### 方法2：手动安装

1. 将此仓库克隆到 `$DSH_HOME/profiles/node_modules/@deepseek-ai/dsh-client-ui-salted-fish-pet`
2. 确保目录下有 `lib/` 构建产物（如没有则运行 `pnpm install && pnpm run bundle`）
3. 重启 dsh web 服务

### 源码开发模式

```bash
git clone https://github.com/tangyuewei/dsh-salted-fish-pet.git
cd dsh-salted-fish-pet
pnpm install
pnpm run bundle  # 编译 lib/
```

## 自定义

- 编辑 `src/client/SaltedFishPet.tsx` 中的 `SPEECH` 和 `MOODS` 对象即可修改台词和心情
- 替换 `src/client/desktop.jpg` 可更换背景壁纸（建议 2000+ 宽度，JPEG）
- 背景半透明度在 `src/client/index.ts` 的 CSS 变量中调整（`rgba(15, 23, 42, 0.75)`）

## 背景实现细节

- 壁纸直接绘制在 `<body>` 上（`setProperty(..., 'important')` 覆盖主题的 `background` 简写）
- 布局容器（`.dsh-app`, `.dsh-layout`, `.dsh-layout__main`, `.dsh-layout__sidebar`, `.dsh-conversation`, `.dsh-panel`）设为 `rgba(15,23,42,0.75)` + `backdrop-filter: blur(8px)`，壁纸透出但文字可读
- 鼠标跟随蓝光：`body::after` 伪元素 + CSS 变量 `--bg-mx/--bg-my`，compositor-only，零重绘
- 隐藏宠物时同步移除壁纸和光效，恢复原主题