import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useToolStore } from '../../src/stores/useToolStore';

export default function ToolsDirectoryScreen() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, favorites, getFilteredTools, toggleFavorite } = useToolStore();
  const filteredTools = getFilteredTools();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Instant Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cauta utilitar (ex: subnet, hash, valuta, nivel)..."
          placeholderTextColor="#6b7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Pinned Favorites Section */}
      <View style={styles.sectionHeader}>
        <Ionicons name="star" size={18} color="#f59e0b" />
        <Text style={styles.sectionTitle}>Favorite Fixate</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.favoritesRow}>
        {filteredTools
          .filter((t) => favorites.includes(t.id))
          .map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.favoriteCard}
              onPress={() => router.push(tool.route as any)}
            >
              <View style={styles.favIconBox}>
                <Ionicons name={tool.icon as any} size={24} color="#3b82f6" />
              </View>
              <Text style={styles.favTitle} numberOfLines={1}>
                {tool.name}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>

      {/* All Tools Grid */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Ionicons name="layers-outline" size={18} color="#10b981" />
        <Text style={styles.sectionTitle}>Toate Instrumentele ({filteredTools.length})</Text>
      </View>

      {filteredTools.map((tool) => (
        <TouchableOpacity
          key={tool.id}
          style={styles.toolRow}
          onPress={() => router.push(tool.route as any)}
        >
          <View style={styles.toolIconBox}>
            <Ionicons name={tool.icon as any} size={22} color="#3b82f6" />
          </View>
          <View style={styles.toolInfo}>
            <Text style={styles.toolName}>{tool.name}</Text>
            <Text style={styles.toolDesc} numberOfLines={2}>
              {tool.description}
            </Text>
          </View>
          <TouchableOpacity onPress={() => toggleFavorite(tool.id)} style={styles.starButton}>
            <Ionicons
              name={favorites.includes(tool.id) ? 'star' : 'star-outline'}
              size={22}
              color={favorites.includes(tool.id) ? '#f59e0b' : '#6b7280'}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121826',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#243049',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#f3f4f6', fontSize: 15 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { color: '#f3f4f6', fontSize: 16, fontWeight: '700' },
  favoritesRow: { flexDirection: 'row', marginBottom: 10 },
  favoriteCard: {
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#243049',
    borderRadius: 14,
    padding: 14,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
  },
  favIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  favTitle: { color: '#f3f4f6', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  toolIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toolInfo: { flex: 1 },
  toolName: { color: '#f3f4f6', fontSize: 15, fontWeight: '600', marginBottom: 2 },
  toolDesc: { color: '#9ca3af', fontSize: 12 },
  starButton: { padding: 6, marginLeft: 8 },
});
