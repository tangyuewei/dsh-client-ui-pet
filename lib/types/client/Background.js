import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Lightweight static engineer background.
 *
 * Renders a full-viewport fixed layer behind all UI via portal to <body>:
 * - Desktop wallpaper image (covers viewport)
 * - A single mouse-following radial light (CSS custom properties, compositor-only
 *   transform — zero reflow, zero repaint, ~0 GPU cost beyond the image itself)
 *
 * No requestAnimationFrame, no setInterval, no floating symbols, no ripples.
 * Mouse tracking updates two CSS variables on the container element; the browser
 * composites the gradient position change entirely on the GPU compositor thread.
 */
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import css from './Background.module.css';
import { isPetHidden } from './visibility';
import { BG_IMAGE } from './bg-image';
export function EngineerBackground() {
    const containerRef = useRef(null);
    // Make body background transparent so the z-index: -2 wallpaper is visible.
    // The opaque body background paints over any child with negative z-index.
    useEffect(() => {
        if (isPetHidden())
            return;
        const tag = document.createElement('style');
        tag.dataset.dshPetBg = '';
        tag.textContent = 'body { background: transparent !important; }';
        document.head.appendChild(tag);
        return () => { tag.remove(); };
    }, []);
    useEffect(() => {
        const el = containerRef.current;
        if (el === null)
            return;
        const onMove = (e) => {
            el.style.setProperty('--mx', `${(e.clientX / window.innerWidth) * 100}%`);
            el.style.setProperty('--my', `${(e.clientY / window.innerHeight) * 100}%`);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
    }, []);
    if (isPetHidden())
        return null;
    return createPortal(_jsxs("div", { ref: containerRef, className: css.background, style: {
            '--mx': '50%',
            '--my': '50%',
            backgroundImage: `url("${BG_IMAGE}")`,
        }, children: [_jsx("div", { className: css.light }), _jsx("div", { className: css.vignette })] }), document.body);
}
//# sourceMappingURL=Background.js.map