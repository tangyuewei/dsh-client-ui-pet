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

  // Ensure body is transparent AND #root stacks above the background layer.
  // z-index: -2 on a child of body is painted behind body's own background —
  // a known CSS stacking-context gotcha. Instead we paint the wallpaper at
  // z-index: 1 and lift #root to z-index: 2 so the app content always sits on top.
  useEffect(() => {
    if (isPetHidden()) return
    const tag = document.createElement('style')
    tag.dataset.dshPetBg = ''
    tag.textContent = [
      'body { background: transparent !important; }',
      '#root { position: relative; z-index: 2; }',
    ].join('\n')
    document.head.appendChild(tag)
    return () => { tag.remove() }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (el === null) return
    const onMove = (e: MouseEvent) => {
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