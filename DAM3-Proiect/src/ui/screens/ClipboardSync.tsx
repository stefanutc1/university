import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Switch,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { ClipboardSync, ClipboardItem } from '../../features/ClipboardSync';
import { theme } from '../theme';

export const ClipboardSyncScreen: React.FC = () => {
  const clipSync = ClipboardSync.getInstance();

  const [textToPush, setTextToPush] = useState('');
  const [autoSync, setAutoSync] = useState(clipSync.getAutoSync());
  const [history, setHistory] = useState<ClipboardItem[]>(clipSync.getHistory());

  useEffect(() => {
    const unsubscribe = clipSync.onSync(() => {
      setHistory([...clipSync.getHistory()]);
    });
    return unsubscribe;
  }, []);

  const handlePush = () => {
    if (!textToPush.trim()) return;
    clipSync.pushClipboard(textToPush.trim(), 'Telefonul Meu');
    setTextToPush('');
    setHistory([...clipSync.getHistory()]);
    Alert.alert('Sincronizat', 'Textul a fost trimis tuturor dispozitivelor din reteaua Wi-Fi.');
  };

  const handleToggleAutoSync = (val: boolean) => {
    setAutoSync(val);
    clipSync.setAutoSync(val);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Clipboard Sync Local</Text>
        <Text style={styles.subtitle}>Sincronizare instanta pe retea locala intre telefoane si laptopuri</Text>
      </View>

      <View style={styles.toggleCard}>
        <View>
          <Text style={styles.toggleTitle}>Sincronizare Automata</Text>
          <Text style={styles.toggleDesc}>Trimite automat la copierea in clipboard</Text>
        </View>
        <Switch
          value={autoSync}
          onValueChange={handleToggleAutoSync}
          trackColor={{ false: theme.colors.surfaceBorder, true: theme.colors.success }}
        />
      </View>

      <View style={styles.pushSection}>
        <TextInput
          style={styles.input}
          value={textToPush}
          onChangeText={setTextToPush}
          placeholder="Scrie sau lipeste text pentru sync..."
          placeholderTextColor={theme.colors.textSecondary}
          multiline
        />
        <TouchableOpacity style={styles.pushButton} onPress={handlePush}>
          <Text style={styles.pushButtonText}>Distribuie Text in Retea</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>ISTORIC CLIPBOARD RECENT</Text>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>Niciun text sincronizat inca pe reteaua locala.</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemSender}>{item.senderName}</Text>
                  <Text style={styles.itemTime}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Text style={styles.itemText} selectable>
                  {item.text}
                </Text>
              </View>
            )}
          />
        )}
      </View>
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
  toggleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
  },
  toggleTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleDesc: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  pushSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    color: theme.colors.textPrimary,
    minHeight: 60,
    fontSize: 13,
  },
  pushButton: {
    backgroundColor: theme.colors.accentDark,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.sm,
  },
  pushButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  historySection: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  historyTitle: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamilyMono,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    fontSize: 12,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  historyItem: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemSender: {
    color: theme.colors.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  itemTime: {
    color: theme.colors.textSecondary,
    fontSize: 10,
  },
  itemText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    lineHeight: 18,
  },
});
