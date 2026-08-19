/**
 * Wallpaper catalog. WALLPAPERS is auto-generated into bg-images.generated.ts
 * by the build (scripts/build-wallpapers.mjs runs before tsdown), so adding
 * an image = dropping a file into src/client/wallpapers/ — no manual
 * re-encoding is needed.
 *
 * Selection is theme-agnostic: the user can pick ANY wallpaper regardless of
 * light/dark mode (the old per-theme filtering is gone). The single choice is
 * persisted in localStorage and broadcast via a window CustomEvent so the
 * background module and the WallpaperPicker UI stay in sync.
 */
import { WALLPAPERS, type Wallpaper } from './bg-images.generated'

export { WALLPAPERS, type Wallpaper }

const STORAGE_KEY = 'dsh-ui-pet.wallpaper'
const CHANGE_EVENT = 'dsh-ui-pet:wallpaper-change'

/** Default wallpaper when no user choice has been persisted yet. */
export const DEFAULT_WALLPAPER_ID = 'yu7'

export function getCurrentWallpaperId(): string {
  if (typeof localStorage === 'undefined') return DEFAULT_WALLPAPER_ID
  return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_WALLPAPER_ID
}

export function setCurrentWallpaperId(id: string): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, id)
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { id } }))
}

export function getWallpaperUrl(): string {
  const id = getCurrentWallpaperId()
  return WALLPAPERS.find(w => w.id === id)?.dataUrl ?? WALLPAPERS[0]?.dataUrl ?? ''
}

/** All wallpapers, regardless of theme — the user picks freely. */
export function getAllWallpapers(): Wallpaper[] {
  return WALLPAPERS
}

export function subscribeWallpaperChange(cb: (id: string) => void): () => void {
  const handler = (e: Event) => {
    const ce = e as CustomEvent<{ id: string }>
    if (ce.detail?.id) cb(ce.detail.id)
  }
  window.addEventListener(CHANGE_EVENT, handler)
  return () => window.removeEventListener(CHANGE_EVENT, handler)
}
