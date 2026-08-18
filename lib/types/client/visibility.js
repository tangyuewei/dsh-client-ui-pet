/**
 * Shared pet visibility store.
 *
 * The salted fish pet and its full-viewport engineer background are two
 * independent `shell.overlay` slot entries, so they cannot share React state
 * directly. This module-level store keeps `hidden` in one place: toggling the
 * pet's recall button hides the background too, and a fresh mount (slot
 * re-registration) reads the same persisted visibility instead of resetting
 * to visible while the background stays hidden.
 */
let hidden = false;
const listeners = new Set();
/** Current visibility: true when the pet (and its background) is hidden. */
export function isPetHidden() {
    return hidden;
}
/** Set visibility and notify every subscriber (pet button, background). */
export function setPetHidden(next) {
    if (hidden === next)
        return;
    hidden = next;
    for (const listener of listeners)
        listener();
}
/** Subscribe to visibility changes; returns an unsubscribe function. */
export function subscribePetHidden(listener) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
//# sourceMappingURL=visibility.js.map