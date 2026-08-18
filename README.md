# @deepseek-ai/dsh-client-ui-salted-fish-pet

A QQ-pet-style floating salted fish mascot for the DeepSeek Harness web UI.

## Features

- 🐟 **咸鱼宠物**：全栈工程师专属 QQ 宠物，始终悬浮在页面右下角
- **交互能力**：点击喂食、拖拽移动、自动闲聊、8种心情+台词
- **召回/隐藏**：顶部按钮一键隐藏/显示宠物
- **情绪价值**：程序员笑话+开发技巧提示，气泡自动弹出
- **饱腹度系统**：点击恢复，缓慢衰减
- **视口边界**：拖拽时不会超出屏幕

## 安装

### 方法1：dsh plugin 命令（推荐）

```bash
# 在 dsh 安装目录下克隆
cd $DSH_HOME/profiles/node_modules
git clone https://github.com/<your-username>/dsh-salted-fish-pet.git @deepseek-ai/dsh-client-ui-salted-fish-pet

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
git clone https://github.com/<your-username>/dsh-salted-fish-pet.git
cd dsh-salted-fish-pet
pnpm install
pnpm run bundle  # 编译 lib/
```

## 自定义

编辑 `src/SaltedFishPet.tsx` 中的 `SPEECH` 和 `MOODS` 对象即可修改台词和心情。
