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

const STORAGE_KEY = 'dsh-ui-pet.petHidden'

/** Read persisted visibility. Same guard as bg-images.ts for SSR safety. */
function readHidden(): boolean {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) === '1'
}

/** Persist visibility so a page refresh keeps the user's choice. */
function writeHidden(value: boolean): void {
  if (typeof localStorage === 'undefined') return
  if (value) localStorage.setItem(STORAGE_KEY, '1')
  else localStorage.removeItem(STORAGE_KEY)
}

// Initialize from localStorage instead of always defaulting to visible.
let hidden = readHidden()

const listeners = new Set<() => void>()

/** Current visibility: true when the pet (and its background) is hidden. */
export function isPetHidden(): boolean {
  return hidden
}

/** Set visibility, persist it, and notify every subscriber (pet button, background). */
export function setPetHidden(next: boolean): void {
  if (hidden === next) return
  hidden = next
  writeHidden(next)
  for (const listener of listeners) listener()
}

/** Subscribe to visibility changes; returns an unsubscribe function. */
export function subscribePetHidden(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
