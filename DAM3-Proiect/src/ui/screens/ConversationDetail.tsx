import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { EncryptedStorage } from '../../storage/EncryptedStorage';
import { MeshRouter } from '../../routing/MeshRouter';
import { CryptoEngine } from '../../crypto/CryptoEngine';
import { Message } from '../../types';
import { MessageBubble } from '../components/MessageBubble';
import { theme } from '../theme';

export const ConversationDetailScreen: React.FC<{
  route: any;
  navigation: any;
}> = ({ route, navigation }) => {
  const { conversationId, peerName } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const storage = EncryptedStorage.getInstance();
  const router = MeshRouter.getInstance();

  useEffect(() => {
    loadMessages();
    const unsubscribe = router.onMessage((msg) => {
      if (msg.conversationId === conversationId) {
        loadMessages();
      }
    });
    return unsubscribe;
  }, [conversationId]);

  const loadMessages = () => {
    setMessages(storage.getMessages(conversationId));
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');

    try {
      // In peer mesh, agreement key is either derived or known from discovery
      await router.sendTextMessage(conversationId, conversationId, text);
      loadMessages();
    } catch (e) {
      console.warn('Failed to send text message:', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>
            E2EE ChaCha20-Poly1305 • sovereign mesh link
          </Text>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.listContent}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type offline message..."
            placeholderTextColor={theme.colors.textSecondary}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  subHeader: {
    backgroundColor: theme.colors.surface,
    paddingVertical: 6,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  subHeaderText: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontFamily: theme.typography.fontFamilyMono,
  },
  listContent: {
    paddingVertical: theme.spacing.md,
  },
  inputBar: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceBorder,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: theme.colors.textPrimary,
    fontSize: 14,
  },
  sendButton: {
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.accentDark,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.full,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
});
