import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVoiceNotesStore, VoiceNote } from '../../../src/stores/useVoiceNotesStore';

export default function VoiceRecorderScreen() {
  const { notes, addNote, deleteNote, updateTranscription, searchQuery, setSearchQuery } = useVoiceNotesStore();

  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [noteTitle, setNoteTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'Cursuri' | 'Idei Proiect' | 'Sedinte' | 'Generale'>('Idei Proiect');
  const [expandedId, setExpandedId] = useState<string | null>('vn1');
  const [editingTranscript, setEditingTranscript] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartStop = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      const title = noteTitle.trim() || `Notă Vocală ${new Date().toLocaleDateString()}`;
      addNote({
        title,
        durationSec: seconds || 1,
        fileUri: `file:///records/voice_${Date.now()}.m4a`,
        transcription: 'Transcriere automată generată local: Notă înregistrată rapid pentru curs/proiect DAM.',
        category: selectedCategory,
        sizeKb: Math.round(seconds * 8) || 32,
      });
      setNoteTitle('');
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      n.title.toLowerCase().includes(q) ||
      n.transcription.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q)
    );
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.iconCircle}>
          <Ionicons name="mic-outline" size={28} color="#ef4444" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Înregistrator Voce & Notițe</Text>
          <Text style={styles.headerSubtitle}>Înregistrare rapidă pentru cursuri, idei de proiect și jurnal transcrieri</Text>
        </View>
      </View>

      {/* Recording Studio Card */}
      <View style={styles.studioCard}>
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
        <Text style={styles.recordStatus}>
          {isRecording ? 'Se înregistrează audio de la microfon...' : 'Apasă butonul roșu pentru a înregistra'}
        </Text>

        {/* Waveform indicator */}
        <View style={styles.waveRow}>
          {[12, 28, 45, 18, 36, 52, 24, 40, 15, 30].map((h, i) => (
            <View
              key={i}
              style={[
                styles.waveBar,
                { height: isRecording ? Math.max(8, (h * ((seconds % 3) + 1)) % 48) : 8 },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
          onPress={handleStartStop}
        >
          <Ionicons name={isRecording ? 'stop' : 'mic'} size={32} color="#ffffff" />
        </TouchableOpacity>

        {!isRecording && (
          <View style={styles.metaInputs}>
            <TextInput
              style={styles.titleInput}
              placeholder="Titlu opțional notă (ex: Laborator DAM 3)..."
              placeholderTextColor="#6b7280"
              value={noteTitle}
              onChangeText={setNoteTitle}
            />
            <View style={styles.catChips}>
              {(['Cursuri', 'Idei Proiect', 'Sedinte', 'Generale'] as const).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Search & List */}
      <View style={styles.listSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Caută în notițe și transcrieri..."
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.listTitle}>Notițe Înregistrate ({filteredNotes.length})</Text>

        {filteredNotes.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <View key={item.id} style={styles.noteCard}>
              <TouchableOpacity
                style={styles.noteHeader}
                onPress={() => {
                  if (isExpanded) setExpandedId(null);
                  else {
                    setExpandedId(item.id);
                    setEditingTranscript(item.transcription);
                  }
                }}
              >
                <View style={styles.playIconBox}>
                  <Ionicons name="play" size={16} color="#3b82f6" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemMeta}>
                    {item.category} • {formatTime(item.durationSec)} • {item.sizeKb} KB • {item.createdAt}
                  </Text>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <Text style={styles.transcriptLabel}>Jurnal Transcriere & Observații:</Text>
                  <TextInput
                    style={styles.transcriptInput}
                    multiline
                    value={editingTranscript}
                    onChangeText={setEditingTranscript}
                    onBlur={() => updateTranscription(item.id, editingTranscript)}
                  />
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => deleteNote(item.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#ef4444" />
                      <Text style={styles.deleteBtnText}>Șterge Notița</Text>
                    </TouchableOpacity>
                    <Text style={styles.savedHint}>Modificările se salvează automat local</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 16 },
  headerBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#3b1c1c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#f3f4f6', fontSize: 18, fontWeight: '700' },
  headerSubtitle: { color: '#9ca3af', fontSize: 12, marginTop: 2 },
  studioCard: {
    backgroundColor: '#121826',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#243049',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: { color: '#f3f4f6', fontSize: 40, fontWeight: '800', letterSpacing: 2 },
  recordStatus: { color: '#9ca3af', fontSize: 12, marginVertical: 6 },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 50,
    marginVertical: 12,
  },
  waveBar: {
    width: 6,
    backgroundColor: '#ef4444',
    borderRadius: 3,
  },
  recordBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  recordBtnActive: { backgroundColor: '#dc2626', transform: [{ scale: 1.08 }] },
  metaInputs: { width: '100%', marginTop: 16 },
  titleInput: {
    backgroundColor: '#1b2336',
    color: '#f3f4f6',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#374151',
    fontSize: 13,
    marginBottom: 10,
  },
  catChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  catChip: {
    backgroundColor: '#1b2336',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#374151',
  },
  catChipActive: { backgroundColor: '#991b1b', borderColor: '#ef4444' },
  catText: { color: '#cbd5e1', fontSize: 11 },
  catTextActive: { color: '#fecaca', fontWeight: '700' },
  listSection: { marginTop: 4 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#243049',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
    gap: 8,
  },
  searchInput: { color: '#f3f4f6', flex: 1, fontSize: 13 },
  listTitle: { color: '#f3f4f6', fontSize: 15, fontWeight: '700', marginBottom: 10 },
  noteCard: {
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#243049',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  playIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: { color: '#f3f4f6', fontSize: 14, fontWeight: '600' },
  itemMeta: { color: '#9ca3af', fontSize: 11, marginTop: 2 },
  expandedContent: {
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#1e293b',
    backgroundColor: '#0d131f',
  },
  transcriptLabel: { color: '#3b82f6', fontSize: 12, fontWeight: '600', marginBottom: 6 },
  transcriptInput: {
    backgroundColor: '#151d30',
    borderRadius: 8,
    color: '#e2e8f0',
    padding: 10,
    fontSize: 13,
    minHeight: 60,
    lineHeight: 18,
    borderWidth: 1,
    borderColor: '#243049',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deleteBtnText: { color: '#ef4444', fontSize: 12, fontWeight: '600' },
  savedHint: { color: '#64748b', fontSize: 11 },
});
