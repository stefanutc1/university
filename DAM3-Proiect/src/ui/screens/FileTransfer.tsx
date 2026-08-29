import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ProgressBarAndroid,
} from 'react-native';
import { FileTransferEngine, FileMetadata } from '../../features/FileTransferEngine';
import { MdnsDiscovery, DiscoveredService } from '../../network/MdnsDiscovery';
import { theme } from '../theme';

export const FileTransfer: React.FC = () => {
  const fileEngine = FileTransferEngine.getInstance();
  const mdns = MdnsDiscovery.getInstance();

  const [peers, setPeers] = useState<DiscoveredService[]>(mdns.getDiscoveredPeers());
  const [activeTransfers, setActiveTransfers] = useState<Map<string, number>>(new Map());
  const [receivedFiles, setReceivedFiles] = useState<FileMetadata[]>([]);

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
        <Text style={styles.title}>Local AirDrop File Transfer</Text>
        <Text style={styles.subtitle}>Direct Wi-Fi / Hotspot P2P • Viteza maxima • Fara compresie</Text>
      </View>

      {/* Available Targets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DISPOZITIVE IN RETEAUA LOCALA</Text>
        {peers.length === 0 ? (
          <Text style={styles.emptyText}>Cautare noduri ZeroConf pe retea...</Text>
        ) : (
          peers.map((peer, idx) => (
            <View key={idx} style={styles.peerRow}>
              <View>
                <Text style={styles.peerName}>{peer.name}</Text>
                <Text style={styles.peerMeta}>{peer.ip}:{peer.port}</Text>
              </View>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => handleSendSampleFile(peer.ip)}
              >
                <Text style={styles.sendButtonText}>Trimite Fisier</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.broadcastButton}
          onPress={() => handleSendSampleFile()}
        >
          <Text style={styles.broadcastButtonText}>Broadcast Fisier la Toti</Text>
        </TouchableOpacity>
      </View>

      {/* Active Transfer Progress */}
      {activeTransfers.size > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TRANSFERURI IN DESFASURARE</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  section: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamilyMono,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    fontSize: 12,
  },
  peerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  peerName: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  peerMeta: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontFamily: theme.typography.fontFamilyMono,
  },
  sendButton: {
    backgroundColor: theme.colors.accentDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  sendButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  broadcastButton: {
    backgroundColor: theme.colors.surfaceBorder,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  broadcastButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  progressCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressFileId: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontFamily: theme.typography.fontFamilyMono,
  },
  progressPercent: {
    color: theme.colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: theme.colors.surfaceBorder,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
  },
});
