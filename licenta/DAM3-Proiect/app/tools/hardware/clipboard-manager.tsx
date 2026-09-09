import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useClipboardStore, ClipCategory } from '../../../src/stores/useClipboardStore';

export default function ClipboardManagerScreen() {
  const {
    items,
    addClip,
    removeClip,
    togglePin,
    clearUnpinned,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useClipboardStore();

  const [inputClip, setInputClip] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!inputClip.trim()) return;
    addClip(inputClip);
    setInputClip('');
  };

  const handleCopy = (id: string, text: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const categoryBadges: Record<ClipCategory, { label: string; color: string; icon: any }> = {
    link: { label: 'Link / URL', color: '#3b82f6', icon: 'link-outline' },
    code: { label: 'Cod / JSON', color: '#10b981', icon: 'code-slash-outline' },
    secret: { label: 'Parolă / Cheie', color: '#f59e0b', icon: 'key-outline' },
    text: { label: 'Text Simplu', color: '#9ca3af', icon: 'document-text-outline' },
  };

  const filteredItems = items.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchCat;
    return matchCat && item.text.toLowerCase().includes(q);
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.iconCircle}>
          <Ionicons name="clipboard-outline" size={28} color="#10b981" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Manager Istoric Clipboard</Text>
          <Text style={styles.headerSubtitle}>Reține automat textele copiate, organizate pe categorii inteligente</Text>
        </View>
      </View>

      {/* Manual / Capture box */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Adaugă Text sau Snippet în Istoric:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Lipește aici un link, cod, comandă terminal sau parolă..."
          placeholderTextColor="#6b7280"
          value={inputClip}
          onChangeText={setInputClip}
          multiline
        />
        <View style={styles.addActions}>
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Ionicons name="add" size={18} color="#ffffff" />
            <Text style={styles.addBtnText}>Salvează în Istoric</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search & Category filter */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Caută în textele salvate..."
          placeholderTextColor="#6b7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#9ca3af" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.catChips}>
        {[
          { key: 'all', label: 'Toate' },
          { key: 'link', label: 'Link-uri' },
          { key: 'code', label: 'Cod & Script' },
          { key: 'secret', label: 'Parole / Chei' },
          { key: 'text', label: 'Texte' },
        ].map((c) => (
          <TouchableOpacity
            key={c.key}
            style={[styles.catChip, selectedCategory === c.key && styles.catChipActive]}
            onPress={() => setSelectedCategory(c.key)}
          >
            <Text style={[styles.catText, selectedCategory === c.key && styles.catTextActive]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List Header */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Elemente Păstrate ({filteredItems.length})</Text>
        <TouchableOpacity onPress={clearUnpinned}>
          <Text style={styles.clearBtnText}>Curăță Nefixate</Text>
        </TouchableOpacity>
      </View>

      {/* Clip Cards */}
      {filteredItems.map((item) => {
        const badge = categoryBadges[item.category];
        const isCopied = copiedId === item.id;

        return (
          <View key={item.id} style={[styles.clipCard, item.isPinned && styles.clipCardPinned]}>
            <View style={styles.clipHeader}>
              <View style={[styles.typeBadge, { backgroundColor: `${badge.color}20` }]}>
                <Ionicons name={badge.icon} size={14} color={badge.color} />
                <Text style={[styles.typeBadgeText, { color: badge.color }]}>{badge.label}</Text>
              </View>
              <Text style={styles.clipDate}>{item.copiedAt}</Text>
              <TouchableOpacity onPress={() => togglePin(item.id)} style={styles.pinBtn}>
                <Ionicons
                  name={item.isPinned ? 'pin' : 'pin-outline'}
                  size={18}
                  color={item.isPinned ? '#f59e0b' : '#64748b'}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeClip(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>

            <Text style={styles.clipContent} numberOfLines={4}>
              {item.category === 'secret' && !item.isPinned ? '••••••••••••••••••••••••••••••••' : item.text}
            </Text>

            <View style={styles.clipFooter}>
              <Text style={styles.charCount}>{item.charCount} caractere</Text>
              <TouchableOpacity
                style={[styles.copyBtn, isCopied && styles.copyBtnDone]}
                onPress={() => handleCopy(item.id, item.text)}
              >
                <Ionicons name={isCopied ? 'checkmark' : 'copy-outline'} size={15} color="#ffffff" />
                <Text style={styles.copyBtnText}>{isCopied ? 'Copiat!' : 'Copiază din nou'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
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
    backgroundColor: '#102a20',
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
    padding: 14,
    marginBottom: 14,
  },
  cardTitle: { color: '#f3f4f6', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  textInput: {
    backgroundColor: '#1b2336',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    color: '#f3f4f6',
    padding: 10,
    fontSize: 13,
    minHeight: 60,
    marginBottom: 10,
  },
  addActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  addBtn: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  addBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#243049',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: { color: '#f3f4f6', flex: 1, fontSize: 13 },
  catChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  catChip: {
    backgroundColor: '#1b2336',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#374151',
  },
  catChipActive: { backgroundColor: '#10b981', borderColor: '#34d399' },
  catText: { color: '#cbd5e1', fontSize: 11 },
  catTextActive: { color: '#090d16', fontWeight: '800' },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listTitle: { color: '#f3f4f6', fontSize: 15, fontWeight: '700' },
  clearBtnText: { color: '#ef4444', fontSize: 12, fontWeight: '600' },
  clipCard: {
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#243049',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  clipCardPinned: { borderColor: '#f59e0b' },
  clipHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  typeBadgeText: { fontSize: 11, fontWeight: '700' },
  clipDate: { color: '#64748b', fontSize: 11, flex: 1 },
  pinBtn: { padding: 4 },
  deleteBtn: { padding: 4 },
  clipContent: { color: '#e2e8f0', fontSize: 13, lineHeight: 18, marginBottom: 10 },
  clipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#1e293b',
    paddingTop: 8,
  },
  charCount: { color: '#64748b', fontSize: 11 },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 4,
  },
  copyBtnDone: { backgroundColor: '#10b981' },
  copyBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
});
