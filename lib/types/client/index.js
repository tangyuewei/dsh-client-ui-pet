import { SaltedFishPet } from "./SaltedFishPet.js";
import { BG_IMAGE } from "./bg-image.js";
export const name = '@deepseek-ai/dsh-client-ui-salted-fish-pet';
/** Required service: the slot registry (cordis fiber inject). */
export const inject = ['slots'];
/** Force a CSS property with !important — the only way to override
 *  `background: var(--dsw-alias-bg-base)` in base.css, because that
 *  shorthand implicitly resets `background-image: none` and no amount of
 *  normal inline style wins when the CSS engine re-resolves the shorthand. */
const setBg = (el, prop, val) => el.style.setProperty(prop, val, 'important');
export function apply(ctx) {
    // Background painted directly on <body> — no div, no slot, no z-index wars.
    // The `background` shorthand in base.css resets background-image to none;
    // setProperty with 'important' overrides it because !important beats the
    // non-important shorthand.  App containers inside #root that have their own
    // opaque backgrounds will cover the wallpaper, but the chat pane, sidebar
    // gaps, and any transparent area will show the desktop.jpg through body.
    let cleanup = () => { };
    ctx.inject(['slots'], (scope) => {
        // --- Background: wallpaper on body + glow pseudo-element ---
        const glowStyle = document.createElement('style');
        glowStyle.dataset.dshBg = '';
        glowStyle.textContent = `
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
`;
        document.head.appendChild(glowStyle);
        // Paint wallpaper on body — !important forces through the CSS shorthand
        const b = document.body;
        setBg(b, 'background-image', `url("${BG_IMAGE}")`);
        setBg(b, 'background-size', 'cover');
        setBg(b, 'background-position', 'center');
        setBg(b, 'background-repeat', 'no-repeat');
        b.classList.add('dsh-bg-glow');
        // Mouse tracking — compositor-only
        const onMove = (e) => {
            b.style.setProperty('--bg-mx', `${(e.clientX / window.innerWidth) * 100}%`);
            b.style.setProperty('--bg-my', `${(e.clientY / window.innerHeight) * 100}%`);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        cleanup = () => {
            window.removeEventListener('mousemove', onMove);
            b.classList.remove('dsh-bg-glow');
            b.style.removeProperty('--bg-mx');
            b.style.removeProperty('--bg-my');
            b.style.removeProperty('background-image');
            b.style.removeProperty('background-size');
            b.style.removeProperty('background-position');
            b.style.removeProperty('background-repeat');
            glowStyle.remove();
        };
        // --- Salted fish pet: React component via slot (unchanged) ---
        const disposePet = scope.slots.inject('shell.overlay', () => scope.slots.register({
            name: 'shell.overlay',
            id: 'saltedFish',
        }, SaltedFishPet));
        return () => {
            cleanup();
            disposePet();
        };
    });
}
//# sourceMappingURL=index.js.map