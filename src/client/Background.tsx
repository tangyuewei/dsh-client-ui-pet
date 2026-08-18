/**
 * Lightweight static engineer background.
 *
 * Instead of portaling a div (which runs into body-background, stacking-context,
 * and .overlayLayer pointer-events issues), this component directly paints the
 * wallpaper image onto <body> via inline style + a CSS variable for the mouse
 * glow.  No extra DOM nodes, no z-index wars.
 *
 * - Mouse-following radial glow via CSS custom properties on body (compositor-only)
 * - No requestAnimationFrame, no setInterval, no floating symbols
 */
import { useEffect } from 'react'
import { useSyncExternalStore } from 'react'
import { isPetHidden, subscribePetHidden } from './visibility'
import { BG_IMAGE } from './bg-image'

/** Style tag injected into <head> to set the wallpaper + glow. */
const STYLE_CSS = `
body.dsh-bg-active {
  background-image: url("${BG_IMAGE}") !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
}
body.dsh-bg-active::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 99998;
  pointer-events: none;
  background: radial-gradient(
    ellipse 600px 600px at var(--bg-mx, 50%) var(--bg-my, 50%),
    rgba(57, 100, 254, 0.1),
    transparent 70%
  );
  transition: background 0.05s ease-out;
}
`

export function EngineerBackground(): React.JSX.Element | null {
  const hidden = useSyncExternalStore(subscribePetHidden, isPetHidden)

  useEffect(() => {
    if (hidden) return

    // Inject stylesheet
    const tag = document.createElement('style')
    tag.dataset.dshBg = ''
    tag.textContent = STYLE_CSS
    document.head.appendChild(tag)

    // Activate
    document.body.classList.add('dsh-bg-active')

    // Mouse tracking — update CSS variables directly on body (no React re-render)
    const onMove = (e: MouseEvent) => {
      document.body.style.setProperty('--bg-mx', `${(e.clientX / window.innerWidth) * 100}%`)
      document.body.style.setProperty('--bg-my', `${(e.clientY / window.innerHeight) * 100}%`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.body.classList.remove('dsh-bg-active')
      document.body.style.removeProperty('--bg-mx')
      document.body.style.removeProperty('--bg-my')
      tag.remove()
    }
  }, [hidden])

  return null
}