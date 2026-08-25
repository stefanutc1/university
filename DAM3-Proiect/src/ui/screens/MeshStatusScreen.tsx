import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MeshDiagnostics } from '../../diagnostics/MeshDiagnostics';
import { CryptoEngine } from '../../crypto/CryptoEngine';
import { MetricCard } from '../components/MetricCard';
import { theme } from '../theme';

export const MeshStatusScreen: React.FC = () => {
  const diagnostics = MeshDiagnostics.getInstance();
  const crypto = CryptoEngine.getInstance();

  const [metrics, setMetrics] = useState(diagnostics.getMetrics());
  const [logs, setLogs] = useState<string[]>(diagnostics.getEventLog());

  useEffect(() => {
    const unsubscribe = diagnostics.subscribe(() => {
      setMetrics(diagnostics.getMetrics());
      setLogs(diagnostics.getEventLog());
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Node Identity Card */}
        <View style={styles.identityCard}>
          <Text style={styles.cardHeader}>LOCAL NODE IDENTITY</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Node ID:</Text>
            <Text style={styles.monoValue}>{crypto.shortIdentifier}</Text>
          </View>
          <View style={styles.pubkeyContainer}>
            <Text style={styles.label}>Ed25519 Identity Public Key:</Text>
            <Text style={styles.pubkeyMono}>{crypto.publicKeyHex}</Text>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.gridRow}>
          <MetricCard title="Packets TX" value={metrics.packetsSent} />
          <MetricCard title="Packets RX" value={metrics.packetsReceived} />
        </View>

        <View style={styles.gridRow}>
          <MetricCard title="Relayed" value={metrics.packetsRelayed} />
          <MetricCard title="Queue Depth" value={metrics.queueDepth} />
        </View>

        <View style={styles.gridRow}>
          <MetricCard title="Duplicates Dropped" value={metrics.packetsDroppedDuplicate} />
          <MetricCard title="Hop Expirations" value={metrics.packetsDroppedHopLimit} />
        </View>

        {/* Packet Tracer Log */}
        <View style={styles.tracerCard}>
          <Text style={styles.cardHeader}>REAL-TIME PACKET TRACER</Text>
          {logs.length === 0 ? (
            <Text style={styles.emptyLogText}>Awaiting radio packet activity...</Text>
          ) : (
            logs.map((log, idx) => (
              <Text key={idx} style={styles.logLine}>
                {log}
              </Text>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.md,
  },
  identityCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamilyMono,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  monoValue: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyMono,
    fontWeight: '700',
    fontSize: 14,
  },
  pubkeyContainer: {
    marginTop: theme.spacing.sm,
  },
  pubkeyMono: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontFamily: theme.typography.fontFamilyMono,
    marginTop: 2,
  },
  gridRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  tracerCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  emptyLogText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontStyle: 'italic',
  },
  logLine: {
    color: theme.colors.textPrimary,
    fontSize: 11,
    fontFamily: theme.typography.fontFamilyMono,
    marginBottom: 3,
  },
});
