import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { VoiceIntercomEngine, IntercomState } from '../../features/VoiceIntercomEngine';
import { theme } from '../theme';
import { useI18n } from '../../i18n/I18nContext';

export const VoiceIntercom: React.FC = () => {
  const intercom = VoiceIntercomEngine.getInstance();
  const { t } = useI18n();

  const [state, setState] = useState<IntercomState>(intercom.getState());
  const [activeSpeaker, setActiveSpeaker] = useState<string | undefined>();
  const [channel] = useState(intercom.getChannel());

  useEffect(() => {
    const unsubscribe = intercom.onStateChange((newState, speaker) => {
      setState(newState);
      setActiveSpeaker(speaker);
    });
    return unsubscribe;
  }, []);

  const handlePressIn = () => {
    intercom.startTransmitting('Me');
  };

  const handlePressOut = () => {
    intercom.stopTransmitting();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('walkie_title')}</Text>
        <View style={styles.channelBadge}>
          <Ionicons name="radio" size={12} color={theme.colors.accent} style={{ marginRight: 4 }} />
          <Text style={styles.channelBadgeText}>{t('walkie_channel')}: {channel.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        {state === 'IDLE' && (
          <Text style={styles.statusText}>{t('walkie_idle')}</Text>
        )}
        {state === 'TRANSMITTING' && (
          <Text style={[styles.statusText, styles.statusTx]}>{t('walkie_tx')}</Text>
        )}
        {state === 'RECEIVING' && (
          <Text style={[styles.statusText, styles.statusRx]}>
            {t('walkie_rx')}: {activeSpeaker || 'Peer'}
          </Text>
        )}
      </View>

      {/* Push-to-Talk Main Button with Concentric Halo */}
      <View style={styles.pttContainer}>
        <View style={[
          styles.haloOuter,
          state === 'TRANSMITTING' && styles.haloTx,
          state === 'RECEIVING' && styles.haloRx,
        ]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.pttButton,
              state === 'TRANSMITTING' && styles.pttButtonActive,
              state === 'RECEIVING' && styles.pttButtonReceiving,
            ]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Ionicons
              name={state === 'TRANSMITTING' ? 'mic' : 'mic-outline'}
              size={56}
              color={state === 'TRANSMITTING' ? '#ffffff' : theme.colors.accent}
            />
            <Text style={styles.pttText}>
              {state === 'TRANSMITTING' ? t('walkie_transmit') : 'PTT'}
            </Text>
            <Text style={styles.pttSubtext}>{t('walkie_hold')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoFooter}>
        <Text style={styles.infoText}>
          {t('walkie_info')}
        </Text>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  channelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
  },
  channelBadgeText: {
    color: theme.colors.accent,
    fontSize: 10,
    fontFamily: theme.typography.fontFamilyMono,
    fontWeight: '800',
  },
  statusContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  statusText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  statusTx: {
    color: theme.colors.sosEmergency,
    fontWeight: '800',
    fontFamily: theme.typography.fontFamilyMono,
    letterSpacing: 0.5,
  },
  statusRx: {
    color: theme.colors.success,
    fontWeight: '800',
    fontFamily: theme.typography.fontFamilyMono,
    letterSpacing: 0.5,
  },
  pttContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  haloOuter: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloTx: {
    borderColor: 'rgba(255, 42, 85, 0.4)',
    backgroundColor: 'rgba(255, 42, 85, 0.08)',
  },
  haloRx: {
    borderColor: 'rgba(0, 230, 118, 0.4)',
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
  },
  pttButton: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(18, 26, 42, 0.85)',
    borderColor: 'rgba(0, 242, 254, 0.4)',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  pttButtonActive: {
    borderColor: theme.colors.sosEmergency,
    backgroundColor: '#351014',
    shadowColor: theme.colors.sosEmergency,
  },
  pttButtonReceiving: {
    borderColor: theme.colors.success,
    backgroundColor: '#0e2b1e',
    shadowColor: theme.colors.success,
  },
  pttText: {
    color: theme.colors.textPrimary,
    fontSize: 26,
    fontWeight: '900',
    fontFamily: theme.typography.fontFamilyMono,
    marginTop: 4,
  },
  pttSubtext: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  infoFooter: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 95,
    alignItems: 'center',
  },
  infoText: {
    color: theme.colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
