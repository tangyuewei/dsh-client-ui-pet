/**
 * UI plugin: Salted fish pet overlay.
 * Registers a floating "QQ-pet"-style mascot into the shell-wide overlay layer
 * (shell.overlay, a list slot declared by ui-layout) so it floats above the
 * entire web UI without affecting layout.
 */
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { SaltedFishPet } from './SaltedFishPet.tsx'
import { EngineerBackground } from './Background.tsx'

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
  // shell.overlay is a list slot: register under stable ids. Wait for the slot
  // to be declared (ui-layout applies its root layout during boot) before
  // registering, so the record exists at registration time and the overlay
  // rides the layout's lifetime.
  ctx.inject(['slots'], (scope: ClientContext) => {
    // Background layer (z-index: -2, behind all UI, reacts to pointer events)
    const disposeBg = scope.slots.inject('shell.overlay', () =>
      scope.slots.register({
        name: 'shell.overlay',
        id: 'engineerBackground',
      }, EngineerBackground),
    )

    // Salted fish pet (z-index: 9999, above all UI)
    const disposePet = scope.slots.inject('shell.overlay', () =>
      scope.slots.register({
        name: 'shell.overlay',
        id: 'saltedFish',
      }, SaltedFishPet),
    )

    return () => {
      disposeBg()
      disposePet()
    }
  })
}
