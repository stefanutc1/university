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
import Ionicons from '@expo/vector-icons/Ionicons';
import { SosController } from '../../sos/SosController';
import { theme } from '../theme';
import { useI18n } from '../../i18n/I18nContext';

export const SosScreen: React.FC = () => {
  const sos = SosController.getInstance();
  const { t } = useI18n();

  const [isArmed, setIsArmed] = useState(sos.getArmedState());
  const [note, setNote] = useState('');

  const handleTrigger = async () => {
    try {
      await sos.triggerSos(note);
      setIsArmed(true);
      Alert.alert(
        'ALERTA SOS EMISĂ',
        'Semnalul de urgență cu coordonatele GPS a fost difuzat cu prioritate maximă prin întreaga rețea mesh.'
      );
    } catch (e: any) {
      Alert.alert('Eroare SOS', e.message);
    }
  };

  const handleCancel = () => {
    sos.cancelSos();
    setIsArmed(false);
    setNote('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('sos_title')}</Text>
        <Text style={styles.subtitle}>{t('sos_subtitle')}</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.statusBox, isArmed ? styles.statusBoxArmed : styles.statusBoxSafe]}>
          <Ionicons
            name={isArmed ? 'warning' : 'shield-checkmark'}
            size={18}
            color={isArmed ? theme.colors.sosEmergency : theme.colors.success}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.statusText, { color: isArmed ? theme.colors.sosEmergency : theme.colors.success }]}>
            {isArmed ? t('sos_armed') : t('sos_safe')}
          </Text>
        </View>

        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          placeholder={t('sos_note_ph')}
          placeholderTextColor={theme.colors.textMuted}
        />

        {/* Massive SOS Button with Glow */}
        <View style={styles.sosButtonOuter}>
          <TouchableOpacity
            style={[styles.sosButton, isArmed && styles.sosButtonActive]}
            onPress={isArmed ? handleCancel : handleTrigger}
            activeOpacity={0.8}
          >
            <Ionicons name="alert-circle" size={48} color="#ffffff" />
            <Text style={styles.sosButtonText}>
              {isArmed ? 'STOP' : 'SOS'}
            </Text>
            <Text style={styles.sosButtonSubtext}>
              {isArmed ? t('sos_cancel_btn') : t('sos_trigger_btn')}
            </Text>
          </TouchableOpacity>
        </View>
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
  },
  title: {
    color: theme.colors.sosEmergency,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
  },
  statusBoxSafe: {
    backgroundColor: 'rgba(0, 230, 118, 0.08)',
    borderColor: 'rgba(0, 230, 118, 0.25)',
  },
  statusBoxArmed: {
    backgroundColor: 'rgba(255, 42, 85, 0.12)',
    borderColor: 'rgba(255, 42, 85, 0.4)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: theme.typography.fontFamilyMono,
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 14,
    color: theme.colors.textPrimary,
    fontSize: 13,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  sosButtonOuter: {
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(255, 42, 85, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 42, 85, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosButton: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: theme.colors.sosEmergency,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.sosEmergency,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  sosButtonActive: {
    backgroundColor: '#7A1020',
  },
  sosButtonText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '900',
    fontFamily: theme.typography.fontFamilyMono,
    marginTop: 2,
  },
  sosButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
});
