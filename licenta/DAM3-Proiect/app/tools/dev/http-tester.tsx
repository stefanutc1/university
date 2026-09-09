import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHttpTesterStore, HttpMethod } from '../../../src/stores/useHttpTesterStore';

export default function HttpTesterScreen() {
  const {
    currentMethod,
    currentUrl,
    currentHeaders,
    currentBody,
    isLoading,
    lastResponse,
    history,
    savedPresets,
    setCurrentMethod,
    setCurrentUrl,
    setCurrentHeaders,
    setCurrentBody,
    executeRequest,
    loadFromHistory,
    clearHistory,
  } = useHttpTesterStore();

  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');
  const [copiedResponse, setCopiedResponse] = useState(false);

  const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  const methodColors: Record<HttpMethod, string> = {
    GET: '#10b981',
    POST: '#3b82f6',
    PUT: '#f59e0b',
    DELETE: '#ef4444',
    PATCH: '#8b5cf6',
  };

  const handleCopyBody = () => {
    if (!lastResponse?.body) return;
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.iconCircle}>
          <Ionicons name="cloud-upload-outline" size={28} color="#8b5cf6" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Tester HTTP & API (Postman Lite)</Text>
          <Text style={styles.headerSubtitle}>Trimite cereri REST, testează endpoint-uri și inspectează răspunsuri JSON</Text>
        </View>
      </View>

      {/* Preset shortcuts */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
        {savedPresets.map((p, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.presetChip}
            onPress={() => {
              setCurrentMethod(p.method);
              setCurrentUrl(p.url);
              if (p.body) setCurrentBody(p.body);
            }}
          >
            <Text style={[styles.presetMethod, { color: methodColors[p.method] }]}>{p.method}</Text>
            <Text style={styles.presetName}>{p.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Method & URL Input */}
      <View style={styles.requestBar}>
        <View style={styles.methodSelector}>
          {methods.map((m) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.methodBtn,
                currentMethod === m && { backgroundColor: methodColors[m] },
              ]}
              onPress={() => setCurrentMethod(m)}
            >
              <Text
                style={[
                  styles.methodBtnText,
                  currentMethod === m && styles.methodBtnTextActive,
                ]}
              >
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.urlInput}
          value={currentUrl}
          onChangeText={setCurrentUrl}
          placeholder="https://api.example.com/endpoint..."
          placeholderTextColor="#64748b"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.sendBtn, isLoading && styles.sendBtnDisabled]}
          onPress={executeRequest}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Ionicons name="send" size={16} color="#ffffff" />
              <Text style={styles.sendBtnText}>Trimite Cererea</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Request Options Tabs */}
      <View style={styles.tabsCard}>
        <View style={styles.tabHeader}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'body' && styles.tabBtnActive]}
            onPress={() => setActiveTab('body')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'body' && styles.tabBtnTextActive]}>
              Request Body (JSON)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'headers' && styles.tabBtnActive]}
            onPress={() => setActiveTab('headers')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'headers' && styles.tabBtnTextActive]}>
              Headers (JSON)
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'body' ? (
          <TextInput
            style={styles.editorInput}
            multiline
            value={currentBody}
            onChangeText={setCurrentBody}
            placeholder='{\n  "key": "value"\n}'
            placeholderTextColor="#475569"
            autoCapitalize="none"
          />
        ) : (
          <TextInput
            style={styles.editorInput}
            multiline
            value={currentHeaders}
            onChangeText={setCurrentHeaders}
            placeholder='{\n  "Authorization": "Bearer ..."\n}'
            placeholderTextColor="#475569"
            autoCapitalize="none"
          />
        )}
      </View>

      {/* Response Section */}
      {lastResponse && (
        <View style={styles.responseCard}>
          <View style={styles.responseHeader}>
            <View style={styles.statusGroup}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      lastResponse.status >= 200 && lastResponse.status < 300
                        ? '#064e3b'
                        : lastResponse.status >= 400
                        ? '#7f1d1d'
                        : '#78350f',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    {
                      color:
                        lastResponse.status >= 200 && lastResponse.status < 300
                          ? '#34d399'
                          : lastResponse.status >= 400
                          ? '#f87171'
                          : '#fbbf24',
                    },
                  ]}
                >
                  {lastResponse.status || 'ERR'} {lastResponse.statusText}
                </Text>
              </View>
              <Text style={styles.resMeta}>⏱ {lastResponse.timeMs} ms</Text>
              <Text style={styles.resMeta}>📦 {lastResponse.sizeKb} KB</Text>
            </View>

            <TouchableOpacity style={styles.copyResBtn} onPress={handleCopyBody}>
              <Ionicons name={copiedResponse ? 'checkmark' : 'copy-outline'} size={14} color="#38bdf8" />
              <Text style={styles.copyResText}>{copiedResponse ? 'Copiat!' : 'Copiază'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.responseScroll} nestedScrollEnabled>
            <Text style={styles.responseBodyText}>{lastResponse.body}</Text>
          </ScrollView>
        </View>
      )}

      {/* History */}
      {history.length > 0 && (
        <View style={styles.historyCard}>
          <View style={styles.histTitleRow}>
            <Text style={styles.histTitle}>Istoric Apeluri Recente ({history.length})</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearHistText}>Șterge</Text>
            </TouchableOpacity>
          </View>

          {history.map((h) => (
            <TouchableOpacity
              key={h.id}
              style={styles.histItem}
              onPress={() => loadFromHistory(h)}
            >
              <Text style={[styles.histMethod, { color: methodColors[h.method] }]}>{h.method}</Text>
              <Text style={styles.histUrl} numberOfLines={1}>
                {h.url}
              </Text>
              <Text style={styles.histStatus}>
                {h.response ? `${h.response.status}` : 'Err'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 16 },
  headerBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#27193d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#f3f4f6', fontSize: 18, fontWeight: '700' },
  headerSubtitle: { color: '#9ca3af', fontSize: 12, marginTop: 2 },
  presetScroll: { marginBottom: 12 },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#243049',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
    gap: 6,
  },
  presetMethod: { fontSize: 11, fontWeight: '700' },
  presetName: { color: '#cbd5e1', fontSize: 11 },
  requestBar: {
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#243049',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  methodSelector: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  methodBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#1b2336',
  },
  methodBtnText: { color: '#94a3b8', fontSize: 11, fontWeight: '700' },
  methodBtnTextActive: { color: '#ffffff' },
  urlInput: {
    backgroundColor: '#1b2336',
    color: '#f3f4f6',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 10,
  },
  sendBtn: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  sendBtnDisabled: { opacity: 0.6 },
  sendBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  tabsCard: {
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#243049',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  tabHeader: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  tabBtn: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  tabBtnActive: { backgroundColor: '#1e293b' },
  tabBtnText: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  tabBtnTextActive: { color: '#38bdf8' },
  editorInput: {
    backgroundColor: '#0d131f',
    borderRadius: 8,
    color: '#38bdf8',
    fontFamily: 'monospace',
    fontSize: 12,
    padding: 10,
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  responseCard: {
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#243049',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusBadge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  statusBadgeText: { fontSize: 12, fontWeight: '700' },
  resMeta: { color: '#94a3b8', fontSize: 11 },
  copyResBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  copyResText: { color: '#38bdf8', fontSize: 11, fontWeight: '600' },
  responseScroll: {
    backgroundColor: '#090d16',
    borderRadius: 8,
    padding: 10,
    maxHeight: 220,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  responseBodyText: { color: '#a7f3d0', fontFamily: 'monospace', fontSize: 11, lineHeight: 16 },
  historyCard: {
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#243049',
    borderRadius: 14,
    padding: 12,
  },
  histTitleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  histTitle: { color: '#f3f4f6', fontSize: 13, fontWeight: '700' },
  clearHistText: { color: '#ef4444', fontSize: 11 },
  histItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#1e293b',
    gap: 8,
  },
  histMethod: { fontSize: 11, fontWeight: '700', width: 45 },
  histUrl: { color: '#cbd5e1', fontSize: 12, flex: 1 },
  histStatus: { color: '#94a3b8', fontSize: 11 },
});
