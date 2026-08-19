/**
 * UI plugin: Salted fish pet overlay.
 * Registers a floating mascot into the shell-wide overlay layer
 * (shell.overlay, a list slot declared by ui-layout).
 */
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { SaltedFishPet } from './SaltedFishPet.tsx'
import { BG_DARK, BG_LIGHT } from './bg-images.ts'
import { isPetHidden, subscribePetHidden } from './visibility.ts'

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
  const dark = document.body.hasAttribute('data-ds-dark-theme')
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
    // --- Background: wallpaper on body + CSS variable override (verified working) ---

    const glowStyle = document.createElement('style')
    glowStyle.dataset.dshBg = ''
    glowStyle.textContent = `
/* Verified working approach: make theme background transparent so body wallpaper shows through */
body.dsh-bg-glow,
body.dsh-bg-glow #root,
body.dsh-bg-glow #root * {
  --dsw-alias-bg-base: transparent !important;
}

/* ===== Glassmorphism: frosted columns over the wallpaper ===== */
/* Sidebar: translucent + heavy blur so the wallpaper glows through, nav stays readable */
body.dsh-bg-glow [class$="sidebarCol"] {
  background: rgba(255, 255, 255, 0.5) !important;
  -webkit-backdrop-filter: blur(26px) saturate(160%);
  backdrop-filter: blur(26px) saturate(160%);
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.55);
}
body.dsh-bg-glow[data-ds-dark-theme] [class$="sidebarCol"] {
  background: rgba(21, 21, 23, 0.5) !important;
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.06);
}

/* Center column: translucent + moderate blur, more solid than sidebar for text legibility */
body.dsh-bg-glow [class$="centerCol"] {
  background: rgba(255, 255, 255, 0.62) !important;
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  backdrop-filter: blur(18px) saturate(140%);
}
body.dsh-bg-glow[data-ds-dark-theme] [class$="centerCol"] {
  background: rgba(21, 21, 23, 0.62) !important;
}
`
    document.head.appendChild(glowStyle)

    const b = document.body

    // Initialize: check shared visibility store
    if (!isPetHidden()) {
      b.classList.add('dsh-bg-glow')
      applyWallpaper(b)
    }

    // Subscribe to shared visibility changes (pet button toggles)
    const unsubscribeVisibility = subscribePetHidden(() => {
      if (isPetHidden()) {
        b.classList.remove('dsh-bg-glow')
        removeWallpaper(b)
      } else {
        b.classList.add('dsh-bg-glow')
        applyWallpaper(b)
      }
    })

    // Watch for theme changes and switch wallpaper
    const themeObserver = new MutationObserver(() => {
      if (b.classList.contains('dsh-bg-glow')) {
        applyWallpaper(b)
      }
    })
    themeObserver.observe(b, { attributes: true, attributeFilter: ['data-ds-dark-theme'] })

    // Mouse tracking — compositor-only (for future use)
    const onMove = (e: MouseEvent) => {
      b.style.setProperty('--bg-mx', `${(e.clientX / window.innerWidth) * 100}%`)
      b.style.setProperty('--bg-my', `${(e.clientY / window.innerHeight) * 100}%`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    cleanup = () => {
      unsubscribeVisibility()
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
