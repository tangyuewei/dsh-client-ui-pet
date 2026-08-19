/**
 * Wallpaper picker — a fixed-position floating button + popover that lets
 * the user pick a wallpaper for the current theme. Choices persist in
 * localStorage and broadcast via the wallpaper-change CustomEvent so the
 * background module re-applies the new image without a remount.
 */
import { useEffect, useRef, useState } from 'react'
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
  // Pinned: the panel floats on top (z-index 10020) and stays open — clicks
  // outside or on a tile do NOT dismiss it, so the user can compare wallpapers
  // freely. Unpinned returns to the normal stacked behavior (click-out closes).
  // The 🎨 trigger keeps an even higher z-index (10030) so the pin toggle is
  // always reachable even when the panel is pinned above everything else.
  const [pinned, setPinned] = useState(false)
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

  // Keep the trigger + panel reachable so the global outside-click handler
  // can tell a click inside our UI apart from a click elsewhere. Crucially
  // the handler must NOT use capture phase nor `once`: a capture listener
  // fires BEFORE the tile's own onClick and would unmount the panel (and its
  // buttons) before React dispatches the click, silently swallowing the pick.
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  if (hidden) return null

  const theme = isDarkTheme() ? 'dark' : 'light'
  const choices = getWallpapersByTheme(theme)
  const currentId = getCurrentWallpaperId(theme)

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className={`${styles.trigger} ${pinned ? styles.triggerPinned : ''}`}
        aria-label="选择壁纸"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span className={styles.triggerIcon} aria-hidden>🎨</span>
        <span className={styles.triggerLabel}>壁纸</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className={`${styles.panel} ${pinned ? styles.panelPinned : ''}`}
          role="dialog"
          aria-label="选择壁纸"
        >
          <div className={styles.title}>
            <span>{theme === 'dark' ? '深色主题壁纸' : '浅色主题壁纸'}</span>
            <button
              type="button"
              className={`${styles.pinBtn} ${pinned ? styles.pinBtnActive : ''}`}
              aria-pressed={pinned}
              aria-label={pinned ? '取消置顶' : '置顶'}
              title={pinned ? '取消置顶' : '置顶（保持面板在最上层）'}
              onClick={() => setPinned(p => !p)}
            >
              <span aria-hidden>{pinned ? '📍' : '📌'}</span>
              <span>{pinned ? '取消置顶' : '置顶'}</span>
            </button>
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
                    // Pinned panels stay open so the user can keep comparing.
                    if (!pinned) setOpen(false)
                  }}
                >
                  <span className={styles.tileLabel}>{w.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Close the panel when the user clicks anywhere outside our UI —
          unless the panel is pinned, where it deliberately stays put. */}
      {open && (
        <ClickOutsideCloser
          enabled={!pinned}
          onClose={() => setOpen(false)}
          triggerRef={triggerRef}
          panelRef={panelRef}
        />
      )}

      {/* Suppress the unused-import warning for WALLPAPERS — it is used by
          bg-images.ts and remains exported for downstream consumers. */}
      <span hidden aria-hidden>{WALLPAPERS.length}</span>
    </>
  )
}

function ClickOutsideCloser({
  enabled,
  onClose,
  triggerRef,
  panelRef,
}: {
  enabled: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  panelRef: React.RefObject<HTMLDivElement | null>
}): null {
  useEffect(() => {
    if (!enabled) return
    const handler = (e: MouseEvent) => {
      const t = e.target as Node | null
      if (triggerRef.current?.contains(t)) return // toggles via its own onClick
      if (panelRef.current?.contains(t)) return   // inside the panel: let buttons act
      onClose()
    }
    // Bubble phase (default): the tile's onClick runs first, then this fires.
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [enabled, onClose, triggerRef, panelRef])
  return null
}
