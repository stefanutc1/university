import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { QrPairing, QrPairingPayload } from '../../features/QrPairing';
import { CryptoEngine } from '../../crypto/CryptoEngine';
import { theme } from '../theme';

export const QrPairingScreen: React.FC = () => {
  const qrEngine = QrPairing.getInstance();
  const crypto = CryptoEngine.getInstance();

  const [activeTab, setActiveTab] = useState<'MY_QR' | 'SCAN'>('MY_QR');
  const [manualInput, setManualInput] = useState('');
  const [pairedDevice, setPairedDevice] = useState<QrPairingPayload | null>(null);

  const myPayloadString = qrEngine.generateMyQrPayload('Node-' + crypto.shortIdentifier);

  const handleSimulateScan = () => {
    try {
      const parsed = qrEngine.parseScannedQr(manualInput.trim() || myPayloadString);
      setPairedDevice(parsed);
      Alert.alert('Imperechere Reusita', `Dispozitivul ${parsed.name} a fost verificat si adaugat in lista de incredere.`);
    } catch (e: any) {
      Alert.alert('Eroare Scanare', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Pairing Instant prin QR Code</Text>
        <Text style={styles.subtitle}>Schimb verificat de chei asimetrice fara conexiune internet</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'MY_QR' && styles.tabActive]}
          onPress={() => setActiveTab('MY_QR')}
        >
          <Text style={[styles.tabText, activeTab === 'MY_QR' && styles.tabTextActive]}>
            Codul Meu QR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'SCAN' && styles.tabActive]}
          onPress={() => setActiveTab('SCAN')}
        >
          <Text style={[styles.tabText, activeTab === 'SCAN' && styles.tabTextActive]}>
            Scaneaza Partener
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'MY_QR' ? (
        <View style={styles.qrCard}>
          <View style={styles.mockQrBox}>
            <Text style={styles.mockQrText}>[ COD QR CRIPTOGRAFIC ]</Text>
            <Text style={styles.mockQrSubtext}>Arata acest ecran partenerului</Text>
          </View>
          <View style={styles.keyDetails}>
            <Text style={styles.keyLabel}>Amprenta Cheie Ed25519:</Text>
            <Text style={styles.monoKey}>{crypto.publicKeyHex.substring(0, 32)}...</Text>
            <Text style={styles.keyLabel}>Cheie Acord X25519:</Text>
            <Text style={styles.monoKey}>{crypto.agreementPublicKeyHex.substring(0, 32)}...</Text>
          </View>
        </View>
      ) : (
        <View style={styles.scanCard}>
          <Text style={styles.scanInstructions}>
            Indreapta camera catre ecranul celuilalt dispozitiv sau introdu payload-ul QR:
          </Text>
          <TextInput
            style={styles.input}
            value={manualInput}
            onChangeText={setManualInput}
            placeholder="JSON payload sau scan camera..."
            placeholderTextColor={theme.colors.textSecondary}
          />
          <TouchableOpacity style={styles.scanButton} onPress={handleSimulateScan}>
            <Text style={styles.scanButtonText}>Valideaza & Imperecheaza</Text>
          </TouchableOpacity>

          {pairedDevice && (
            <View style={styles.pairedSuccess}>
              <Text style={styles.pairedTitle}>Nod Verificat:</Text>
              <Text style={styles.pairedName}>{pairedDevice.name}</Text>
              <Text style={styles.pairedPk}>PK: {pairedDevice.pk.substring(0, 24)}...</Text>
            </View>
          )}
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
  tabContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surface,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: theme.colors.surfaceBorder,
  },
  tabText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: theme.colors.textPrimary,
  },
  qrCard: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  mockQrBox: {
    width: 240,
    height: 240,
    backgroundColor: '#ffffff',
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  mockQrText: {
    color: '#000000',
    fontWeight: '900',
    fontFamily: theme.typography.fontFamilyMono,
    fontSize: 14,
  },
  mockQrSubtext: {
    color: '#666666',
    fontSize: 11,
    marginTop: 6,
  },
  keyDetails: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
  },
  keyLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  monoKey: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyMono,
    fontSize: 11,
  },
  scanCard: {
    padding: theme.spacing.lg,
  },
  scanInstructions: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    color: theme.colors.textPrimary,
    fontSize: 13,
    marginBottom: theme.spacing.md,
  },
  scanButton: {
    backgroundColor: theme.colors.accentDark,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  scanButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  pairedSuccess: {
    marginTop: theme.spacing.lg,
    backgroundColor: '#0c261a',
    borderColor: theme.colors.success,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
  },
  pairedTitle: {
    color: theme.colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  pairedName: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  pairedPk: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontFamily: theme.typography.fontFamilyMono,
    marginTop: 2,
  },
});
