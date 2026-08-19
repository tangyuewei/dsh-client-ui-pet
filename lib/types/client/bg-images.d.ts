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
import { WALLPAPERS, type Wallpaper } from './bg-images.generated';
export { WALLPAPERS, type Wallpaper };
/** Default wallpaper when no user choice has been persisted yet. */
export declare const DEFAULT_WALLPAPER_ID = "yu7";
export declare function getCurrentWallpaperId(): string;
export declare function setCurrentWallpaperId(id: string): void;
export declare function getWallpaperUrl(): string;
/** All wallpapers, regardless of theme — the user picks freely. */
export declare function getAllWallpapers(): Wallpaper[];
export declare function subscribeWallpaperChange(cb: (id: string) => void): () => void;
//# sourceMappingURL=bg-images.d.ts.map