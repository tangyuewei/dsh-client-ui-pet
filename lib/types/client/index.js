import { SaltedFishPet } from "./SaltedFishPet.js";
import { WallpaperPicker } from "./WallpaperPicker.js";
import { getWallpaperUrl, subscribeWallpaperChange } from "./bg-images.js";
import { isPetHidden, subscribePetHidden } from "./visibility.js";
export const name = '@deepseek-ai/dsh-client-ui-pet';
/** Required service: the slot registry (cordis fiber inject). */
export const inject = ['slots'];
/** Force a CSS property with !important — overrides `background` shorthand. */
const setBg = (el, prop, val) => el.style.setProperty(prop, val, 'important');
/** Get the currently selected wallpaper URL (theme-agnostic). */
const getBgUrl = () => getWallpaperUrl();
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

/* ===== Glassmorphism: frosted columns over the wallpaper =====
   NOTE: backdrop-filter MUST live on a ::before pseudo-element, not on the
   column itself. backdrop-filter on the column makes that element the
   containing block for descendant position:fixed elements, which would
   trap any portalled dialog/popover (e.g. the settings panel portal
   renders inside sidebarCol) inside the 280px column.

   We deliberately do NOT use isolation:isolate on the column either:
   isolation creates a stacking context, and Chrome clips fixed-position
   descendants of that context to its overflow:hidden. The ::before
   pseudo-element uses z-index:-1, which (without isolation) escapes to
   the body backdrop — yielding a uniform whole-page frosted glass look
   rather than a column-local blur. The half-transparent column backgrounds
   still layer cleanly on top. */

/* Sidebar: translucent + heavy blur so the wallpaper glows through, nav stays readable */
body.dsh-bg-glow [class$="sidebarCol"] {
  background: rgba(255, 255, 255, 0.55) !important;
  position: relative;
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.55);
}
body.dsh-bg-glow [class$="sidebarCol"]::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  -webkit-backdrop-filter: blur(26px) saturate(160%);
  backdrop-filter: blur(26px) saturate(160%);
}
body.dsh-bg-glow[data-ds-dark-theme] [class$="sidebarCol"] {
  background: rgba(21, 21, 23, 0.5) !important;
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.06);
}

/* Center column: in the LIGHT theme the wallpaper can wash out the foreground
   text, so we go noticeably more opaque here than the sidebar (0.55) and pair
   it with a slightly stronger blur to soften the underlying image. The dark
   theme keeps the original 0.62 since deep-toned wallpapers don't fight the
   text. */
body.dsh-bg-glow [class$="centerCol"] {
  background: rgba(255, 255, 255, 0.74) !important;
  position: relative;
}
body.dsh-bg-glow [class$="centerCol"]::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  -webkit-backdrop-filter: blur(22px) saturate(140%);
  backdrop-filter: blur(22px) saturate(140%);
}
body.dsh-bg-glow[data-ds-dark-theme] [class$="centerCol"] {
  background: rgba(21, 21, 23, 0.62) !important;
}
body.dsh-bg-glow[data-ds-dark-theme] [class$="centerCol"]::before {
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  backdrop-filter: blur(18px) saturate(140%);
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
        // Re-apply when the user picks a different wallpaper (theme-agnostic now).
        const unsubscribeWallpaper = subscribeWallpaperChange(() => {
            if (b.classList.contains('dsh-bg-glow'))
                applyWallpaper(b);
        });
        // Mouse tracking — compositor-only (for future use)
        const onMove = (e) => {
            b.style.setProperty('--bg-mx', `${(e.clientX / window.innerWidth) * 100}%`);
            b.style.setProperty('--bg-my', `${(e.clientY / window.innerHeight) * 100}%`);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        cleanup = () => {
            unsubscribeVisibility();
            themeObserver.disconnect();
            unsubscribeWallpaper();
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
            id: 'uiPet',
        }, SaltedFishPet));
        // --- Wallpaper picker: floating button + thumbnail panel ---
        const disposePicker = scope.slots.inject('shell.overlay', () => scope.slots.register({
            name: 'shell.overlay',
            id: 'wallpaperPicker',
        }, WallpaperPicker));
        return () => {
            cleanup();
            disposePet();
            disposePicker();
        };
    });
}
//# sourceMappingURL=index.js.map