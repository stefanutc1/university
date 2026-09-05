import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { CryptoEngine } from '../../crypto/CryptoEngine';
import { EncryptedStorage } from '../../storage/EncryptedStorage';
import { theme } from '../theme';
import { useI18n } from '../../i18n/I18nContext';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const crypto = CryptoEngine.getInstance();
  const storage = EncryptedStorage.getInstance();
  const { t, language, setLanguage } = useI18n();

  const handlePurge = () => {
    Alert.alert(
      t('purge_btn'),
      t('purge_confirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('purge_btn'),
          style: 'destructive',
          onPress: async () => {
            await storage.clearAll();
            Alert.alert('Succes', 'Baza de date a fost ștearsă complet.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('settings_title')}</Text>
        <Text style={styles.subtitle}>{t('settings_subtitle')}</Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Language Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('lang_section')}</Text>
          <View style={styles.langSelectorRow}>
            <TouchableOpacity
              style={[styles.langCard, language === 'ro' && styles.langCardActive]}
              onPress={() => setLanguage('ro')}
              activeOpacity={0.8}
            >
              <Text style={styles.langFlag}>🇷🇴</Text>
              <Text style={[styles.langText, language === 'ro' && styles.langTextActive]}>
                {t('lang_ro')}
              </Text>
              {language === 'ro' && (
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.accent} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langCard, language === 'en' && styles.langCardActive]}
              onPress={() => setLanguage('en')}
              activeOpacity={0.8}
            >
              <Text style={styles.langFlag}>🇬🇧</Text>
              <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>
                {t('lang_en')}
              </Text>
              {language === 'en' && (
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.accent} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Identity Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('identity_section')}</Text>
          <View style={styles.card}>
            <Text style={styles.label}>{t('node_id')}:</Text>
            <Text style={styles.monoValue}>node_{crypto.shortIdentifier}</Text>

            <View style={styles.divider} />

            <Text style={styles.label}>{t('ed25519_key')}:</Text>
            <Text style={styles.monoKey}>{crypto.publicKeyHex}</Text>

            <View style={styles.divider} />

            <Text style={styles.label}>{t('x25519_key')}:</Text>
            <Text style={styles.monoKey}>{crypto.agreementPublicKeyHex}</Text>
          </View>
        </View>

        {/* Tools Menu Navigation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('radio_section')}</Text>

          <TouchableOpacity
            style={styles.toolRow}
            onPress={() => navigation.navigate('QrPairing')}
          >
            <View style={[styles.toolIconBox, { borderColor: '#8A2387' }]}>
              <Ionicons name="qr-code" size={20} color="#C471ED" />
            </View>
            <Text style={styles.toolLabel}>{t('open_qr')}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolRow}
            onPress={() => navigation.navigate('ClipboardSync')}
          >
            <View style={[styles.toolIconBox, { borderColor: '#00F2FE' }]}>
              <Ionicons name="clipboard" size={20} color={theme.colors.accent} />
            </View>
            <Text style={styles.toolLabel}>{t('open_clip')}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolRow}
            onPress={() => navigation.navigate('MeshStatus')}
          >
            <View style={[styles.toolIconBox, { borderColor: '#00E676' }]}>
              <Ionicons name="pulse" size={20} color={theme.colors.success} />
            </View>
            <Text style={styles.toolLabel}>{t('open_diag')}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolRow}
            onPress={() => navigation.navigate('Sos')}
          >
            <View style={[styles.toolIconBox, { borderColor: theme.colors.sosEmergency }]}>
              <Ionicons name="warning" size={20} color={theme.colors.sosEmergency} />
            </View>
            <Text style={[styles.toolLabel, { color: theme.colors.sosEmergency }]}>
              {t('open_sos')}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolRow}
            onPress={() => navigation.navigate('NearbyPeers')}
          >
            <View style={[styles.toolIconBox, { borderColor: '#3B82F6' }]}>
              <Ionicons name="bluetooth" size={20} color="#60A5FA" />
            </View>
            <Text style={styles.toolLabel}>{t('open_peers')}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Danger Zone: Panic Purge */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.sosEmergency }]}>
            {t('data_section')}
          </Text>
          <TouchableOpacity style={styles.purgeButton} onPress={handlePurge} activeOpacity={0.85}>
            <Ionicons name="trash" size={18} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.purgeButtonText}>{t('purge_btn')}</Text>
          </TouchableOpacity>
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
  langSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  langCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: 'rgba(18, 26, 42, 0.65)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginHorizontal: 4,
  },
  langCardActive: {
    borderColor: theme.colors.accent,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
  },
  langFlag: {
    fontSize: 18,
    marginRight: 8,
  },
  langText: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  langTextActive: {
    color: theme.colors.textPrimary,
    fontWeight: '800',
  },
  card: {
    backgroundColor: 'rgba(18, 26, 42, 0.65)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 3,
  },
  monoValue: {
    color: theme.colors.accent,
    fontSize: 14,
    fontFamily: theme.typography.fontFamilyMono,
    fontWeight: '700',
  },
  monoKey: {
    color: theme.colors.textPrimary,
    fontSize: 11,
    fontFamily: theme.typography.fontFamilyMono,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginVertical: 12,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: 'rgba(18, 26, 42, 0.65)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 8,
  },
  toolIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginRight: 12,
  },
  toolLabel: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  purgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.sosEmergency,
    borderRadius: 16,
    paddingVertical: 14,
  },
  purgeButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
