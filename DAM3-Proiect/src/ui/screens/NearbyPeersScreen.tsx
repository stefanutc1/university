import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { MeshRouter } from '../../routing/MeshRouter';
import { Peer } from '../../types';
import { theme } from '../theme';

export const NearbyPeersScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const [peers, setPeers] = useState<Peer[]>([]);
  const router = MeshRouter.getInstance();

  useEffect(() => {
    const unsubscribe = router.onPeers((updated) => {
      setPeers(updated);
    });
    return unsubscribe;
  }, []);

  const renderItem = ({ item }: { item: Peer }) => {
    return (
      <View style={styles.peerCard}>
        <View style={styles.peerInfo}>
          <View
            style={[
              styles.statusDot,
              item.isConnected ? styles.dotConnected : styles.dotObserved,
            ]}
          />
          <View style={styles.peerTextContainer}>
            <Text style={styles.peerName}>{item.shortName}</Text>
            <Text style={styles.peerMeta}>
              RSSI: {item.rssi} dBm • {item.hopCount} hop(s)
            </Text>
            <Text style={styles.pubkeyText} numberOfLines={1}>
              {item.publicKeyHex || item.id}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() =>
            navigation.navigate('ConversationDetail', {
              conversationId: item.publicKeyHex || item.id,
              peerName: item.shortName,
            })
          }
        >
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Mesh Nodes</Text>
        <ActivityIndicator size="small" color={theme.colors.accent} />
      </View>

      {peers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.emptyTitle}>Scanning BLE Radio (FE60)...</Text>
          <Text style={styles.emptySubtitle}>
            Listening for device-to-device GATT advertisements and local peer connections.
          </Text>
        </View>
      ) : (
        <FlatList
          data={peers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
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
  list: {
    padding: theme.spacing.md,
  },
  peerCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  peerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: theme.spacing.md,
  },
  dotConnected: {
    backgroundColor: theme.colors.success,
  },
  dotObserved: {
    backgroundColor: theme.colors.accentDark,
  },
  peerTextContainer: {
    flex: 1,
  },
  peerName: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  peerMeta: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  pubkeyText: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontFamily: theme.typography.fontFamilyMono,
    marginTop: 2,
  },
  chatButton: {
    backgroundColor: theme.colors.surfaceBorder,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.sm,
    marginLeft: theme.spacing.sm,
  },
  chatButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
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
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
