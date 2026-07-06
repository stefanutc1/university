import { PacketFragment } from '../types';

export class PacketFragmenter {
  private assemblyBuffers = new Map<string, Map<number, string>>();
  private totalCounts = new Map<string, number>();
  private timestamps = new Map<string, number>();

  public static fragment(
    payloadHex: string,
    messageId: string,
    mtu: number = 180
  ): PacketFragment[] {
    const bytesTotal = payloadHex.length / 2;
    // Overhead: 27 bytes header (magic, ver, type, flags, hop, len, uuid, idx, total)
    const maxChunkBytes = Math.max(32, mtu - 27);
    const maxChunkHexChars = maxChunkBytes * 2;

    const fragments: PacketFragment[] = [];
    const totalFragments = Math.ceil(payloadHex.length / maxChunkHexChars);

    for (let i = 0; i < totalFragments; i++) {
      const chunkHex = payloadHex.substring(i * maxChunkHexChars, (i + 1) * maxChunkHexChars);
      fragments.push({
        messageId,
        fragmentIndex: i,
        totalFragments,
        chunkHex,
      });
    }

    return fragments;
  }

  public processFragment(fragment: PacketFragment): string | null {
    const { messageId, fragmentIndex, totalFragments, chunkHex } = fragment;

    if (!this.assemblyBuffers.has(messageId)) {
      this.assemblyBuffers.set(messageId, new Map<number, string>());
      this.totalCounts.set(messageId, totalFragments);
      this.timestamps.set(messageId, Date.now());
    }

    const buffer = this.assemblyBuffers.get(messageId)!;
    buffer.set(fragmentIndex, chunkHex);
    this.timestamps.set(messageId, Date.now());

    if (buffer.size === totalFragments) {
      let fullHex = '';
      for (let i = 0; i < totalFragments; i++) {
        fullHex += buffer.get(i) || '';
      }
      this.assemblyBuffers.delete(messageId);
      this.totalCounts.delete(messageId);
      this.timestamps.delete(messageId);
      return fullHex;
    }

    this.pruneExpired();
    return null;
  }

  private pruneExpired(): void {
    const now = Date.now();
    for (const [msgId, time] of this.timestamps.entries()) {
      if (now - time > 15000) {
        this.assemblyBuffers.delete(msgId);
        this.totalCounts.delete(msgId);
        this.timestamps.delete(msgId);
      }
    }
  }
}
