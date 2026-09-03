import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { IncidentMapEngine, IncidentPin, IncidentSeverity } from '../../features/IncidentMapEngine';
import { theme } from '../theme';
import { useI18n } from '../../i18n/I18nContext';

export const IncidentMap: React.FC = () => {
  const mapEngine = IncidentMapEngine.getInstance();
  const { t } = useI18n();

  const [incidents, setIncidents] = useState<IncidentPin[]>(mapEngine.getIncidents());
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('HIGH');

  useEffect(() => {
    const unsubscribe = mapEngine.onIncident(() => {
      setIncidents([...mapEngine.getIncidents()]);
    });
    return unsubscribe;
  }, []);

  const handleAddIncident = () => {
    if (!title.trim()) return;

    const lat = 44.3302 + (Math.random() - 0.5) * 0.02;
    const lon = 23.7949 + (Math.random() - 0.5) * 0.02;

    mapEngine.addIncident(title.trim(), desc.trim(), lat, lon, severity, 'Operator');
    setTitle('');
    setDesc('');
    setIncidents([...mapEngine.getIncidents()]);
    Alert.alert('Succes', 'Marcajul a fost salvat pe harta offline și distribuit în rețeaua mesh.');
  };

  const getSeverityStyle = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return { color: theme.colors.sosEmergency, bg: 'rgba(255, 42, 85, 0.12)', border: 'rgba(255, 42, 85, 0.35)' };
      case 'HIGH':
        return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.35)' };
      case 'MEDIUM':
        return { color: theme.colors.accent, bg: 'rgba(0, 242, 254, 0.12)', border: 'rgba(0, 242, 254, 0.35)' };
      default:
        return { color: theme.colors.success, bg: 'rgba(0, 230, 118, 0.12)', border: 'rgba(0, 230, 118, 0.35)' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('map_title')}</Text>
        <Text style={styles.subtitle}>{t('map_subtitle')}</Text>
      </View>

      {/* Vector Map Canvas */}
      <View style={styles.mapCanvas}>
        <Ionicons name="navigate-circle" size={32} color={theme.colors.accent} style={{ marginBottom: 4 }} />
        <Text style={styles.mapCanvasText}>{t('map_canvas')}</Text>
        <Text style={styles.mapCanvasSubtext}>{t('map_grid')}</Text>
        <View style={styles.pinCounterBadge}>
          <Text style={styles.pinCounterText}>{incidents.length} {t('map_active_pins')}</Text>
        </View>
      </View>

      {/* Form Input */}
      <View style={styles.formSection}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={t('map_title_ph')}
          placeholderTextColor={theme.colors.textMuted}
        />
        <TextInput
          style={[styles.input, { minHeight: 40 }]}
          value={desc}
          onChangeText={setDesc}
          placeholder={t('map_desc_ph')}
          placeholderTextColor={theme.colors.textMuted}
        />

        {/* Severity Selector */}
        <View style={styles.severityRow}>
          {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as IncidentSeverity[]).map((sev) => {
            const style = getSeverityStyle(sev);
            return (
              <TouchableOpacity
                key={sev}
                style={[
                  styles.severityButton,
                  severity === sev && { borderColor: style.color, backgroundColor: style.bg },
                ]}
                onPress={() => setSeverity(sev)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.severityButtonText,
                    severity === sev && { color: style.color, fontWeight: '800' },
                  ]}
                >
                  {sev}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleAddIncident} activeOpacity={0.85}>
          <Ionicons name="location" size={16} color="#050B14" style={{ marginRight: 6 }} />
          <Text style={styles.submitButtonText}>{t('map_submit')}</Text>
        </TouchableOpacity>
      </View>

      {/* Incident List */}
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const styleInfo = getSeverityStyle(item.severity);
          return (
            <View style={[styles.incidentCard, { backgroundColor: styleInfo.bg, borderColor: styleInfo.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardSeverity, { color: styleInfo.color }]}>
                  {item.severity}
                </Text>
                <Text style={styles.cardTime}>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {item.description ? (
                <Text style={styles.cardDesc}>{item.description}</Text>
              ) : null}
              <Text style={styles.cardCoords}>
                GPS: {item.latitude.toFixed(4)}°, {item.longitude.toFixed(4)}° • {t('map_reported_by')}: {item.authorName}
              </Text>
            </View>
          );
        }}
        contentContainerStyle={styles.list}
      />
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
  mapCanvas: {
    height: 120,
    backgroundColor: 'rgba(18, 26, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  mapCanvasText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyMono,
    fontWeight: '800',
    fontSize: 12,
  },
  mapCanvasSubtext: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontFamily: theme.typography.fontFamilyMono,
    marginTop: 2,
  },
  pinCounterBadge: {
    position: 'absolute',
    top: 8,
    right: 12,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
  },
  pinCounterText: {
    color: theme.colors.accent,
    fontSize: 9,
    fontFamily: theme.typography.fontFamilyMono,
    fontWeight: '800',
  },
  formSection: {
    padding: theme.spacing.md,
    backgroundColor: 'rgba(14, 20, 32, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    color: theme.colors.textPrimary,
    fontSize: 13,
    marginBottom: 6,
  },
  severityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginHorizontal: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  severityButtonText: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
    paddingVertical: 11,
    borderRadius: 14,
    marginTop: 6,
  },
  submitButtonText: {
    color: '#050B14',
    fontSize: 13,
    fontWeight: '800',
  },
  list: {
    padding: theme.spacing.md,
    paddingBottom: 110,
  },
  incidentCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardSeverity: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: theme.typography.fontFamilyMono,
  },
  cardTime: {
    color: theme.colors.textMuted,
    fontSize: 10,
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardDesc: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  cardCoords: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontFamily: theme.typography.fontFamilyMono,
  },
});
