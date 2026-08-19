/**
 * Wallpaper catalog. WALLPAPERS is auto-generated into bg-images.generated.ts
 * by `npm run bundle` (which runs scripts/build-wallpapers.mjs first), so
 * swapping the source images in src/client/wallpapers/ requires no manual
 * re-encoding — drop a new file in and re-run the bundle.
 *
 * Runtime selection (per theme) is persisted in localStorage and broadcast
 * via a window CustomEvent so the background module and the WallpaperPicker
 * UI stay in sync without prop drilling.
 */
import { WALLPAPERS, type Wallpaper } from './bg-images.generated'

export { WALLPAPERS, type Wallpaper }

const STORAGE_KEY = (theme: 'light' | 'dark') => `dsh-ui-pet.wallpaper.${theme}`
const CHANGE_EVENT = 'dsh-ui-pet:wallpaper-change'

/** Default per theme when no user choice has been persisted yet. */
export const DEFAULT_WALLPAPER_ID: Record<'light' | 'dark', string> = {
  light: 'porsche-718',
  dark: 'mcan-s',
}

export function getCurrentWallpaperId(theme: 'light' | 'dark'): string {
  if (typeof localStorage === 'undefined') return DEFAULT_WALLPAPER_ID[theme]
  return localStorage.getItem(STORAGE_KEY(theme)) ?? DEFAULT_WALLPAPER_ID[theme]
}

export function setCurrentWallpaperId(theme: 'light' | 'dark', id: string): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY(theme), id)
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { theme, id } }))
}

export function getWallpaperUrl(theme: 'light' | 'dark'): string {
  const id = getCurrentWallpaperId(theme)
  return (
    WALLPAPERS.find(w => w.id === id)?.dataUrl
    ?? WALLPAPERS.find(w => w.theme === theme)?.dataUrl
    ?? ''
  )
}

export function getWallpapersByTheme(theme: 'light' | 'dark'): Wallpaper[] {
  return WALLPAPERS.filter(w => w.theme === theme)
}

export function subscribeWallpaperChange(
  theme: 'light' | 'dark',
  cb: (id: string) => void,
): () => void {
  const handler = (e: Event) => {
    const ce = e as CustomEvent<{ theme: string; id: string }>
    if (ce.detail?.theme === theme) cb(ce.detail.id)
  }
  window.addEventListener(CHANGE_EVENT, handler)
  return () => window.removeEventListener(CHANGE_EVENT, handler)
}
