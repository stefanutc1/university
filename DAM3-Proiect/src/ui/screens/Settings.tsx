import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { CryptoEngine } from '../../crypto/CryptoEngine';
import { EncryptedStorage } from '../../storage/EncryptedStorage';
import { theme } from '../theme';

export const SettingsScreen: React.FC = () => {
  const crypto = CryptoEngine.getInstance();
  const storage = EncryptedStorage.getInstance();

  const handlePurge = () => {
    Alert.alert(
      'Purge All Mesh Data',
      'This will permanently delete all stored offline messages, conversations, and identity keys from this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            await storage.purgeAll();
            Alert.alert('Purged', 'Local database has been cryptographically erased.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Identity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>CRYPTOGRAPHIC IDENTITY</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Node Identifier:</Text>
            <Text style={styles.monoValue}>{crypto.shortIdentifier}</Text>
          </View>
          <View style={styles.pubkeyContainer}>
            <Text style={styles.label}>Ed25519 Public Key:</Text>
            <Text style={styles.pubkeyMono}>{crypto.publicKeyHex}</Text>
          </View>
          <View style={styles.pubkeyContainer}>
            <Text style={styles.label}>X25519 Agreement Key:</Text>
            <Text style={styles.pubkeyMono}>{crypto.agreementPublicKeyHex}</Text>
          </View>
        </View>

        {/* Radio Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>RADIO TRANSPORT</Text>
          <View style={styles.row}>
            <Text style={styles.label}>BLE GATT Mesh Service:</Text>
            <Text style={styles.activeTag}>UUID FE60 (Active)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Local Direct Peer P2P:</Text>
            <Text style={styles.activeTag}>Active</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Default Hop Limit:</Text>
            <Text style={styles.value}>7 hops</Text>
          </View>
        </View>

        {/* Storage & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>STORAGE & DATA PRIVACY</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Local Storage Encryption:</Text>
            <Text style={styles.activeTag}>Encrypted at Rest</Text>
          </View>

          <TouchableOpacity style={styles.purgeButton} onPress={handlePurge}>
            <Text style={styles.purgeButtonText}>Purge All Messages & Keys</Text>
          </TouchableOpacity>
        </View>

        {/* Attribution */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Universitatea din Craiova — Facultatea de Științe{'\n'}
            Proiect DAM: Secure Offline Mesh Messenger (React Native)
          </Text>
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
  section: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
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
    marginVertical: 4,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  value: {
    color: theme.colors.textPrimary,
    fontSize: 12,
  },
  monoValue: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyMono,
    fontWeight: '700',
  },
  activeTag: {
    color: theme.colors.success,
    fontSize: 11,
    fontWeight: '600',
  },
  pubkeyContainer: {
    marginTop: theme.spacing.xs,
  },
  pubkeyMono: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontFamily: theme.typography.fontFamilyMono,
    marginTop: 2,
  },
  purgeButton: {
    backgroundColor: '#2a1114',
    borderColor: theme.colors.sosEmergency,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  purgeButtonText: {
    color: theme.colors.sosEmergency,
    fontWeight: '700',
    fontSize: 12,
  },
  footer: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: theme.typography.fontFamilyMono,
  },
});
