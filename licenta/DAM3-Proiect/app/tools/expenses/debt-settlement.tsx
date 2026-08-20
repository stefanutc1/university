import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AlgoritmSimplificareDatoriiScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerBox}>
        <View style={styles.iconCircle}>
          <Ionicons name="trending-up-outline" size={28} color="#3b82f6" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Algoritm Simplificare Datorii</Text>
          <Text style={styles.headerSubtitle}>Minimizare numar tranzactii intre participanti prin algoritm Greedy</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Functionalitate Integrata (EXPENSES)</Text>
        <Text style={styles.cardText}>
          Acest modul ruleaza local pe dispozitivul mobil cu suport complet offline conform arhitecturii Local-First.
        </Text>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 16 },
  headerBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#f3f4f6', fontSize: 18, fontWeight: '700' },
  headerSubtitle: { color: '#9ca3af', fontSize: 12, marginTop: 2 },
  card: {
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#243049',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { color: '#3b82f6', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  cardText: { color: '#cbd5e1', fontSize: 13, lineHeight: 20 },
});
