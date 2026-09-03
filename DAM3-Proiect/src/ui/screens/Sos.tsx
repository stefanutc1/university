import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { SosController } from '../../sos/SosController';
import { theme } from '../theme';

export const SosScreen: React.FC = () => {
  const sosController = SosController.getInstance();

  const [isArmed, setIsArmed] = useState(sosController.getArmedState());
  const [note, setNote] = useState('');

  const handleTrigger = async () => {
    setIsArmed(true);
    await sosController.triggerSos(note);
  };

  const handleCancel = () => {
    setIsArmed(false);
    sosController.cancelSos();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.warningHeader}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.title}>EMERGENCY SOS BEACON</Text>
          <Text style={styles.subtitle}>
            Deliberate emergency broadcast. Nearby mesh nodes will relay your distress signal and GPS location without internet access.
          </Text>
        </View>

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>EMERGENCY DETAILS / LANDMARK</Text>
          <TextInput
            style={styles.textInput}
            value={note}
            onChangeText={setNote}
            placeholder="Describe injury, terrain landmark, or assistance needed..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />
        </View>

        {isArmed ? (
          <View style={styles.activeCard}>
            <Text style={styles.activeTitle}>SOS BROADCAST ACTIVE</Text>
            <Text style={styles.activeSubtitle}>
              Repeatedly transmitting beacon across BLE and local ad-hoc peer mesh...
            </Text>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>DEACTIVATE SOS</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.triggerButton} onPress={handleTrigger}>
            <Text style={styles.triggerButtonText}>BROADCAST SOS DISTRESS</Text>
          </TouchableOpacity>
        )}

        <View style={styles.guaranteesCard}>
          <Text style={styles.guaranteesHeader}>PROTOCOL GUARANTEES</Text>
          <Text style={styles.guaranteesBody}>
            • Hop Limit: 12 hops max range{'\n'}
            • Cryptographic Signature: Ed25519 authenticated{'\n'}
            • Privacy: Coordinates included only when armed{'\n'}
            • Retries: Multi-path gossip store-and-forward
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
    padding: theme.spacing.lg,
  },
  warningHeader: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    lineHeight: 18,
  },
  inputCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontFamily: theme.typography.fontFamilyMono,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  textInput: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    minHeight: 60,
  },
  triggerButton: {
    backgroundColor: theme.colors.sosEmergency,
    paddingVertical: 18,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  triggerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  activeCard: {
    backgroundColor: theme.colors.sosBackground,
    borderColor: theme.colors.sosEmergency,
    borderWidth: 1.5,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  activeTitle: {
    color: theme.colors.sosEmergency,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: theme.typography.fontFamilyMono,
  },
  activeSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginVertical: theme.spacing.sm,
  },
  cancelButton: {
    backgroundColor: theme.colors.surfaceBorder,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.sm,
  },
  cancelButtonText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  guaranteesCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  guaranteesHeader: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamilyMono,
    marginBottom: theme.spacing.xs,
  },
  guaranteesBody: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 20,
  },
});
