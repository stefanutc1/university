import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FileTransferEngine, FileMetadata } from '../../features/FileTransferEngine';
import { MdnsDiscovery, DiscoveredService } from '../../network/MdnsDiscovery';
import { theme } from '../theme';
import { useI18n } from '../../i18n/I18nContext';

export const FileTransfer: React.FC = () => {
  const fileEngine = FileTransferEngine.getInstance();
  const mdns = MdnsDiscovery.getInstance();
  const { t } = useI18n();

  const [peers, setPeers] = useState<DiscoveredService[]>(mdns.getDiscoveredPeers());
  const [activeTransfers, setActiveTransfers] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    mdns.setCallbacks(
      () => setPeers([...mdns.getDiscoveredPeers()]),
      () => setPeers([...mdns.getDiscoveredPeers()])
    );

    const unsubscribe = fileEngine.onProgress((fileId, progress, isDone) => {
      setActiveTransfers((prev) => {
        const next = new Map(prev);
        if (isDone) {
          next.delete(fileId);
        } else {
          next.set(fileId, progress);
        }
        return next;
      });
    });

    return unsubscribe;
  }, []);

  const handleSendSampleFile = async (targetIp?: string) => {
    const samplePayload = 'RAW_DATA_IMAGE_MATRIX_'.repeat(4000); // ~90KB
    await fileEngine.sendFile(samplePayload, 'foto_santier_hd.jpg', 'image/jpeg', targetIp);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('airdrop_title')}</Text>
        <Text style={styles.subtitle}>{t('airdrop_subtitle')}</Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Available Targets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('airdrop_nearby')}</Text>
          {peers.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="radar-outline" size={32} color={theme.colors.accent} style={{ marginBottom: 8 }} />
              <Text style={styles.emptyText}>{t('airdrop_search')}</Text>
            </View>
          ) : (
            peers.map((peer, idx) => (
              <View key={idx} style={styles.peerRow}>
                <View style={styles.peerInfoRow}>
                  <View style={styles.deviceIconBox}>
                    <Ionicons name="phone-portrait" size={18} color={theme.colors.accent} />
                  </View>
                  <View>
                    <Text style={styles.peerName}>{peer.name}</Text>
                    <Text style={styles.peerMeta}>{peer.ip}:{peer.port}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => handleSendSampleFile(peer.ip)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="paper-plane" size={12} color="#050B14" style={{ marginRight: 4 }} />
                  <Text style={styles.sendButtonText}>{t('airdrop_send_file')}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}

          <TouchableOpacity
            style={styles.broadcastButton}
            onPress={() => handleSendSampleFile()}
            activeOpacity={0.85}
          >
            <Ionicons name="share-social" size={16} color="#050B14" style={{ marginRight: 6 }} />
            <Text style={styles.broadcastButtonText}>{t('airdrop_broadcast_file')}</Text>
          </TouchableOpacity>
        </View>

        {/* Active Transfer Progress */}
        {activeTransfers.size > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('airdrop_active')}</Text>
            {Array.from(activeTransfers.entries()).map(([id, prog]) => (
              <View key={id} style={styles.progressCard}>
                <View style={styles.progressRow}>
                  <Text style={styles.progressFileId}>{id}</Text>
                  <Text style={styles.progressPercent}>{prog}%</Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${prog}%` }]} />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  title: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 110,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    fontFamily: theme.typography.fontFamilyMono,
    letterSpacing: 1,
    marginBottom: 8,
    paddingLeft: 4,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18, 26, 42, 0.65)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  peerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 26, 42, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
  },
  peerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  peerName: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  peerMeta: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontFamily: theme.typography.fontFamilyMono,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  sendButtonText: {
    color: '#050B14',
    fontSize: 12,
    fontWeight: '800',
  },
  broadcastButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 12,
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  broadcastButtonText: {
    color: '#050B14',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  progressCard: {
    backgroundColor: 'rgba(18, 26, 42, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressFileId: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontFamily: theme.typography.fontFamilyMono,
  },
  progressPercent: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: '800',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.accent,
  },
});
