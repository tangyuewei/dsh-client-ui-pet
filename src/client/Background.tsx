/**
 * Lightweight static engineer background.
 *
 * Renders a full-viewport fixed layer behind all UI via portal to <body>:
 * - Desktop wallpaper image (covers viewport)
 * - A single mouse-following radial light (CSS custom properties, compositor-only
 *   transform — zero reflow, zero repaint, ~0 GPU cost beyond the image itself)
 *
 * No requestAnimationFrame, no setInterval, no floating symbols, no ripples.
 * Mouse tracking updates two CSS variables on the container element; the browser
 * composites the gradient position change entirely on the GPU compositor thread.
 */
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import css from './Background.module.css'
import { isPetHidden, subscribePetHidden } from './visibility'
import { BG_IMAGE } from './bg-image'

export function EngineerBackground(): React.JSX.Element | null {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Skip listeners entirely when hidden — the component returns null.
    const el = containerRef.current
    if (el === null) return

    const onMove = (e: MouseEvent) => {
      // Update CSS custom properties. The browser batches these into the
      // compositor paint; no layout or reflow occurs because only `--mx` /
      // `--my` change (consumed by a background-image radial-gradient whose
      // position references them).
      el.style.setProperty('--mx', `${(e.clientX / window.innerWidth) * 100}%`)
      el.style.setProperty('--my', `${(e.clientY / window.innerHeight) * 100}%`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  if (isPetHidden()) return null

  return createPortal(
    <div
      ref={containerRef}
      className={css.background}
      style={{
        '--mx': '50%',
        '--my': '50%',
        backgroundImage: `url("${BG_IMAGE}")`,
      } as React.CSSProperties}
    >
      <div className={css.light} />
      <div className={css.vignette} />
    </div>,
    document.body,
  )
}