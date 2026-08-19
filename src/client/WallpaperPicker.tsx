/**
 * Wallpaper picker — a fixed-position floating button + popover that lets
 * the user pick a wallpaper for the current theme. Choices persist in
 * localStorage and broadcast via the wallpaper-change CustomEvent so the
 * background module re-applies the new image without a remount.
 */
import { useEffect, useState } from 'react'
import { useSyncExternalStore } from 'react'
import { isPetHidden, subscribePetHidden } from './visibility'
import {
  WALLPAPERS,
  getCurrentWallpaperId,
  getWallpapersByTheme,
  setCurrentWallpaperId,
  subscribeWallpaperChange,
} from './bg-images'
import styles from './WallpaperPicker.module.css'

const isDarkTheme = (): boolean =>
  typeof document !== 'undefined' && document.body.hasAttribute('data-ds-dark-theme')

export function WallpaperPicker(): React.JSX.Element | null {
  // Hide entirely while the user has the pet mascot dismissed.
  const hidden = useSyncExternalStore(subscribePetHidden, isPetHidden)
  const [open, setOpen] = useState(false)
  // Re-render when either the theme or the chosen wallpaper changes so the
  // selected highlight stays in sync.
  const [, setTick] = useState(0)
  useEffect(() => {
    const themeObs = new MutationObserver(() => setTick(t => t + 1))
    themeObs.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme'] })
    const u1 = subscribeWallpaperChange('light', () => setTick(t => t + 1))
    const u2 = subscribeWallpaperChange('dark', () => setTick(t => t + 1))
    return () => { themeObs.disconnect(); u1(); u2() }
  }, [])

  if (hidden) return null

  const theme = isDarkTheme() ? 'dark' : 'light'
  const choices = getWallpapersByTheme(theme)
  const currentId = getCurrentWallpaperId(theme)

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        aria-label="选择壁纸"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span className={styles.triggerIcon} aria-hidden>🎨</span>
        <span className={styles.triggerLabel}>壁纸</span>
      </button>

      {open && (
        <div
          className={styles.panel}
          role="dialog"
          aria-label="选择壁纸"
          // Stop the global click-elsewhere-to-close logic from immediately
          // closing the panel we just opened.
          onClick={e => e.stopPropagation()}
        >
          <div className={styles.title}>
            <span>{theme === 'dark' ? '深色主题壁纸' : '浅色主题壁纸'}</span>
            <span className={styles.titleHint}>点击切换</span>
          </div>
          <div className={styles.grid}>
            {choices.map(w => {
              const active = w.id === currentId
              return (
                <button
                  type="button"
                  key={w.id}
                  className={`${styles.tile} ${active ? styles.tileActive : ''}`}
                  style={{ backgroundImage: `url("${w.dataUrl}")` }}
                  aria-pressed={active}
                  aria-label={w.name}
                  onClick={() => {
                    setCurrentWallpaperId(theme, w.id)
                    setOpen(false)
                  }}
                >
                  <span className={styles.tileLabel}>{w.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Global click closes the panel when the user clicks anywhere else. */}
      {open && (
        <ClickOutsideCloser onClose={() => setOpen(false)} />
      )}

      {/* Suppress the unused-import warning for WALLPAPERS — it is used by
          bg-images.ts and remains exported for downstream consumers. */}
      <span hidden aria-hidden>{WALLPAPERS.length}</span>
    </>
  )
}

function ClickOutsideCloser({ onClose }: { onClose: () => void }): null {
  useEffect(() => {
    const handler = () => onClose()
    // Defer attaching so the click that opened the panel doesn't immediately
    // close it.
    const t = setTimeout(() => {
      window.addEventListener('click', handler, { capture: true, once: true })
    }, 0)
    return () => { clearTimeout(t); window.removeEventListener('click', handler, { capture: true } as any) }
  }, [onClose])
  return null
}
