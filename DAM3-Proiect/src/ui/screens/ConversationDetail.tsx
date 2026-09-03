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
import Ionicons from '@expo/vector-icons/Ionicons';
import { EncryptedStorage } from '../../storage/EncryptedStorage';
import { MeshRouter } from '../../routing/MeshRouter';
import { Message } from '../../types';
import { MessageBubble } from '../components/MessageBubble';
import { theme } from '../theme';
import { useI18n } from '../../i18n/I18nContext';

export const ConversationDetailScreen: React.FC<{
  route: any;
  navigation: any;
}> = ({ route }) => {
  const { conversationId, peerName, peerPubkey } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const { t } = useI18n();

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
      await router.sendTextMessage(peerPubkey || conversationId, conversationId, text);
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Security Banner */}
        <View style={styles.securityBanner}>
          <Ionicons name="shield-checkmark" size={12} color={theme.colors.accent} />
          <Text style={styles.securityBannerText}>
            Curve25519 ECDH • ChaCha20-Poly1305 E2EE
          </Text>
        </View>

        {/* Message Stream */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messageList}
        />

        {/* Liquid Glass Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={t('chat_input_placeholder')}
            placeholderTextColor={theme.colors.textMuted}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() ? styles.sendButtonActive : styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="arrow-up"
              size={18}
              color={inputText.trim() ? '#050B14' : theme.colors.textMuted}
            />
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
  securityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 242, 254, 0.06)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 242, 254, 0.15)',
  },
  securityBannerText: {
    color: theme.colors.accent,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamilyMono,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  messageList: {
    padding: theme.spacing.md,
    paddingBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    backgroundColor: 'rgba(16, 22, 34, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    color: theme.colors.textPrimary,
    maxHeight: 100,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 2,
  },
  sendButtonActive: {
    backgroundColor: theme.colors.accent,
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
});
