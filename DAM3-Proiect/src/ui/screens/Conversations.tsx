import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { EncryptedStorage } from '../../storage/EncryptedStorage';
import { MeshRouter } from '../../routing/MeshRouter';
import { Conversation } from '../../types';
import { theme } from '../theme';

export const ConversationsScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const storage = EncryptedStorage.getInstance();
  const router = MeshRouter.getInstance();

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

  const renderItem = ({ item }: { item: Conversation }) => {
    const time = new Date(item.lastMessageDate).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          navigation.navigate('ConversationDetail', {
            conversationId: item.id,
            peerName: item.peerName,
          })
        }
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.peerName.substring(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.peerName}>{item.peerName}</Text>
            <Text style={styles.timeText}>{time}</Text>
          </View>
          <Text style={styles.snippet} numberOfLines={1}>
            {item.lastMessageSnippet || 'No messages yet'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Conversations</Text>
        <Text style={styles.badge}>OFFLINE MESH</Text>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Active Conversations</Text>
          <Text style={styles.emptySubtitle}>
            Scan for nearby mesh peers in the radio range to start exchanging end-to-end encrypted messages.
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
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
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    color: theme.colors.accent,
    fontSize: 10,
    backgroundColor: theme.colors.accentDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
    fontFamily: theme.typography.fontFamilyMono,
    fontWeight: '700',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamilyMono,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  peerName: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  timeText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  snippet: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.surfaceBorder,
    marginLeft: 72,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xxl,
  },
  emptyTitle: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
