import { SaltedFishPet } from "./SaltedFishPet.js";
import { EngineerBackground } from "./Background.js";
export const name = '@deepseek-ai/dsh-client-ui-salted-fish-pet';
/** Required service: the slot registry (cordis fiber inject). */
export const inject = ['slots'];
export function apply(ctx) {
    // shell.overlay is a list slot: register under stable ids. Wait for the slot
    // to be declared (ui-layout applies its root layout during boot) before
    // registering, so the record exists at registration time and the overlay
    // rides the layout's lifetime.
    ctx.inject(['slots'], (scope) => {
        // Background layer (z-index: -2, behind all UI, reacts to pointer events)
        const disposeBg = scope.slots.inject('shell.overlay', () => scope.slots.register({
            name: 'shell.overlay',
            id: 'engineerBackground',
        }, EngineerBackground));
        // Salted fish pet (z-index: 9999, above all UI)
        const disposePet = scope.slots.inject('shell.overlay', () => scope.slots.register({
            name: 'shell.overlay',
            id: 'saltedFish',
        }, SaltedFishPet));
        return () => {
            disposeBg();
            disposePet();
        };
    });
}
//# sourceMappingURL=index.js.map