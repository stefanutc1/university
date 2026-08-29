import { WebSocketP2PTransport } from '../network/WebSocketP2PTransport';

export type IntercomState = 'IDLE' | 'TRANSMITTING' | 'RECEIVING';

export interface VoiceFrame {
  channelId: string;
  senderName: string;
  frameIndex: number;
  audioChunkBase64: string;
  timestamp: number;
  isEndOfStream: boolean;
}

export type OnVoiceFrameReceived = (frame: VoiceFrame) => void;
export type OnIntercomStateChanged = (state: IntercomState, activeSpeaker?: string) => void;

/**
 * Mesaje Vocale & Intercom Push-to-Talk (Walkie-Talkie Local)
 * Inregistrare audio locala si streaming direct prin WebSocket catre nodurile conectate,
 * util pe santiere, drumetii sau spatii mari fara semnal GSM.
 */
export class VoiceIntercomEngine {
  private static instance: VoiceIntercomEngine;

  private currentState: IntercomState = 'IDLE';
  private currentChannel: string = 'General';
  private localNodeName: string = 'Worker-Node';
  private frameCounter: number = 0;
  private streamingInterval?: NodeJS.Timeout;

  private stateListeners: Set<OnIntercomStateChanged> = new Set();
  private frameListeners: Set<OnVoiceFrameReceived> = new Set();
  private ws = WebSocketP2PTransport.getInstance();

  public static getInstance(): VoiceIntercomEngine {
    if (!VoiceIntercomEngine.instance) {
      VoiceIntercomEngine.instance = new VoiceIntercomEngine();
    }
    return VoiceIntercomEngine.instance;
  }

  public setChannel(channel: string): void {
    this.currentChannel = channel;
  }

  public getChannel(): string {
    return this.currentChannel;
  }

  public getState(): IntercomState {
    return this.currentState;
  }

  public onStateChange(listener: OnIntercomStateChanged): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  public onVoiceFrame(listener: OnVoiceFrameReceived): () => void {
    this.frameListeners.add(listener);
    return () => this.frameListeners.delete(listener);
  }

  /**
   * Apasa pentru a vorbi (Push-to-Talk): incepe transmisia audio streaming in timp real.
   */
  public startTransmitting(nodeName: string = 'Me'): void {
    if (this.currentState !== 'IDLE') return;

    this.localNodeName = nodeName;
    this.currentState = 'TRANSMITTING';
    this.frameCounter = 0;
    this.notifyState('TRANSMITTING', this.localNodeName);

    // Stream frame-uri PCM/Opus catre toate nodurile din canal
    this.streamingInterval = setInterval(() => {
      this.sendVoiceChunk(false);
    }, 100); // 10 frame-uri pe secunda
  }

  /**
   * Elibereaza butonul Push-to-Talk: finalizeaza transmisia audio.
   */
  public stopTransmitting(): void {
    if (this.currentState !== 'TRANSMITTING') return;

    if (this.streamingInterval) {
      clearInterval(this.streamingInterval);
    }
    this.sendVoiceChunk(true);
    this.currentState = 'IDLE';
    this.notifyState('IDLE');
  }

  /**
   * Proceseaza cadrele audio primite de la alte noduri conectate.
   */
  public processIncomingVoiceFrame(frame: VoiceFrame): void {
    if (frame.channelId !== this.currentChannel) return;

    if (!frame.isEndOfStream) {
      this.currentState = 'RECEIVING';
      this.notifyState('RECEIVING', frame.senderName);
    } else {
      this.currentState = 'IDLE';
      this.notifyState('IDLE');
    }

    this.frameListeners.forEach((l) => l(frame));
  }

  private sendVoiceChunk(isFinal: boolean): void {
    this.frameCounter++;
    const frame: VoiceFrame = {
      channelId: this.currentChannel,
      senderName: this.localNodeName,
      frameIndex: this.frameCounter,
      audioChunkBase64: 'mock_pcm_audio_frame_' + this.frameCounter,
      timestamp: Date.now(),
      isEndOfStream: isFinal,
    };

    this.ws.sendPacket({
      type: 'VOICE_FRAME',
      senderId: this.localNodeName,
      recipientId: 'BROADCAST',
      payload: frame,
      timestamp: Date.now(),
    });
  }

  private notifyState(state: IntercomState, activeSpeaker?: string): void {
    this.stateListeners.forEach((l) => l(state, activeSpeaker));
  }
}
