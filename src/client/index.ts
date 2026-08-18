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
  // --- Engineer background: pure DOM layer, not a slot ---
  // The slot renderer passes the `name` config property as a React element
  // prop, and React 19 rejects non-string `name` on DOM elements.  Beyond that,
  // `base.css` sets `background: var(--dsw-alias-bg-base)` on html/body/#root
  // — the `background` shorthand implicitly resets background-image to none,
  // so any inline `style.backgroundImage` on those elements is overridden by
  // the later CSS rule.
  //
  // The only reliable path is a sibling DOM node positioned beneath #root:
  // insert a full-viewport div as the FIRST child of #root, with z-index: 0
  // and #root's content stacking above via `position: relative; z-index: 1`.
  let cleanup: () => void = () => {}

  ctx.inject(['slots'], (scope: ClientContext) => {
    // --- Background injection ---

    // 1. Wait for #root to exist (it must, since ui-layout renders into it).
    const root = document.getElementById('root')
    if (root === null) {
      // Plugin booted before #root mounted — defer to next tick.
      const id = window.setTimeout(() => { /* nothing; apply already returned */ }, 0)
      return () => { window.clearTimeout(id); disposePet() }
    }

    // 2. Create the wallpaper layer as a sibling positioned beneath #root's
    //    content.  `position: absolute` + `inset: 0` + parent (body) full-height
    //    from base.css gives a true full-viewport layer.
    const layer = document.createElement('div')
    layer.dataset.dshBgLayer = ''
    layer.style.cssText = [
      'position: fixed',
      'inset: 0',
      'z-index: 0',
      'pointer-events: none',
      `background-image: url("${BG_IMAGE}")`,
      'background-size: cover',
      'background-position: center',
      'background-repeat: no-repeat',
    ].join('; ')
    document.body.insertBefore(layer, document.body.firstChild)

    // 3. Lift #root above the wallpaper.  Set inline z-index so a later theme
    //    update cannot re-sink it; `position: relative` is harmless since base
    //    CSS only paints body backgrounds.
    const prevRootPos = root.style.position
    const prevRootZ = root.style.zIndex
    root.style.position = 'relative'
    root.style.zIndex = '1'

    // 4. Mouse-tracking glow via body::after pseudo-element, pointer-events none.
    const style = document.createElement('style')
    style.dataset.dshBg = ''
    style.textContent = `
body::after {
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

    // 5. Mouse tracking — compositor-only, no React re-render.
    const onMove = (e: MouseEvent) => {
      document.body.style.setProperty('--bg-mx', `${(e.clientX / window.innerWidth) * 100}%`)
      document.body.style.setProperty('--bg-my', `${(e.clientY / window.innerHeight) * 100}%`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    cleanup = () => {
      window.removeEventListener('mousemove', onMove)
      style.remove()
      layer.remove()
      root.style.position = prevRootPos
      root.style.zIndex = prevRootZ
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