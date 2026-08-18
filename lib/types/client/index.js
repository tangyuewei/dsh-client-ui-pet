import { SaltedFishPet } from "./SaltedFishPet.js";
import { BG_DARK, BG_LIGHT } from "./bg-images.js";
import { isPetHidden, subscribePetHidden } from "./visibility.js";
export const name = '@deepseek-ai/dsh-client-ui-salted-fish-pet';
/** Required service: the slot registry (cordis fiber inject). */
export const inject = ['slots'];
/** Force a CSS property with !important — overrides `background` shorthand. */
const setBg = (el, prop, val) => el.style.setProperty(prop, val, 'important');
/** Get current theme-appropriate background URL. */
const getBgUrl = () => {
    const dark = document.body.hasAttribute('data-ds-dark-theme');
    return dark ? BG_DARK : BG_LIGHT;
};
/** Apply wallpaper to body. */
const applyWallpaper = (body) => {
    const url = getBgUrl();
    setBg(body, 'background-image', `url("${url}")`);
    setBg(body, 'background-size', 'cover');
    setBg(body, 'background-position', 'center');
    setBg(body, 'background-repeat', 'no-repeat');
};
/** Remove wallpaper from body. */
const removeWallpaper = (body) => {
    body.style.removeProperty('background-image');
    body.style.removeProperty('background-size');
    body.style.removeProperty('background-position');
    body.style.removeProperty('background-repeat');
};
export function apply(ctx) {
    let cleanup = () => { };
    ctx.inject(['slots'], (scope) => {
        // --- Background: wallpaper on body + CSS variable override (verified working) ---
        const glowStyle = document.createElement('style');
        glowStyle.dataset.dshBg = '';
        glowStyle.textContent = `
/* Verified working approach: make theme background transparent so body wallpaper shows through */
body.dsh-bg-glow,
body.dsh-bg-glow #root,
body.dsh-bg-glow #root * {
  --dsw-alias-bg-base: transparent !important;
}
`;
        document.head.appendChild(glowStyle);
        const b = document.body;
        // Initialize: check shared visibility store
        if (!isPetHidden()) {
            b.classList.add('dsh-bg-glow');
            applyWallpaper(b);
        }
        // Subscribe to shared visibility changes (pet button toggles)
        const unsubscribeVisibility = subscribePetHidden(() => {
            if (isPetHidden()) {
                b.classList.remove('dsh-bg-glow');
                removeWallpaper(b);
            }
            else {
                b.classList.add('dsh-bg-glow');
                applyWallpaper(b);
            }
        });
        // Watch for theme changes and switch wallpaper
        const themeObserver = new MutationObserver(() => {
            if (b.classList.contains('dsh-bg-glow')) {
                applyWallpaper(b);
            }
        });
        themeObserver.observe(b, { attributes: true, attributeFilter: ['data-ds-dark-theme'] });
        // Mouse tracking — compositor-only (for future use)
        const onMove = (e) => {
            b.style.setProperty('--bg-mx', `${(e.clientX / window.innerWidth) * 100}%`);
            b.style.setProperty('--bg-my', `${(e.clientY / window.innerHeight) * 100}%`);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        cleanup = () => {
            unsubscribeVisibility();
            themeObserver.disconnect();
            window.removeEventListener('mousemove', onMove);
            b.classList.remove('dsh-bg-glow');
            b.style.removeProperty('--bg-mx');
            b.style.removeProperty('--bg-my');
            removeWallpaper(b);
            glowStyle.remove();
        };
        // --- Salted fish pet: React component via slot ---
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