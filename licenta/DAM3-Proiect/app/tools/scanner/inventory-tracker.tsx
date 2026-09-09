import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useInventoryStore, InventoryItem, AssetStatus } from '../../../src/stores/useInventoryStore';

export default function InventoryTrackerScreen() {
  const {
    items,
    addItem,
    deleteItem,
    updateQuantity,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    getItemByBarcode,
  } = useInventoryStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [catInput, setCatInput] = useState<any>('Homelab & Retelistica');
  const [qtyInput, setQtyInput] = useState('1');
  const [locInput, setLocInput] = useState('Bancul de Lucru');
  const [notesInput, setNotesInput] = useState('');
  const [scanResultHint, setScanResultHint] = useState('');

  const handleSimulateScan = () => {
    // Pick a mock or existing barcode
    const randomBarcodes = ['5949012345678', '5949098765432', '4001234567890', '7332543000000'];
    const chosen = randomBarcodes[Math.floor(Math.random() * randomBarcodes.length)];
    setBarcodeInput(chosen);
    const existing = getItemByBarcode(chosen);
    if (existing) {
      setScanResultHint(`Găsit în stoc: ${existing.name} (Cantitate: ${existing.quantity})`);
    } else {
      setScanResultHint(`Cod nou: ${chosen}. Poți completa detaliile.`);
    }
  };

  const handleSaveItem = () => {
    if (!nameInput.trim()) return;
    addItem({
      barcode: barcodeInput.trim() || `BC_${Date.now()}`,
      name: nameInput.trim(),
      category: catInput,
      quantity: parseInt(qtyInput) || 1,
      minStock: 1,
      location: locInput.trim() || 'General',
      status: 'in_stock',
      notes: notesInput.trim(),
    });
    setShowAddModal(false);
    setNameInput('');
    setBarcodeInput('');
    setNotesInput('');
    setScanResultHint('');
  };

  const statusMap: Record<AssetStatus, { label: string; color: string }> = {
    in_stock: { label: 'În Stoc', color: '#10b981' },
    low_stock: { label: 'Stoc Redus', color: '#f59e0b' },
    lent_out: { label: 'Împrumutat', color: '#3b82f6' },
    broken: { label: 'Defect', color: '#ef4444' },
  };

  const filteredItems = items.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchCat;
    return (
      matchCat &&
      (item.name.toLowerCase().includes(q) ||
        item.barcode.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q))
    );
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.iconCircle}>
          <Ionicons name="barcode-outline" size={28} color="#f59e0b" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Inventar & Scaner Coduri de Bare</Text>
          <Text style={styles.headerSubtitle}>Gestiune echipamente homelab, componente și scule din casă</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionCard}>
        <TouchableOpacity style={styles.primaryActionBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
          <Text style={styles.actionBtnText}>Adaugă Produs / Scanare Nouă</Text>
        </TouchableOpacity>
      </View>

      {/* Search & Filters */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Caută după nume, cod de bare sau locație..."
          placeholderTextColor="#6b7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.catChips}>
        {[
          { key: 'all', label: 'Toate' },
          { key: 'Homelab & Retelistica', label: 'Homelab' },
          { key: 'Componente Electronice', label: 'Componente' },
          { key: 'Scule & Unelte', label: 'Scule' },
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

      {/* Items list */}
      <Text style={styles.listTitle}>Produse în Inventar ({filteredItems.length})</Text>

      {filteredItems.map((item) => {
        const st = statusMap[item.status];
        return (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemBarcode}>Cod: {item.barcode}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${st.color}20` }]}>
                <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
              </View>
            </View>

            <View style={styles.itemDetails}>
              <Text style={styles.detailText}>📁 {item.category}</Text>
              <Text style={styles.detailText}>📍 {item.location}</Text>
            </View>

            {item.notes ? <Text style={styles.notesText}>💬 {item.notes}</Text> : null}

            <View style={styles.itemFooter}>
              <View style={styles.qtyControl}>
                <Text style={styles.qtyLabel}>Stoc:</Text>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => updateQuantity(item.id, -1)}
                >
                  <Ionicons name="remove" size={16} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.qtyVal}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => updateQuantity(item.id, 1)}
                >
                  <Ionicons name="add" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.delBtn}>
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* Add Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adăugare Articol în Inventar</Text>

            <TouchableOpacity style={styles.scanSimBtn} onPress={handleSimulateScan}>
              <Ionicons name="camera-outline" size={20} color="#3b82f6" />
              <Text style={styles.scanSimText}>Simulează Scanare Cod de Bare</Text>
            </TouchableOpacity>

            {scanResultHint ? <Text style={styles.scanHint}>{scanResultHint}</Text> : null}

            <Text style={styles.inputLabel}>Cod de Bare:</Text>
            <TextInput
              style={styles.modalInput}
              value={barcodeInput}
              onChangeText={setBarcodeInput}
              placeholder="ex: 5949012345678"
              placeholderTextColor="#64748b"
            />

            <Text style={styles.inputLabel}>Denumire Produs / Piesă:</Text>
            <TextInput
              style={styles.modalInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="ex: Ruter MikroTik hEX S"
              placeholderTextColor="#64748b"
            />

            <View style={styles.rowInputs}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.inputLabel}>Cantitate:</Text>
                <TextInput
                  style={styles.modalInput}
                  value={qtyInput}
                  onChangeText={setQtyInput}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 2 }}>
                <Text style={styles.inputLabel}>Locație Depozitare:</Text>
                <TextInput
                  style={styles.modalInput}
                  value={locInput}
                  onChangeText={setLocInput}
                  placeholder="ex: Rack Birou"
                  placeholderTextColor="#64748b"
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Observații:</Text>
            <TextInput
              style={styles.modalInput}
              value={notesInput}
              onChangeText={setNotesInput}
              placeholder="ex: Cumpărat pentru teste laborator"
              placeholderTextColor="#64748b"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelBtnText}>Anulează</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveItem}>
                <Text style={styles.saveBtnText}>Salvează Articol</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#382b15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#f3f4f6', fontSize: 18, fontWeight: '700' },
  headerSubtitle: { color: '#9ca3af', fontSize: 12, marginTop: 2 },
  actionCard: { marginBottom: 14 },
  primaryActionBtn: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
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
  catChipActive: { backgroundColor: '#f59e0b', borderColor: '#fbbf24' },
  catText: { color: '#cbd5e1', fontSize: 11 },
  catTextActive: { color: '#090d16', fontWeight: '800' },
  listTitle: { color: '#f3f4f6', fontSize: 15, fontWeight: '700', marginBottom: 10 },
  itemCard: {
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#243049',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { color: '#f3f4f6', fontSize: 15, fontWeight: '600', marginBottom: 2 },
  itemBarcode: { color: '#60a5fa', fontSize: 11, fontFamily: 'monospace' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '700' },
  itemDetails: { flexDirection: 'row', gap: 14, marginVertical: 8 },
  detailText: { color: '#9ca3af', fontSize: 12 },
  notesText: { color: '#cbd5e1', fontSize: 12, fontStyle: 'italic', marginBottom: 8 },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#1e293b',
    paddingTop: 8,
  },
  qtyControl: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyLabel: { color: '#9ca3af', fontSize: 12 },
  stepBtn: {
    backgroundColor: '#1e293b',
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyVal: { color: '#f3f4f6', fontSize: 14, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  delBtn: { padding: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#121826',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#243049',
  },
  modalTitle: { color: '#f3f4f6', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  scanSimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  scanSimText: { color: '#60a5fa', fontSize: 13, fontWeight: '600' },
  scanHint: { color: '#10b981', fontSize: 11, marginBottom: 8 },
  inputLabel: { color: '#9ca3af', fontSize: 11, fontWeight: '600', marginBottom: 4 },
  modalInput: {
    backgroundColor: '#1b2336',
    color: '#f3f4f6',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#374151',
    fontSize: 13,
    marginBottom: 10,
  },
  rowInputs: { flexDirection: 'row' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  cancelBtn: { paddingVertical: 8, paddingHorizontal: 14 },
  cancelBtnText: { color: '#9ca3af', fontSize: 13 },
  saveBtn: { backgroundColor: '#3b82f6', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  saveBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
});
