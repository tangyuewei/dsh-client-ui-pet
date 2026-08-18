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
/** Current visibility: true when the pet (and its background) is hidden. */
export declare function isPetHidden(): boolean;
/** Set visibility and notify every subscriber (pet button, background). */
export declare function setPetHidden(next: boolean): void;
/** Subscribe to visibility changes; returns an unsubscribe function. */
export declare function subscribePetHidden(listener: () => void): () => void;
//# sourceMappingURL=visibility.d.ts.map