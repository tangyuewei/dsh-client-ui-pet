/**
 * UI plugin: Salted fish pet overlay.
 * Registers a floating "QQ-pet"-style mascot into the shell-wide overlay layer
 * (shell.overlay, a list slot declared by ui-layout) so it floats above the
 * entire web UI without affecting layout.
 */
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { SaltedFishPet } from './SaltedFishPet.tsx'
import { BG_DARK, BG_LIGHT } from './bg-images.ts'

export const name = '@deepseek-ai/dsh-client-ui-salted-fish-pet'

/** Required service: the slot registry (cordis fiber inject). */
export const inject = ['slots'] as const

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'shell.overlay': { kind: 'list'; scope: 'root' }
  }
}

/** Force a CSS property with !important — overrides `background` shorthand. */
const setBg = (el: HTMLElement, prop: string, val: string) =>
  el.style.setProperty(prop, val, 'important')

/** Get current theme-appropriate background URL. */
const getBgUrl = () => {
  const dark = document.body.getAttribute('data-ds-dark-theme') === 'true'
  return dark ? BG_DARK : BG_LIGHT
}

/** Apply wallpaper to body. */
const applyWallpaper = (body: HTMLElement) => {
  const url = getBgUrl()
  setBg(body, 'background-image', `url("${url}")`)
  setBg(body, 'background-size', 'cover')
  setBg(body, 'background-position', 'center')
  setBg(body, 'background-repeat', 'no-repeat')
}

/** Remove wallpaper from body. */
const removeWallpaper = (body: HTMLElement) => {
  body.style.removeProperty('background-image')
  body.style.removeProperty('background-size')
  body.style.removeProperty('background-position')
  body.style.removeProperty('background-repeat')
}

export function apply(ctx: ClientContext) {
  let cleanup: () => void = () => {}

  ctx.inject(['slots'], (scope: ClientContext) => {
    // --- Background: wallpaper on body + glow pseudo-element ---

    const glowStyle = document.createElement('style')
    glowStyle.dataset.dshBg = ''
    glowStyle.textContent = `
/* Make theme backgrounds semi-transparent so body wallpaper shows through */
body.dsh-bg-glow {
  --dsw-alias-bg-base: transparent !important;
}
body.dsh-bg-glow #root,
body.dsh-bg-glow .dsh-app,
body.dsh-bg-glow .dsh-layout,
body.dsh-bg-glow .dsh-layout__main,
body.dsh-bg-glow .dsh-layout__sidebar,
body.dsh-bg-glow .dsh-conversation,
body.dsh-bg-glow .dsh-panel,
body.dsh-bg-glow .dsh-sidebar,
body.dsh-bg-glow [class*="sidebar"] {
  background: rgba(15, 23, 42, 0.75) !important; /* dark: slate-900 @ 75% */
  backdrop-filter: blur(8px);
}
/* Light theme override */
body[data-ds-dark-theme="false"].dsh-bg-glow #root,
body[data-ds-dark-theme="false"].dsh-bg-glow .dsh-app,
body[data-ds-dark-theme="false"].dsh-bg-glow .dsh-layout,
body[data-ds-dark-theme="false"].dsh-bg-glow .dsh-layout__main,
body[data-ds-dark-theme="false"].dsh-bg-glow .dsh-layout__sidebar,
body[data-ds-dark-theme="false"].dsh-bg-glow .dsh-conversation,
body[data-ds-dark-theme="false"].dsh-bg-glow .dsh-panel,
body[data-ds-dark-theme="false"].dsh-bg-glow .dsh-sidebar,
body[data-ds-dark-theme="false"].dsh-bg-glow [class*="sidebar"] {
  background: rgba(255, 255, 255, 0.85) !important; /* light: white @ 85% */
  backdrop-filter: blur(8px);
}
body.dsh-bg-glow::after {
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
    document.head.appendChild(glowStyle)

    const b = document.body
    b.classList.add('dsh-bg-glow')
    applyWallpaper(b)

    // Watch for theme changes and switch wallpaper
    const themeObserver = new MutationObserver(() => {
      if (b.classList.contains('dsh-bg-glow')) {
        applyWallpaper(b)
      }
    })
    themeObserver.observe(b, { attributes: true, attributeFilter: ['data-ds-dark-theme'] })

    // Mouse tracking — compositor-only
    const onMove = (e: MouseEvent) => {
      b.style.setProperty('--bg-mx', `${(e.clientX / window.innerWidth) * 100}%`)
      b.style.setProperty('--bg-my', `${(e.clientY / window.innerHeight) * 100}%`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    cleanup = () => {
      themeObserver.disconnect()
      window.removeEventListener('mousemove', onMove)
      b.classList.remove('dsh-bg-glow')
      b.style.removeProperty('--bg-mx')
      b.style.removeProperty('--bg-my')
      removeWallpaper(b)
      glowStyle.remove()
    }

    // --- Salted fish pet: React component via slot ---
    const disposePet = scope.slots.inject('shell.overlay', () =>
      scope.slots.register({
        name: 'shell.overlay',
        id: 'saltedFish',
      }, SaltedFishPet),
    )

    return () => {
      cleanup()
      disposePet()
    }
  })
}