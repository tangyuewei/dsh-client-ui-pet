import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Wallpaper picker — a fixed-position floating button + popover that lets
 * the user pick a wallpaper for the current theme. Choices persist in
 * localStorage and broadcast via the wallpaper-change CustomEvent so the
 * background module re-applies the new image without a remount.
 */
import { useEffect, useRef, useState } from 'react';
import { useSyncExternalStore } from 'react';
import { isPetHidden, subscribePetHidden } from './visibility';
import { WALLPAPERS, getAllWallpapers, getCurrentWallpaperId, getWallpaperUrl, setCurrentWallpaperId, subscribeWallpaperChange, } from './bg-images';
import styles from './WallpaperPicker.module.css';
export function WallpaperPicker() {
    // Hide entirely while the user has the pet mascot dismissed.
    const hidden = useSyncExternalStore(subscribePetHidden, isPetHidden);
    const [open, setOpen] = useState(false);
    // Pinned: the panel floats on top (z-index 10020) and stays open — clicks
    // outside or on a tile do NOT dismiss it, so the user can compare wallpapers
    // freely. Unpinned returns to the normal stacked behavior (click-out closes).
    // The 🎨 trigger keeps an even higher z-index (10030) so the pin toggle is
    // always reachable even when the panel is pinned above everything else.
    const [pinned, setPinned] = useState(false);
    // Re-render when the chosen wallpaper changes so the selected highlight
    // and the pinned layer stay in sync.
    const [, setTick] = useState(0);
    useEffect(() => {
        const u = subscribeWallpaperChange(() => setTick(t => t + 1));
        return u;
    }, []);
    // Keep the trigger + panel reachable so the global outside-click handler
    // can tell a click inside our UI apart from a click elsewhere. Crucially
    // the handler must NOT use capture phase nor `once`: a capture listener
    // fires BEFORE the tile's own onClick and would unmount the panel (and its
    // buttons) before React dispatches the click, silently swallowing the pick.
    const triggerRef = useRef(null);
    const panelRef = useRef(null);
    if (hidden)
        return null;
    const choices = getAllWallpapers();
    const currentId = getCurrentWallpaperId();
    const currentUrl = getWallpaperUrl();
    return (_jsxs(_Fragment, { children: [pinned && (_jsx("div", { className: styles.pinLayer, style: { backgroundImage: `url("${currentUrl}")` }, "aria-hidden": true })), _jsxs("button", { type: "button", ref: triggerRef, className: styles.trigger, "aria-label": "\u9009\u62E9\u58C1\u7EB8", "aria-expanded": open, onClick: () => setOpen(o => !o), children: [_jsx("span", { className: styles.triggerIcon, "aria-hidden": true, children: "\uD83C\uDFA8" }), _jsx("span", { className: styles.triggerLabel, children: "\u58C1\u7EB8" })] }), open && (_jsxs("div", { ref: panelRef, className: styles.panel, role: "dialog", "aria-label": "\u9009\u62E9\u58C1\u7EB8", children: [_jsxs("div", { className: styles.title, children: [_jsx("span", { children: "\u9009\u62E9\u58C1\u7EB8" }), _jsxs("button", { type: "button", className: `${styles.pinBtn} ${pinned ? styles.pinBtnActive : ''}`, "aria-pressed": pinned, "aria-label": pinned ? '取消置顶' : '置顶', title: pinned ? '取消置顶' : '置顶（保持面板在最上层）', onClick: () => setPinned(p => !p), children: [_jsx("span", { "aria-hidden": true, children: pinned ? '📍' : '📌' }), _jsx("span", { children: pinned ? '取消置顶' : '置顶' })] })] }), _jsx("div", { className: styles.grid, children: choices.map(w => {
                            const active = w.id === currentId;
                            return (_jsx("button", { type: "button", className: `${styles.tile} ${active ? styles.tileActive : ''}`, style: { backgroundImage: `url("${w.dataUrl}")` }, "aria-pressed": active, "aria-label": w.name, onClick: () => {
                                    setCurrentWallpaperId(w.id);
                                    // Pinned panels stay open so the user can keep comparing.
                                    if (!pinned)
                                        setOpen(false);
                                }, children: _jsx("span", { className: styles.tileLabel, children: w.name }) }, w.id));
                        }) })] })), open && (_jsx(ClickOutsideCloser, { enabled: !pinned, onClose: () => setOpen(false), triggerRef: triggerRef, panelRef: panelRef })), _jsx("span", { hidden: true, "aria-hidden": true, children: WALLPAPERS.length })] }));
}
function ClickOutsideCloser({ enabled, onClose, triggerRef, panelRef, }) {
    useEffect(() => {
        if (!enabled)
            return;
        const handler = (e) => {
            const t = e.target;
            if (triggerRef.current?.contains(t))
                return; // toggles via its own onClick
            if (panelRef.current?.contains(t))
                return; // inside the panel: let buttons act
            onClose();
        };
        // Bubble phase (default): the tile's onClick runs first, then this fires.
        window.addEventListener('click', handler);
        return () => window.removeEventListener('click', handler);
    }, [enabled, onClose, triggerRef, panelRef]);
    return null;
}
//# sourceMappingURL=WallpaperPicker.js.map