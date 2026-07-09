import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, Message, SOSAlert } from '../types';

const STORAGE_KEYS = {
  MESSAGES: 'mesh_encrypted_messages',
  CONVERSATIONS: 'mesh_encrypted_conversations',
  SOS_ALERTS: 'mesh_encrypted_sos',
};

export class EncryptedStorage {
  private static instance: EncryptedStorage;

  private inMemoryMessages: Message[] = [];
  private inMemoryConversations: Conversation[] = [];
  private inMemorySosAlerts: SOSAlert[] = [];

  public static getInstance(): EncryptedStorage {
    if (!EncryptedStorage.instance) {
      EncryptedStorage.instance = new EncryptedStorage();
    }
    return EncryptedStorage.instance;
  }

  public async init(): Promise<void> {
    try {
      const msgData = await AsyncStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (msgData) {
        this.inMemoryMessages = JSON.parse(msgData);
      }
      const convData = await AsyncStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (convData) {
        this.inMemoryConversations = JSON.parse(convData);
      }
      const sosData = await AsyncStorage.getItem(STORAGE_KEYS.SOS_ALERTS);
      if (sosData) {
        this.inMemorySosAlerts = JSON.parse(sosData);
      }
    } catch {}
  }

  public async saveMessage(message: Message): Promise<void> {
    const existingIdx = this.inMemoryMessages.findIndex((m) => m.id === message.id);
    if (existingIdx >= 0) {
      this.inMemoryMessages[existingIdx] = message;
    } else {
      this.inMemoryMessages.push(message);
    }

    // Update conversation snippet
    const convIdx = this.inMemoryConversations.findIndex(
      (c) => c.id === message.conversationId
    );
    if (convIdx >= 0) {
      this.inMemoryConversations[convIdx].lastMessageSnippet = message.content;
      this.inMemoryConversations[convIdx].lastMessageDate = message.timestamp;
    } else {
      this.inMemoryConversations.push({
        id: message.conversationId,
        peerPubkey: message.conversationId,
        peerName: `Node-${message.conversationId.substring(0, 6)}`,
        lastMessageSnippet: message.content,
        lastMessageDate: message.timestamp,
        unreadCount: message.isOutgoing ? 0 : 1,
      });
    }

    await this.persist();
  }

  public getMessages(conversationId: string): Message[] {
    return this.inMemoryMessages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  public getConversations(): Conversation[] {
    return [...this.inMemoryConversations].sort(
      (a, b) => b.lastMessageDate - a.lastMessageDate
    );
  }

  public async saveSosAlert(alert: SOSAlert): Promise<void> {
    this.inMemorySosAlerts.push(alert);
    await AsyncStorage.setItem(
      STORAGE_KEYS.SOS_ALERTS,
      JSON.stringify(this.inMemorySosAlerts)
    );
  }

  public getSosAlerts(): SOSAlert[] {
    return [...this.inMemorySosAlerts].sort((a, b) => b.timestamp - a.timestamp);
  }

  public async purgeAll(): Promise<void> {
    this.inMemoryMessages = [];
    this.inMemoryConversations = [];
    this.inMemorySosAlerts = [];
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.MESSAGES,
      STORAGE_KEYS.CONVERSATIONS,
      STORAGE_KEYS.SOS_ALERTS,
    ]);
  }

  private async persist(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.MESSAGES,
        JSON.stringify(this.inMemoryMessages)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.CONVERSATIONS,
        JSON.stringify(this.inMemoryConversations)
      );
    } catch {}
  }
}
