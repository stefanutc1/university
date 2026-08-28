const test = require('node:test');
const assert = require('node:assert');

// Node.js test verifying React Native mesh packet fragmenter invariants
class TestPacketFragmenter {
  constructor() {
    this.assemblyBuffers = new Map();
    this.totalCounts = new Map();
  }

  static fragment(payloadHex, messageId, mtu = 180) {
    const maxChunkHexChars = Math.max(32, mtu - 27) * 2;
    const totalFragments = Math.ceil(payloadHex.length / maxChunkHexChars);
    const fragments = [];

    for (let i = 0; i < totalFragments; i++) {
      fragments.push({
        messageId,
        fragmentIndex: i,
        totalFragments,
        chunkHex: payloadHex.substring(i * maxChunkHexChars, (i + 1) * maxChunkHexChars),
      });
    }
    return fragments;
  }

  processFragment(frag) {
    const { messageId, fragmentIndex, totalFragments, chunkHex } = frag;
    if (!this.assemblyBuffers.has(messageId)) {
      this.assemblyBuffers.set(messageId, new Map());
      this.totalCounts.set(messageId, totalFragments);
    }
    const buf = this.assemblyBuffers.get(messageId);
    buf.set(fragmentIndex, chunkHex);

    if (buf.size === totalFragments) {
      let full = '';
      for (let i = 0; i < totalFragments; i++) {
        full += buf.get(i);
      }
      this.assemblyBuffers.delete(messageId);
      this.totalCounts.delete(messageId);
      return full;
    }
    return null;
  }
}

test('Fragmentation splits payload into MTU-sized chunks', () => {
  const originalPayload = '0123456789abcdef'.repeat(30); // 480 hex chars = 240 bytes
  const msgId = 'test-msg-uuid-1234';
  const fragments = TestPacketFragmenter.fragment(originalPayload, msgId, 180);

  assert.ok(fragments.length >= 2, 'Should be at least 2 fragments');
  assert.strictEqual(fragments[0].messageId, msgId);
  assert.strictEqual(fragments[0].totalFragments, fragments.length);
});

test('Reassembly handles out-of-order delivery', () => {
  const originalPayload = 'deadbeefcafebabe'.repeat(40);
  const msgId = 'test-msg-uuid-5678';
  const fragments = TestPacketFragmenter.fragment(originalPayload, msgId, 180);

  const fragmenter = new TestPacketFragmenter();
  let reassembled = null;

  // Deliver in reverse order
  for (let i = fragments.length - 1; i >= 0; i--) {
    const res = fragmenter.processFragment(fragments[i]);
    if (res) {
      reassembled = res;
    }
  }

  assert.strictEqual(reassembled, originalPayload);
});

test('Sliding window deduplication drops repeated message IDs', () => {
  const cache = new Set();
  const queue = [];

  function checkAndAdd(msgId) {
    if (cache.has(msgId)) return false;
    cache.add(msgId);
    queue.push(msgId);
    if (queue.length > 5) {
      const oldest = queue.shift();
      cache.delete(oldest);
    }
    return true;
  }

  assert.strictEqual(checkAndAdd('msg-1'), true);
  assert.strictEqual(checkAndAdd('msg-1'), false); // Duplicate!
  assert.strictEqual(checkAndAdd('msg-2'), true);
});
