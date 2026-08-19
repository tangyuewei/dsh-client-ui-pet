#!/usr/bin/env node
/**
 * Dev watch loop:
 *   1. run scripts/build-wallpapers.mjs once (encode current wallpapers/)
 *   2. spawn `tsdown --watch` (rebuilds lib on any src change, including the
 *      regenerated bg-images.generated.ts)
 *   3. watch src/client/wallpapers/ — when an image is added/removed, re-run
 *      the wallpaper prebuild so tsdown picks up the new generated file.
 *
 * Result: dropping a file into src/client/wallpapers/ while this runs is
 * enough — no manual `npm run bundle` needed.
 */
import { execFileSync, spawn } from 'node:child_process'
import { watch } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const wallpapersDir = join(root, 'src', 'client', 'wallpapers')
const prebuild = [process.execPath, [join(root, 'scripts', 'build-wallpapers.mjs')]]

const runPrebuild = () => {
  try {
    execFileSync(prebuild[0], prebuild[1], { stdio: 'inherit' })
  } catch (e) {
    console.error('[watch] wallpaper prebuild failed:', e.message)
  }
}

// Initial encode, then watch sources.
runPrebuild()
const tsdown = spawn('npx', ['tsdown', '--watch'], {
  cwd: root,
  stdio: 'inherit',
})

// Debounce: multiple files may land in one drag&drop.
let timer = null
try {
  watch(wallpapersDir, { recursive: true }, (_event, filename) => {
    if (!filename) return
    clearTimeout(timer)
    timer = setTimeout(runPrebuild, 300)
  })
  console.log(`[watch] watching ${wallpapersDir} — drop new wallpapers here and they auto-encode.`)
} catch (e) {
  console.error('[watch] cannot watch wallpapers dir:', e.message)
}

const shutdown = () => {
  clearTimeout(timer)
  tsdown?.kill('SIGTERM')
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
