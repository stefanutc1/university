import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { VoiceIntercomEngine, IntercomState } from '../../features/VoiceIntercomEngine';
import { theme } from '../theme';

export const VoiceIntercom: React.FC = () => {
  const intercom = VoiceIntercomEngine.getInstance();
  const [state, setState] = useState<IntercomState>(intercom.getState());
  const [activeSpeaker, setActiveSpeaker] = useState<string | undefined>();
  const [channel, setChannel] = useState(intercom.getChannel());

  useEffect(() => {
    const unsubscribe = intercom.onStateChange((newState, speaker) => {
      setState(newState);
      setActiveSpeaker(speaker);
    });
    return unsubscribe;
  }, []);

  const handlePressIn = () => {
    intercom.startTransmitting('Worker-Me');
  };

  const handlePressOut = () => {
    intercom.stopTransmitting();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Walkie-Talkie Push-to-Talk</Text>
        <Text style={styles.channelBadge}>CANAL: {channel.toUpperCase()}</Text>
      </View>

      <View style={styles.statusContainer}>
        {state === 'IDLE' && (
          <Text style={styles.statusText}>Canal liber • Tine apasat pentru a vorbi</Text>
        )}
        {state === 'TRANSMITTING' && (
          <Text style={[styles.statusText, styles.statusTx]}>EMISIE AUDIO ACTIVA...</Text>
        )}
        {state === 'RECEIVING' && (
          <Text style={[styles.statusText, styles.statusRx]}>
            RECEPTIE: {activeSpeaker || 'Nod Vecin'}
          </Text>
        )}
      </View>

      {/* Push-to-Talk Main Button */}
      <View style={styles.pttContainer}>
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
          <Text style={styles.pttText}>
            {state === 'TRANSMITTING' ? 'EMITE' : 'PTT'}
          </Text>
          <Text style={styles.pttSubtext}>Tine apasat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoFooter}>
        <Text style={styles.infoText}>
          Streaming direct WebSocket P2P • Latenta sub 5ms{'\n'}
          Util pe santiere, drumetii si zone fara semnal GSM.
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
    padding: theme.spacing.lg,
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
  channelBadge: {
    color: theme.colors.accent,
    fontSize: 11,
    fontFamily: theme.typography.fontFamilyMono,
    fontWeight: '700',
    backgroundColor: theme.colors.surfaceBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  statusContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  statusText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  statusTx: {
    color: theme.colors.sosEmergency,
    fontWeight: '800',
    fontFamily: theme.typography.fontFamilyMono,
  },
  statusRx: {
    color: theme.colors.success,
    fontWeight: '800',
    fontFamily: theme.typography.fontFamilyMono,
  },
  pttContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pttButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pttButtonActive: {
    borderColor: theme.colors.sosEmergency,
    backgroundColor: '#351014',
  },
  pttButtonReceiving: {
    borderColor: theme.colors.success,
    backgroundColor: '#0e2b1e',
  },
  pttText: {
    color: theme.colors.textPrimary,
    fontSize: 32,
    fontWeight: '900',
    fontFamily: theme.typography.fontFamilyMono,
  },
  pttSubtext: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  infoFooter: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  infoText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: theme.typography.fontFamilyMono,
  },
});
