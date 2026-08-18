/**
 * Lightweight static engineer background.
 *
 * Paints the wallpaper image directly on the page and adds a mouse-following
 * radial glow via CSS custom properties.  No portal, no extra DOM nodes.
 *
 * Approach: set background-image on both html and #root (the DSH theme's
 * body background can't be reliably overridden from a plugin, but #root
 * is the actual visible surface).  The glow is a body::after pseudo-element
 * at z-index: 99998 with pointer-events: none.
 */
import { useEffect } from 'react'
import { useSyncExternalStore } from 'react'
import { isPetHidden, subscribePetHidden } from './visibility'
import { BG_IMAGE } from './bg-image'

const STYLE_CSS = `
/* Wallpaper on html — always visible, even if #root has no explicit background */
html.dsh-bg-active {
  background-image: url("${BG_IMAGE}") !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
}
/* Wallpaper on #root as a fallback — it sits above body but below app content */
#root.dsh-bg-active {
  background-image: url("${BG_IMAGE}") !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
}
/* Mouse-following glow — body::after at highest z-index, pointer-events: none */
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
}
`

export function EngineerBackground(): React.JSX.Element | null {
  const hidden = useSyncExternalStore(subscribePetHidden, isPetHidden)

  useEffect(() => {
    if (hidden) return

    const tag = document.createElement('style')
    tag.dataset.dshBg = ''
    tag.textContent = STYLE_CSS
    document.head.appendChild(tag)

    // Activate on all three elements
    document.documentElement.classList.add('dsh-bg-active')
    document.body.classList.add('dsh-bg-active')
    const root = document.getElementById('root')
    root?.classList.add('dsh-bg-active')

    // Mouse tracking — compositor-only, no React re-render
    const onMove = (e: MouseEvent) => {
      document.body.style.setProperty('--bg-mx', `${(e.clientX / window.innerWidth) * 100}%`)
      document.body.style.setProperty('--bg-my', `${(e.clientY / window.innerHeight) * 100}%`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.classList.remove('dsh-bg-active')
      document.body.classList.remove('dsh-bg-active')
      root?.classList.remove('dsh-bg-active')
      document.body.style.removeProperty('--bg-mx')
      document.body.style.removeProperty('--bg-my')
      tag.remove()
    }
  }, [hidden])

  return null
}