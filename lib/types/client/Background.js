/**
 * Lightweight static engineer background.
 *
 * Paints the wallpaper directly on the page via element.style (inline style
 * has highest precedence — no CSS !important can override it).  Adds a
 * mouse-following radial glow via CSS custom properties on body::after.
 *
 * No portal, no extra DOM nodes, no z-index wars, no CSS specificity battles.
 */
import { useEffect } from 'react';
import { useSyncExternalStore } from 'react';
import { isPetHidden, subscribePetHidden } from './visibility';
import { BG_IMAGE } from './bg-image';
/** Glow pseudo-element CSS — only needs to exist once. */
const GLOW_CSS = `
body.dsh-glow::after {
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
export function EngineerBackground() {
    const hidden = useSyncExternalStore(subscribePetHidden, isPetHidden);
    useEffect(() => {
        if (hidden)
            return;
        // Inject glow pseudo-element CSS (cheap, no specificity conflict)
        const tag = document.createElement('style');
        tag.dataset.dshBg = '';
        tag.textContent = GLOW_CSS;
        document.head.appendChild(tag);
        // Activate glow pseudo-element
        document.body.classList.add('dsh-glow');
        // Paint wallpaper via inline style — highest precedence, cannot be overridden by any CSS
        const targets = [
            document.documentElement,
            document.body,
            document.getElementById('root'),
        ].filter(Boolean);
        for (const el of targets) {
            el.style.backgroundImage = `url("${BG_IMAGE}")`;
            el.style.backgroundSize = 'cover';
            el.style.backgroundPosition = 'center';
            el.style.backgroundRepeat = 'no-repeat';
        }
        // Mouse tracking — compositor-only, no React re-render
        const onMove = (e) => {
            document.body.style.setProperty('--bg-mx', `${(e.clientX / window.innerWidth) * 100}%`);
            document.body.style.setProperty('--bg-my', `${(e.clientY / window.innerHeight) * 100}%`);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', onMove);
            document.body.classList.remove('dsh-glow');
            document.body.style.removeProperty('--bg-mx');
            document.body.style.removeProperty('--bg-my');
            for (const el of targets) {
                el.style.removeProperty('background-image');
                el.style.removeProperty('background-size');
                el.style.removeProperty('background-position');
                el.style.removeProperty('background-repeat');
            }
            tag.remove();
        };
    }, [hidden]);
    return null;
}
//# sourceMappingURL=Background.js.map