import assert from 'node:assert/strict';
import { test } from 'node:test';
import { nextEmbedStatus } from '../lib/embed-status.ts';

test('script load proves loading only, not a mounted form', () => {
  assert.equal(nextEmbedStatus('loading', { scriptLoaded: true }), 'loaded');
});

test('content in the host is the signal that the runtime has taken over', () => {
  assert.equal(nextEmbedStatus('loaded', { hostHasContent: true }), 'present');
  assert.equal(nextEmbedStatus('slow', { hostHasContent: true }), 'present');
  // The bootstrap writes its own "unavailable" text into the host when the runtime import fails;
  // that is the service's truthful state and is left visible beside the email alternative.
  assert.equal(nextEmbedStatus('loading', { hostHasContent: true }), 'present');
});

test('a failed bootstrap is an error that later load events cannot hide', () => {
  assert.equal(nextEmbedStatus('loading', { scriptFailed: true }), 'error');
  assert.equal(nextEmbedStatus('error', { scriptLoaded: true }), 'error');
});

test('nothing appearing in time becomes a gentle slow notice', () => {
  assert.equal(nextEmbedStatus('loaded', { elapsedMs: 5000, slowAfterMs: 12000 }), 'loaded');
  assert.equal(nextEmbedStatus('loaded', { elapsedMs: 12000, slowAfterMs: 12000 }), 'slow');
  assert.equal(nextEmbedStatus('present', { elapsedMs: 60000, slowAfterMs: 12000 }), 'present');
});

test('there is no delivered/success state: only the hosted component reports delivery', () => {
  const states = new Set(['loading', 'loaded', 'present', 'slow', 'error']);
  for (const from of states) {
    for (const signal of [{ scriptLoaded: true }, { scriptFailed: true }, { hostHasContent: true }, { elapsedMs: 1e6, slowAfterMs: 1 }]) {
      assert.ok(states.has(nextEmbedStatus(from as never, signal)));
    }
  }
});
