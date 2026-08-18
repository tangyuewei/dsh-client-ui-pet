/**
 * UI plugin: Salted fish pet overlay.
 * Registers a floating "QQ-pet"-style mascot into the shell-wide overlay layer
 * (shell.overlay, a list slot declared by ui-layout) so it floats above the
 * entire web UI without affecting layout.
 */
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { SaltedFishPet } from './SaltedFishPet.tsx'
import { BG_IMAGE } from './bg-image.ts'

export const name = '@deepseek-ai/dsh-client-ui-salted-fish-pet'

/** Required service: the slot registry (cordis fiber inject). */
export const inject = ['slots'] as const

// shell.overlay is declared (children table) by ui-layout's root layout entry;
// republish the key here so this package's program sees the SlotMap merge.
// ui-layout cannot import this augmentation back (dependency direction), so the
// consumer declares the key it contributes into.
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'shell.overlay': { kind: 'list'; scope: 'root' }
  }
}

export function apply(ctx: ClientContext) {
  // --- Engineer background: pure DOM, no React, no slot ---
  // Must NOT go through the slot system: slot registration passes the `name`
  // config property as a React element prop, and React 19 rejects non-string
  // `name` on DOM elements.  Instead we paint the wallpaper directly on
  // <html> and <body> via inline styles (highest CSS precedence) and add a
  // mouse-tracking glow via a body::after pseudo-element.
  let cleanup: () => void = () => {}

  ctx.inject(['slots'], (scope: ClientContext) => {
    // --- Background injection (synchronous, no dynamic import needed) ---

    // Style tag for glow pseudo-element
    const style = document.createElement('style')
    style.dataset.dshBg = ''
    style.textContent = `
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
    document.head.appendChild(style)

    // Paint wallpaper via inline style on html + body
    const targets = [document.documentElement, document.body]
    for (const el of targets) {
      el.style.backgroundImage = `url("${BG_IMAGE}")`
      el.style.backgroundSize = 'cover'
      el.style.backgroundPosition = 'center'
      el.style.backgroundRepeat = 'no-repeat'
    }
    document.body.classList.add('dsh-bg-active')

    // Also try #root in case it has its own opaque background
    const root = document.getElementById('root')
    if (root) {
      root.style.backgroundImage = `url("${BG_IMAGE}")`
      root.style.backgroundSize = 'cover'
      root.style.backgroundPosition = 'center'
      root.style.backgroundRepeat = 'no-repeat'
    }

    // Mouse tracking — compositor-only, no React re-render
    const onMove = (e: MouseEvent) => {
      document.body.style.setProperty('--bg-mx', `${(e.clientX / window.innerWidth) * 100}%`)
      document.body.style.setProperty('--bg-my', `${(e.clientY / window.innerHeight) * 100}%`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    cleanup = () => {
      window.removeEventListener('mousemove', onMove)
      document.body.classList.remove('dsh-bg-active')
      document.body.style.removeProperty('--bg-mx')
      document.body.style.removeProperty('--bg-my')
      for (const el of targets) {
        el.style.removeProperty('background-image')
        el.style.removeProperty('background-size')
        el.style.removeProperty('background-position')
        el.style.removeProperty('background-repeat')
      }
      if (root) {
        root.style.removeProperty('background-image')
        root.style.removeProperty('background-size')
        root.style.removeProperty('background-position')
        root.style.removeProperty('background-repeat')
      }
      style.remove()
    }

    // --- Salted fish pet: React component via slot (unchanged) ---
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