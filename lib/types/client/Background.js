import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Interactive "senior full-stack engineer" background overlay.
 * Renders a fixed full-viewport layer with:
 * - Mouse-following radial light gradient
 * - Click ripple particles
 * - Floating code symbols that drift
 * - Subtle grid + scan-line texture
 * - Glass-morphism depth layers
 *
 * Pure presentational; all interactivity via pointer events and timers.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import css from './Background.module.css';
const CODE_SYMBOLS = ['{ }', '< />', '[ ]', '=>', '::', '&&', '||', '//', ';;', '$', '@', '#', 'fn()', 'let', 'pub', 'mod', 'impl', 'async', 'await', 'return', 'import', 'export', 'class', 'type', 'enum', 'match', 'select', 'from', 'where', 'join', 'null', 'void', 'true', 'false', 'i32', 'f64', 'bool', 'str', 'map', 'set', 'vec', 'opt', 'res', 'ok', 'err'];
let nextId = 0;
function createSymbol() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return {
        id: nextId++,
        symbol: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
        x: Math.random() * vw,
        y: Math.random() * vh,
        size: 12 + Math.random() * 16,
        opacity: 0.04 + Math.random() * 0.08,
        drift: (Math.random() - 0.5) * 0.3,
        speed: 0.2 + Math.random() * 0.4,
    };
}
export function EngineerBackground() {
    const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 }); // normalized 0-1
    const [ripples, setRipples] = useState([]);
    const [symbols, setSymbols] = useState(() => Array.from({ length: 30 }, createSymbol));
    const frameRef = useRef(undefined);
    const rippleTimer = useRef(undefined);
    const onMouseMove = useCallback((e) => {
        setMouse({
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
        });
    }, []);
    const onClick = useCallback((e) => {
        setRipples(prev => [
            ...prev.slice(-4), // keep max 5 ripples
            { id: nextId++, x: e.clientX, y: e.clientY, size: 0, opacity: 0.5 },
        ]);
    }, []);
    // Animate floating symbols
    useEffect(() => {
        const tick = () => {
            setSymbols(prev => prev.map(s => {
                let y = s.y - s.speed;
                let x = s.x + s.drift;
                if (y < -40)
                    y = window.innerHeight + 40;
                if (x < -40)
                    x = window.innerWidth + 40;
                if (x > window.innerWidth + 40)
                    x = -40;
                return { ...s, x, y };
            }));
            frameRef.current = requestAnimationFrame(tick);
        };
        frameRef.current = requestAnimationFrame(tick);
        return () => {
            if (frameRef.current !== undefined)
                cancelAnimationFrame(frameRef.current);
        };
    }, []);
    // Animate ripple decay
    useEffect(() => {
        rippleTimer.current = window.setInterval(() => {
            setRipples(prev => prev
                .map(r => ({ ...r, size: r.size + 30, opacity: r.opacity - 0.02 }))
                .filter(r => r.opacity > 0));
        }, 50);
        return () => {
            if (rippleTimer.current !== undefined)
                clearInterval(rippleTimer.current);
        };
    }, []);
    // Gradient light position follows mouse (smooth via CSS transition)
    const lightX = mouse.x * 100;
    const lightY = mouse.y * 100;
    return (_jsxs("div", { className: css.background, onMouseMove: onMouseMove, onClick: onClick, children: [_jsx("div", { className: css.light, style: {
                    background: `radial-gradient(ellipse 600px 600px at ${lightX}% ${lightY}%, rgba(57,100,254,0.08), transparent 70%)`,
                } }), _jsx("div", { className: css.grid }), _jsx("div", { className: css.scanline }), _jsx("div", { className: css.symbolLayer, children: symbols.map(s => (_jsx("span", { className: css.symbol, style: {
                        left: s.x,
                        top: s.y,
                        fontSize: s.size,
                        opacity: s.opacity,
                    }, children: s.symbol }, s.id))) }), _jsx("div", { className: css.rippleLayer, children: ripples.map(r => (_jsx("div", { className: css.ripple, style: {
                        left: r.x,
                        top: r.y,
                        width: r.size,
                        height: r.size,
                        opacity: r.opacity,
                        marginLeft: -r.size / 2,
                        marginTop: -r.size / 2,
                    } }, r.id))) }), _jsx("div", { className: css.cornerTL }), _jsx("div", { className: css.cornerBR })] }));
}
//# sourceMappingURL=Background.js.map