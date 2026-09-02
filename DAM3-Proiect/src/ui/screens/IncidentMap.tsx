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
import { IncidentMapEngine, IncidentPin, IncidentSeverity } from '../../features/IncidentMapEngine';
import { theme } from '../theme';

export const IncidentMap: React.FC = () => {
  const mapEngine = IncidentMapEngine.getInstance();

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

    // Coordonate simulate (centrul Craiova sau locatia GPS curenta)
    const lat = 44.3302 + (Math.random() - 0.5) * 0.02;
    const lon = 23.7949 + (Math.random() - 0.5) * 0.02;

    mapEngine.addIncident(title.trim(), desc.trim(), lat, lon, severity, 'Operator-Nod');
    setTitle('');
    setDesc('');
    setIncidents([...mapEngine.getIncidents()]);
    Alert.alert('Incident Transmis', 'Marcajul a fost salvat pe harta offline si distribuit colegilor.');
  };

  const getSeverityStyle = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return { color: theme.colors.sosEmergency, bg: '#3a1114' };
      case 'HIGH':
        return { color: '#f59e0b', bg: '#3a2e11' };
      case 'MEDIUM':
        return { color: '#3b82f6', bg: '#11223a' };
      default:
        return { color: theme.colors.success, bg: '#113a20' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Harti & Marcaje Offline</Text>
        <Text style={styles.subtitle}>OpenStreetMap local caching • Incident Pinning distribuit instant</Text>
      </View>

      {/* Mock Map Canvas */}
      <View style={styles.mapCanvas}>
        <Text style={styles.mapCanvasText}>[ HARTA OFFLINE VECTORIALA OSM ]</Text>
        <Text style={styles.mapCanvasSubtext}>Grid GPS: 44.3302°N, 23.7949°E (Craiova Sector)</Text>
        <View style={styles.pinCounterBadge}>
          <Text style={styles.pinCounterText}>{incidents.length} MARCAJE ACTIVE</Text>
        </View>
      </View>

      {/* Incident Input Form */}
      <View style={styles.formSection}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Titlu Incident (ex: Drum blocat, Copac cazut)..."
          placeholderTextColor={theme.colors.textSecondary}
        />
        <TextInput
          style={[styles.input, { minHeight: 40 }]}
          value={desc}
          onChangeText={setDesc}
          placeholder="Detalii suplimentare situatie..."
          placeholderTextColor={theme.colors.textSecondary}
        />

        {/* Severity Selector */}
        <View style={styles.severityRow}>
          {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as IncidentSeverity[]).map((sev) => (
            <TouchableOpacity
              key={sev}
              style={[
                styles.severityButton,
                severity === sev && styles.severityButtonActive,
              ]}
              onPress={() => setSeverity(sev)}
            >
              <Text
                style={[
                  styles.severityButtonText,
                  severity === sev && { color: getSeverityStyle(sev).color },
                ]}
              >
                {sev}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleAddIncident}>
          <Text style={styles.submitButtonText}>Plaseaza & Distribuie Marcaj</Text>
        </TouchableOpacity>
      </View>

      {/* Incident List */}
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const styleInfo = getSeverityStyle(item.severity);
          return (
            <View style={[styles.incidentCard, { backgroundColor: styleInfo.bg }]}>
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
                GPS: {item.latitude.toFixed(4)}°, {item.longitude.toFixed(4)}° • Raportat de: {item.authorName}
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
  mapCanvas: {
    height: 120,
    backgroundColor: '#17202e',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  mapCanvasText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamilyMono,
    fontWeight: '800',
    fontSize: 13,
  },
  mapCanvasSubtext: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontFamily: theme.typography.fontFamilyMono,
    marginTop: 4,
  },
  pinCounterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
  },
  pinCounterText: {
    color: theme.colors.accent,
    fontSize: 9,
    fontFamily: theme.typography.fontFamilyMono,
    fontWeight: '700',
  },
  formSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    color: theme.colors.textPrimary,
    fontSize: 13,
    marginBottom: theme.spacing.xs,
  },
  severityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.xs,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    marginHorizontal: 2,
    borderRadius: theme.borderRadius.sm,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
  },
  severityButtonActive: {
    borderColor: theme.colors.accent,
  },
  severityButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: theme.colors.accentDark,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.xs,
  },
  submitButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  list: {
    padding: theme.spacing.md,
  },
  incidentCard: {
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
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
    color: theme.colors.textSecondary,
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
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontFamily: theme.typography.fontFamilyMono,
  },
});
