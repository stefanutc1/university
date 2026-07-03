import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { calculateSubnet, SubnetResult } from '../../../src/algorithms/subnetCalculator';

export default function SubnetCalcScreen() {
  const [ipInput, setIpInput] = useState('192.168.1.100');
  const [cidrInput, setCidrInput] = useState(24);
  const [result, setResult] = useState<SubnetResult>(() => calculateSubnet('192.168.1.100', 24));
  const [error, setError] = useState('');

  const handleCompute = (ip: string, cidr: number) => {
    try {
      setError('');
      const res = calculateSubnet(ip, cidr);
      setResult(res);
    } catch (e: any) {
      setError(e.message || 'Eroare la calcul subnet');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Calculator IPv4 & Subnet Mask</Text>
      <Text style={styles.headerSubtitle}>Calculare intervale gazde, broadcast si reprezentari binare</Text>

      <View style={styles.inputCard}>
        <Text style={styles.label}>Adresa IP:</Text>
        <TextInput
          style={styles.textInput}
          value={ipInput}
          onChangeText={(v) => {
            setIpInput(v);
            handleCompute(v, cidrInput);
          }}
          placeholder="ex: 192.168.1.1"
          placeholderTextColor="#6b7280"
          keyboardType="numeric"
        />

        <View style={styles.cidrRow}>
          <Text style={styles.label}>Prefix CIDR: /{cidrInput}</Text>
          <View style={styles.presetButtons}>
            {[8, 16, 24, 28, 30].map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.presetBtn, cidrInput === c && styles.presetBtnActive]}
                onPress={() => {
                  setCidrInput(c);
                  handleCompute(ipInput, c);
                }}
              >
                <Text style={styles.presetText}>/{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {/* Results grid */}
      <View style={styles.resultCard}>
        <View style={styles.row}>
          <Text style={styles.k}>Masca Subnet:</Text>
          <Text style={styles.v}>{result.netmask}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.k}>Adresa Retea:</Text>
          <Text style={styles.vHighlight}>{result.networkAddress}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.k}>Adresa Broadcast:</Text>
          <Text style={styles.vHighlight}>{result.broadcastAddress}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.k}>Prima Gazda Utila:</Text>
          <Text style={styles.v}>{result.firstUsableIp}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.k}>Ultima Gazda Utila:</Text>
          <Text style={styles.v}>{result.lastUsableIp}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.k}>Gazde Utile:</Text>
          <Text style={styles.vBadge}>{result.usableHosts.toLocaleString()} adrese</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.k}>Clasa Retea:</Text>
          <Text style={styles.v}>{result.ipClass} ({result.isPrivate ? 'Privata RFC1918' : 'Publica'})</Text>
        </View>
        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <Text style={styles.k}>Masca Binara:</Text>
          <Text style={styles.vCode}>{result.binaryMask}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 16 },
  headerTitle: { color: '#f3f4f6', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  headerSubtitle: { color: '#9ca3af', fontSize: 13, marginBottom: 16 },
  inputCard: {
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#243049',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  label: { color: '#f3f4f6', fontSize: 14, fontWeight: '600', marginBottom: 6 },
  textInput: {
    backgroundColor: '#1b2336',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    color: '#f3f4f6',
    padding: 10,
    fontSize: 15,
    marginBottom: 14,
  },
  cidrRow: { marginTop: 4 },
  presetButtons: { flexDirection: 'row', gap: 8, marginTop: 6 },
  presetBtn: {
    backgroundColor: '#1b2336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  presetBtnActive: { backgroundColor: '#3b82f6', borderColor: '#60a5fa' },
  presetText: { color: '#f3f4f6', fontWeight: '600', fontSize: 13 },
  errorText: { color: '#ef4444', marginTop: 8, fontSize: 13 },
  resultCard: {
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#243049',
    borderRadius: 14,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    alignItems: 'center',
  },
  k: { color: '#9ca3af', fontSize: 13 },
  v: { color: '#f3f4f6', fontSize: 14, fontWeight: '600' },
  vHighlight: { color: '#3b82f6', fontSize: 14, fontWeight: '700' },
  vBadge: { color: '#10b981', fontSize: 14, fontWeight: '700' },
  vCode: { color: '#a78bfa', fontSize: 11, fontFamily: 'monospace' },
});

// Interactive slider touch support

// Visual bitmask breakdown active
