/**
 * Observable states of the hosted form, from the page's point of view.
 *
 * - loading: bootstrap requested, nothing observed yet
 * - loaded:  bootstrap script loaded (proves loading only, not that a form mounted)
 * - present: the runtime put content in the host (a form, or its own unavailable message)
 * - slow:    nothing appeared in the host within the expected time
 * - error:   the bootstrap script failed to load
 *
 * None of these states says anything about message delivery; only the hosted component does.
 */
export type EmbedStatus = 'loading' | 'loaded' | 'present' | 'slow' | 'error';

export type EmbedSignal = {
  scriptLoaded?: boolean;
  scriptFailed?: boolean;
  hostHasContent?: boolean;
  elapsedMs?: number;
  slowAfterMs?: number;
};

export function nextEmbedStatus(current: EmbedStatus, signal: EmbedSignal): EmbedStatus {
  // The host receiving content is the strongest signal: the runtime (or its bootstrap's own
  // unavailable message) is now in charge of what visitors see.
  if (signal.hostHasContent) return 'present';
  if (current === 'present' || current === 'error') return current;
  if (signal.scriptFailed) return 'error';
  if (signal.scriptLoaded) return current === 'slow' ? 'slow' : 'loaded';
  if (signal.elapsedMs !== undefined && signal.slowAfterMs !== undefined && signal.elapsedMs >= signal.slowAfterMs) {
    return 'slow';
  }
  return current;
}
