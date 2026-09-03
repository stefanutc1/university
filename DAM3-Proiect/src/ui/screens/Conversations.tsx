import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { EncryptedStorage } from '../../storage/EncryptedStorage';
import { MeshRouter } from '../../routing/MeshRouter';
import { Conversation } from '../../types';
import { theme } from '../theme';
import { useI18n } from '../../i18n/I18nContext';
import { NewConversationModal } from '../components/NewConversationModal';

export const ConversationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const storage = EncryptedStorage.getInstance();
  const router = MeshRouter.getInstance();
  const { t, language, setLanguage } = useI18n();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadConversations();
    const unsubscribe = router.onMessage(() => {
      loadConversations();
    });
    return unsubscribe;
  }, []);

  const loadConversations = () => {
    setConversations(storage.getConversations());
  };

  const filteredConversations = conversations.filter((c) =>
    c.peerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.peerPubkey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = (peerPubkey: string, peerName: string) => {
    navigation.navigate('ConversationDetail', {
      peerPubkey,
      peerName,
      conversationId: `conv_${peerPubkey}`,
    });
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ro' ? 'en' : 'ro');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header with Glass Accent */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <View style={styles.badgeRow}>
              <View style={styles.statusDot} />
              <Text style={styles.networkBadge}>{t('offline_status').toUpperCase()}</Text>
              <View style={styles.e2eeBadge}>
                <Ionicons name="lock-closed" size={10} color={theme.colors.accent} />
                <Text style={styles.e2eeBadgeText}>{t('e2ee_badge')}</Text>
              </View>
            </View>
            <Text style={styles.title}>{t('conversations_title')}</Text>
          </View>

          {/* Quick Language Toggle */}
          <TouchableOpacity style={styles.langToggle} onPress={toggleLanguage} activeOpacity={0.8}>
            <Text style={styles.langFlag}>{language === 'ro' ? '🇷🇴 RO' : '🇬🇧 EN'}</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color={theme.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('search_placeholder')}
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Conversations Stream */}
      {filteredConversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="chatbubbles-outline" size={38} color={theme.colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>{t('empty_conversations')}</Text>
          <Text style={styles.emptyDesc}>{t('empty_conversations_desc')}</Text>
          <TouchableOpacity
            style={styles.newChatEmptyBtn}
            onPress={() => setIsModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#050B14" style={{ marginRight: 6 }} />
            <Text style={styles.newChatEmptyBtnText}>{t('new_conversation_btn')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.conversationItem}
              onPress={() => handleStartChat(item.peerPubkey, item.peerName)}
              activeOpacity={0.7}
            >
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color={theme.colors.accent} />
              </View>
              <View style={styles.convDetails}>
                <View style={styles.convHeaderRow}>
                  <Text style={styles.peerName}>{item.peerName}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(item.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Text style={styles.snippet} numberOfLines={1}>
                  {item.lastMessageSnippet || 'Conversație inițiată'}
                </Text>
              </View>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      {/* Floating Action Button for New Chat */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#050B14" />
      </TouchableOpacity>

      {/* New Conversation Modal with 6 pathways */}
      <NewConversationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onStartChat={handleStartChat}
        onOpenQrScanner={() => navigation.navigate('Tools', { screen: 'QrPairing' })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: 'rgba(16, 22, 34, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
    marginRight: 6,
  },
  networkBadge: {
    color: theme.colors.success,
    fontSize: 10,
    fontWeight: '800',
    fontFamily: theme.typography.fontFamilyMono,
    letterSpacing: 0.8,
    marginRight: 8,
  },
  e2eeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
  },
  e2eeBadgeText: {
    color: theme.colors.accent,
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 3,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  langToggle: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  langFlag: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 13,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 100,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: 'rgba(18, 25, 40, 0.65)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 10,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  convDetails: {
    flex: 1,
  },
  convHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  peerName: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  timestamp: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  snippet: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  unreadBadge: {
    backgroundColor: theme.colors.accent,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadText: {
    color: '#050B14',
    fontSize: 11,
    fontWeight: '800',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xxl,
    paddingBottom: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyDesc: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: theme.spacing.xl,
  },
  newChatEmptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 16,
  },
  newChatEmptyBtnText: {
    color: '#050B14',
    fontSize: 13,
    fontWeight: '800',
  },
  fab: {
    position: 'absolute',
    bottom: 95,
    right: 22,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
});
