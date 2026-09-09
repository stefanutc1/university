import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRandomPickerStore, PickerMode } from '../../../src/stores/useRandomPickerStore';

export default function RandomPickerScreen() {
  const {
    currentMode,
    setCurrentMode,
    diceSides,
    setDiceSides,
    diceCount,
    setDiceCount,
    diceResults,
    rollDice,
    listItemsText,
    setListItemsText,
    listWinner,
    pickFromList,
    coinResult,
    flipCoin,
    teamMembersText,
    setTeamMembersText,
    teamCount,
    setTeamCount,
    generatedTeams,
    generateTeams,
    history,
    clearHistory,
  } = useRandomPickerStore();

  const modes: { key: PickerMode; label: string; icon: any }[] = [
    { key: 'dice', label: 'Zaruri', icon: 'cube-outline' },
    { key: 'list', label: 'Listă / Roată', icon: 'list-outline' },
    { key: 'coin', label: 'Monedă', icon: 'cash-outline' },
    { key: 'teams', label: 'Echipe', icon: 'people-outline' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerBox}>
        <View style={styles.iconCircle}>
          <Ionicons name="shuffle-outline" size={28} color="#06b6d4" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Decident & Selector Aleatoriu</Text>
          <Text style={styles.headerSubtitle}>Zaruri virtuale, tragere la sorți, monedă și generator de echipe</Text>
        </View>
      </View>

      {/* Mode Selector Tabs */}
      <View style={styles.modeTabs}>
        {modes.map((m) => (
          <TouchableOpacity
            key={m.key}
            style={[styles.modeTab, currentMode === m.key && styles.modeTabActive]}
            onPress={() => setCurrentMode(m.key)}
          >
            <Ionicons
              name={m.icon}
              size={16}
              color={currentMode === m.key ? '#ffffff' : '#94a3b8'}
            />
            <Text style={[styles.modeTabText, currentMode === m.key && styles.modeTabTextActive]}>
              {m.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mode 1: Dice Roller */}
      {currentMode === 'dice' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Aruncare Zaruri Virtuale</Text>

          <View style={styles.diceConfigRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Număr Zaruri:</Text>
              <View style={styles.chipsRow}>
                {[1, 2, 3, 4].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.smallChip, diceCount === c && styles.smallChipActive]}
                    onPress={() => setDiceCount(c)}
                  >
                    <Text style={[styles.smallChipText, diceCount === c && styles.smallChipTextActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Tip Zar (Fețe):</Text>
              <View style={styles.chipsRow}>
                {[6, 12, 20, 100].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.smallChip, diceSides === s && styles.smallChipActive]}
                    onPress={() => setDiceSides(s)}
                  >
                    <Text style={[styles.smallChipText, diceSides === s && styles.smallChipTextActive]}>
                      d{s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Dice Results Display */}
          <View style={styles.diceResultsContainer}>
            {diceResults.map((r, i) => (
              <View key={i} style={styles.diceBox}>
                <Text style={styles.diceNumber}>{r}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sumText}>
            Total Sumă: {diceResults.reduce((a, b) => a + b, 0)}
          </Text>

          <TouchableOpacity style={styles.actionButton} onPress={rollDice}>
            <Ionicons name="dice-outline" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Dă cu Zarul ({diceCount}d{diceSides})</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mode 2: List / Wheel Picker */}
      {currentMode === 'list' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tragere la Sorți din Listă</Text>
          <Text style={styles.inputLabel}>Opțiuni (câte una pe rând):</Text>
          <TextInput
            style={styles.textArea}
            multiline
            value={listItemsText}
            onChangeText={setListItemsText}
            placeholder="Introduceți opțiunile..."
            placeholderTextColor="#64748b"
          />

          {listWinner ? (
            <View style={styles.winnerBox}>
              <Text style={styles.winnerLabel}>🎉 Câștigător Selectat:</Text>
              <Text style={styles.winnerText}>{listWinner}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.actionButton} onPress={pickFromList}>
            <Ionicons name="sparkles-outline" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Extrage o Opțiune Aleatorie</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mode 3: Coin Flip */}
      {currentMode === 'coin' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Aruncare Monedă (Cap sau Pajură)</Text>

          <View style={styles.coinCircle}>
            <Text style={styles.coinResultText}>{coinResult || '?'}</Text>
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={flipCoin}>
            <Ionicons name="radio-button-on-outline" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Aruncă Moneda</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mode 4: Teams Generator */}
      {currentMode === 'teams' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Împărțire Automată în Echipe</Text>
          <Text style={styles.inputLabel}>Nume Participanți (câte unul pe rând):</Text>
          <TextInput
            style={styles.textArea}
            multiline
            value={teamMembersText}
            onChangeText={setTeamMembersText}
            placeholder="Nume..."
            placeholderTextColor="#64748b"
          />

          <View style={{ marginVertical: 10 }}>
            <Text style={styles.inputLabel}>Număr Echipe Dorite:</Text>
            <View style={styles.chipsRow}>
              {[2, 3, 4, 5].map((tc) => (
                <TouchableOpacity
                  key={tc}
                  style={[styles.smallChip, teamCount === tc && styles.smallChipActive]}
                  onPress={() => setTeamCount(tc)}
                >
                  <Text style={[styles.smallChipText, teamCount === tc && styles.smallChipTextActive]}>
                    {tc} Echipe
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={generateTeams}>
            <Ionicons name="people-outline" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Generează Echipe Echilibrate</Text>
          </TouchableOpacity>

          {generatedTeams.length > 0 && (
            <View style={styles.teamsResultBox}>
              {generatedTeams.map((team) => (
                <View key={team.teamIndex} style={styles.teamCard}>
                  <Text style={styles.teamHeader}>Echipa #{team.teamIndex} ({team.members.length} membri)</Text>
                  <Text style={styles.teamMembers}>{team.members.join(', ')}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* History */}
      {history.length > 0 && (
        <View style={styles.card}>
          <View style={styles.histHeader}>
            <Text style={styles.cardTitle}>Ultimele Decizii ({history.length})</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearBtnText}>Șterge</Text>
            </TouchableOpacity>
          </View>
          {history.map((h) => (
            <View key={h.id} style={styles.histRow}>
              <Text style={styles.histTitleText}>{h.title}:</Text>
              <Text style={styles.histResultText}>{h.result}</Text>
            </View>
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
    backgroundColor: '#102e3b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#f3f4f6', fontSize: 18, fontWeight: '700' },
  headerSubtitle: { color: '#9ca3af', fontSize: 12, marginTop: 2 },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#121826',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#243049',
    gap: 4,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  modeTabActive: { backgroundColor: '#0891b2' },
  modeTabText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  modeTabTextActive: { color: '#ffffff', fontWeight: '700' },
  card: {
    backgroundColor: '#121826',
    borderWidth: 1,
    borderColor: '#243049',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: { color: '#f3f4f6', fontSize: 15, fontWeight: '700', marginBottom: 10 },
  diceConfigRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  inputLabel: { color: '#9ca3af', fontSize: 11, fontWeight: '600', marginBottom: 6 },
  chipsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  smallChip: {
    backgroundColor: '#1b2336',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#374151',
  },
  smallChipActive: { backgroundColor: '#0891b2', borderColor: '#22d3ee' },
  smallChipText: { color: '#cbd5e1', fontSize: 12, fontWeight: '600' },
  smallChipTextActive: { color: '#ffffff', fontWeight: '800' },
  diceResultsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 14,
  },
  diceBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#1b2336',
    borderWidth: 2,
    borderColor: '#06b6d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceNumber: { color: '#f3f4f6', fontSize: 26, fontWeight: '800' },
  sumText: { color: '#9ca3af', fontSize: 13, textAlign: 'center', marginBottom: 14 },
  actionButton: {
    backgroundColor: '#0891b2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  actionButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  textArea: {
    backgroundColor: '#1b2336',
    color: '#f3f4f6',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#374151',
    fontSize: 13,
    minHeight: 80,
    marginBottom: 12,
  },
  winnerBox: {
    backgroundColor: '#164e63',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#06b6d4',
  },
  winnerLabel: { color: '#a5f3fc', fontSize: 12, fontWeight: '600' },
  winnerText: { color: '#ffffff', fontSize: 18, fontWeight: '800', marginTop: 4 },
  coinCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#1b2336',
    borderWidth: 3,
    borderColor: '#eab308',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  coinResultText: { color: '#fef08a', fontSize: 22, fontWeight: '800' },
  teamsResultBox: { marginTop: 14, gap: 8 },
  teamCard: {
    backgroundColor: '#1b2336',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#06b6d4',
  },
  teamHeader: { color: '#38bdf8', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  teamMembers: { color: '#f3f4f6', fontSize: 12 },
  histHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  clearBtnText: { color: '#ef4444', fontSize: 11, fontWeight: '600' },
  histRow: { paddingVertical: 6, borderBottomWidth: 1, borderColor: '#1e293b' },
  histTitleText: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },
  histResultText: { color: '#e2e8f0', fontSize: 12, marginTop: 2 },
});
