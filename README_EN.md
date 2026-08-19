# @tangyuewei/dsh-client-ui-pet

> **Salted Fish Pet** — A desktop mascot plugin for the DeepSeek Harness Web UI. A floating salted fish mascot anchored at the bottom-right corner, layered over a full-viewport engineer-themed wallpaper. Purely front-end presentation; no server-side behavior.

[中文](./README.md)

## Introduction

`ui-pet` is a Cordis-based client UI plugin (`platform: 'web'`). It injects two parts into the `shell.overlay` slot of the DeepSeek Harness (DSH) Web Shell:

1. **Salted Fish Pet**: a draggable, feedable salted fish mascot that occasionally complains at random;
2. **Engineer Wallpaper**: full-viewport wallpaper (theme-agnostic — drop images into `wallpapers/` to add candidates), shown through the transparent theme background.

Both parts are linked via module-level shared state (`visibility.ts`): clicking "Hide Salted Fish" collapses the pet and the wallpaper together.

## Demo

![ui-pet demo](docs/demo.gif)

*Demo: default `yu7` glass background + salted fish → open wallpaper panel → switch to Porsche 718 → 📌 pin (background full-screen on top) → unpin → switch to Macan S (dark wallpapers are also selectable — light/dark not restricted).*

## Features

### Salted Fish Pet

- **Fixed anchor**: defaults to the bottom-right corner of the viewport (`MARGIN = 20px` inset).
- **Drag**: drag the fish body to move; automatically clamped inside the visible viewport; re-anchors automatically when the window shrinks and pushes it out of bounds.
- **Click to feed**: click the fish to restore hunger +25 (cap 100), triggering the "Happy" mood and a random line.
- **Hunger system**: decays 1 point every 30 seconds naturally; at 0 the pet switches to the "Has Bug" mood.
- **8 moods**: Happy 🐟, Dizzy 🐡, Burning 🔥, Sleeping 😴, Has Bug 🐛, Revived ☕, Takeoff 🚀, Table-flip 😡.
- **Speech bubbles**: each mood carries a programmer joke + dev tip, auto-dismissed after 3 seconds.
- **Idle rambling**: randomly triggers a mood + line every 8–15 seconds.

### Engineer Wallpaper

- **Multiple candidates**: 7 images (Porsche 718 / Yu7 ×3 / Macan S / Su7 ×2) are auto-resized to 1920px JPEG and base64-encoded into `bg-images.generated.ts` by `scripts/build-wallpapers.mjs`; drop an image in to add a candidate.
- **Theme-agnostic**: all wallpapers selectable under any theme (no more light/dark grouping); the selection is one global id, persisted to `localStorage` (`dsh-ui-pet.wallpaper`).
- **Runtime switching**: the 🎨 button at the bottom-right (`WallpaperPicker`) opens a thumbnail panel of all wallpapers; click to switch; supports 📌 pin (background full-screen on top, panel stays open for comparison; unpin restores).
- **Default wallpaper**: `yu7.jpg` when no selection has been made.
- **Drop-and-go (dev)**: with `npm run watch` running, dropping images into `src/client/wallpapers/` auto-re-encodes and rebuilds — no manual `npm run bundle` needed.
- **Reveal mechanism**: the theme background base color is set to transparent via CSS variables (`--dsw-alias-bg-base: transparent`), so the wallpaper shows through from `body` — no extra DOM nodes or z-index contention.
- **Glassmorphism columns**: sidebar and center column use translucency + `backdrop-filter: blur + saturate` so the wallpaper tint blurs through while navigation and body text stay readable, for a modern tech feel; matched via end-of-class selectors `[class$="sidebarCol"]` / `[class$="centerCol"]` (relying only on CSS Modules local-name suffixes, not hash prefixes), with per-theme opacity (light centerCol opacity 0.74 + 22px blur for readability).
- **Mouse tracking**: `mousemove` (`passive`) writes `--bg-mx/--bg-my` CSS variables in real time, feeding the mouse-follow glow (see `EngineerBackground` in `Background.tsx`).

### Summon / Hide

- An inline **Summon Salted Fish / Hide Salted Fish** button sits left of the "Session log" button in the top nav (positioned dynamically by the pet component).
- One click hides the pet **and** removes the background wallpaper, restoring the original theme background.
- Click again to summon; pet and background restore together.

## Architecture

| Layer | Description |
|-------|-------------|
| **Package type** | Pure client UI plugin (`platform: 'web'`) |
| **Host-side behavior** | None (`src/index.ts` exports only an empty `apply()` to satisfy the Cordis Loader) |
| **Browser entry** | `exports["./client"]` → `src/client/index.ts` |
| **Slot registration** | `shell.overlay`, entry `id: 'uiPet'` (pet component) |
| **Wallpaper mounting** | Applied directly to `body` inside `apply()` in `src/client/index.ts`, not a separate slot |
| **Shared state** | `visibility.ts` module-level store syncs pet/background visibility |

### Directory layout

```
src/
├── index.ts                 # Host entry (empty apply)
├── invariant.ts             # Plugin invariant placeholder
├── client/
│   ├── index.ts             # Browser plugin: wallpaper + glass + slot registration
│   ├── SaltedFishPet.tsx    # Salted fish pet React component
│   ├── WallpaperPicker.tsx  # Bottom-right 🎨 floating button + thumbnail panel
│   ├── visibility.ts        # Pet/background shared visibility state
│   ├── bg-images.ts         # Wallpaper API: WALLPAPERS + localStorage persistence + event bus
│   ├── bg-image.ts          # Legacy single-wallpaper constant (BG_IMAGE, leftover)
│   ├── Background.tsx       # Engineer wallpaper component (EngineerBackground, leftover)
│   ├── SaltedFishPet.module.css
│   ├── Background.module.css
│   ├── WallpaperPicker.module.css
│   └── wallpapers/          # Wallpaper source images: drop + npm run bundle to add candidates
│       ├── porsche-718.jpg
│       ├── mcan-s.jpg
│       ├── yu7-3.jpg
│       ├── yu7.jpg
│       ├── yu7-gt.jpg
│       ├── su7-1.png
│       └── su7.png
└── css-modules.d.ts

scripts/
└── build-wallpapers.mjs    # prebuild: scan wallpapers/ → sips resize → base64 → bg-images.generated.ts
```

## Installation

### Method A: npm published package (for `npx @deepseek-ai/dsh web` users)

If you run DeepSeek Harness via `npx @deepseek-ai/dsh web` (without cloning the source), use DSH's built-in **profile plugin management command** to install this plugin. You do **not** need to clone the repo or run `install.sh` (`install.sh` is only for the source-build scenario):

```bash
npx @deepseek-ai/dsh plugin --profile web add @tangyuewei/dsh-client-ui-pet
```

> **Prerequisite**: `pnpm` must be installed on your machine (`dsh plugin add` essentially runs `pnpm add` inside the profile directory).

What this command does:

1. On first run it initializes the **persistent profile directory `~/.dsh/profiles/web`** (independent of the npx cache — it survives new terminals / re-running npx);
2. Runs `pnpm add @tangyuewei/dsh-client-ui-pet` in that directory, installing the plugin and its peer dependencies;
3. Because the plugin declares `dsh.bundle.patch`, the package name is appended to the profile's `dsh.profile.bundles` list automatically;
4. On subsequent `npx @deepseek-ai/dsh web` startup, DSH stacks the plugin's `cordis.patch.yml` in bundle order, injecting the salted fish pet and wallpaper into `shell.overlay`.

After installation, restart `npx @deepseek-ai/dsh web` and you'll see the salted fish pet and engineer wallpaper at the bottom-right (verify via Settings → Plugins that the plugin is enabled).

To uninstall:

```bash
npx @deepseek-ai/dsh plugin --profile web remove @tangyuewei/dsh-client-ui-pet
```

### Method B: building DeepSeek Harness from source

The steps below apply to running from a DeepSeek Harness source checkout. Clone the official repo and make sure `pnpm dsh web` starts correctly first.

### Step 1: put the plugin into the client directory

```bash
cd $DSH_HOME/packages/client/
git clone https://github.com/tangyuewei/dsh-client-ui-pet.git
```

> After cloning, the directory name is already `dsh-client-ui-pet` — no rename needed, and no separate build inside the plugin directory; the one-shot script in Step 2 handles everything.

### Step 2: run the one-shot install script

```bash
cd dsh-client-ui-pet
bash install.sh
```

The script registers the dependency, installs and builds, printing progress step by step; any failing step prints an `[ERROR]` and aborts (non-zero exit code). No manual file edits needed:

1. **Environment check**: verifies `git` / `node` / `pnpm` are available and the DSH source tree is complete;
2. **Auto-locate DSH_HOME**: defaults to three levels above the script directory (`dsh-client-ui-pet` → `packages/client` → `packages` → `$DSH_HOME`); override with `DSH_HOME=/path/to/dsh bash install.sh` if the DSH source lives elsewhere;
3. **Register the dependency**: adds `@tangyuewei/dsh-client-ui-pet: "workspace:^"` to `packages/bundle/web-app/package.json` `dependencies`;
4. **Register the plugin entry**: appends the plugin entry to the `- insert:` block of `packages/bundle/web-app/cordis.patch.yml` (id and name read automatically from the plugin's own `package.json` / `cordis.patch.yml` — no manual sync);
5. **Install & build**: back in `$DSH_HOME`, runs `pnpm install` then `pnpm run build`.

> Idempotent: existing entries are skipped automatically, so re-running is safe; re-run any time after fixing issues.

### Step 3: start

```bash
pnpm dsh web
```

Once loaded you'll see the salted fish pet and engineer wallpaper in the bottom-right of the browser. Confirm via Settings → Plugins that `@tangyuewei/dsh-client-ui-pet` is enabled.

## Customization

| File | What you can change |
|------|--------------------|
| `src/client/SaltedFishPet.tsx` | `MOODS` (emoji/tag), `SPEECH` lines, hunger decay interval, idle trigger interval, fish size (`PET_W`/`PET_H`) and margin (`MARGIN`) |
| `src/client/bg-images.ts` | Wallpaper API: global selection (theme-agnostic), localStorage persistence, event bus |
| `src/client/wallpapers/` | Wallpaper source images: drop images to auto-add candidates (prebuild resize + base64, see "Add / replace wallpapers" below) |
| `src/client/index.ts` | Transparent background variable names, mouse-follow variables, wallpaper application logic, glassmorphism columns, user-selection event bus |
| `src/client/WallpaperPicker.tsx` · `WallpaperPicker.module.css` | Floating 🎨 button + all-wallpaper thumbnail dialog (runtime switching, pinning) |
| `src/client/SaltedFishPet.module.css` · `Background.module.css` | Pet / bubble / hunger-bar styles, animation keyframes |

### Common tweaks

**Change hunger decay speed** (`SaltedFishPet.tsx`):

```ts
// original: -1 every 30s
setHunger(h => Math.max(0, h - 1))
}, 30000)
// change: -1 every 60s
}, 60000)
```

**Add / replace wallpapers**

Drop images into `src/client/wallpapers/`; the filename becomes the id (e.g. `yu7.jpg` → id `yu7`):

```bash
# dev (recommended): one-shot start; afterwards dropped images auto-re-encode + rebuild
npm run watch

# or one-shot build
npm run bundle   # = node scripts/build-wallpapers.mjs && tsdown
```

The prebuild script uses `sips` (macOS) to resize each image to 1920px wide + convert to JPEG, base64-encodes them into `bg-images.generated.ts` (gitignored, regenerated on every build), then `tsdown` bundles the new content into `lib/client.js`. **No manual base64 encoding needed.**

Wallpaper display names live in the `META` map at the top of `scripts/build-wallpapers.mjs` (no light/dark grouping — all wallpapers visible under every theme):

```js
const META = {
  'porsche-718': { name: 'Porsche 718' },
  'yu7':         { name: 'Yu7 · Road' },
  'mcan-s':      { name: 'Macan S' },
  // ...
}
```

**Change the default wallpaper** (`src/client/bg-images.ts`): set `DEFAULT_WALLPAPER_ID` to any wallpaper id (default `yu7`).

**Runtime switching**: 🎨 button at the bottom-right → all-wallpaper thumbnail panel (light/dark not restricted) → click to switch, persisted to localStorage (`dsh-ui-pet.wallpaper`), retained across refresh/restart.

## Compatibility

- **Web only**: `package.json` declares `dsh.client.platform: 'web'`; no Node / CLI / ACP entry.
- **Zero service dependencies**: consumes no Cordis services (only the `slots` slot injection); pure React components + module-level store.
- **Style isolation**: CSS Modules (`SaltedFishPet.module.css`, `Background.module.css`), no global pollution.
- **Theme integration**: relies on DSH Web Shell's `body[data-ds-dark-theme]` attribute for switching.

## Known limitations

- **No persistence**: pet position, hunger, mood, and visibility are session-level in-memory state; reset on refresh.
- **No settings panel**: all parameters require source changes and a rebuild; not exposed to user settings.
- **Wallpaper candidates managed centrally**: all candidates (theme-agnostic) are embedded as base64 in `bg-images.generated.ts` (auto-generated by prebuild), no external requests; dynamic loading requires custom work.
- **Summon button locates via DOM search**: finds the "Session log" button; may break if the Shell structure changes.
- **Limited accessibility**: the pet interaction area has `role="button"` and `tabIndex`, but lacks full ARIA attributes and keyboard operation.
- **Glow is a leftover**: the mouse-follow glow styles live in the unmounted `Background.tsx` (`EngineerBackground`); the current wallpaper path does not render the glow.

## License

MIT
