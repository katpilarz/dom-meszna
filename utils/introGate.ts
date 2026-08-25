"use client";

/**
 * One-way latch between the preloader and the hero entry animation.
 *
 * The hero must not play while the preloader panel is still covering it —
 * otherwise the whole entrance burns off behind the curtain and the reveal
 * lands on a finished hero. The preloader opens the latch as its exit starts;
 * anything skipping the preloader (repeat visit, reduced motion, no JS path)
 * opens it immediately.
 */
let open = false;
const waiting = new Set<() => void>();

export function openIntroGate() {
  if (open) return;
  open = true;
  for (const cb of [...waiting]) cb();
  waiting.clear();
}

/** Runs `cb` once the gate is open — synchronously if it already is. */
export function onIntroOpen(cb: () => void): () => void {
  if (open) {
    cb();
    return () => {};
  }
  waiting.add(cb);
  return () => waiting.delete(cb);
}
