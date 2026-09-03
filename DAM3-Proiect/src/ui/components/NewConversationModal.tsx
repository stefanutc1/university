import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';
import { useI18n } from '../../i18n/I18nContext';
import { MdnsDiscovery } from '../../network/MdnsDiscovery';

interface NewConversationModalProps {
  visible: boolean;
  onClose: () => void;
  onStartChat: (peerPubkey: string, peerName: string) => void;
  onOpenQrScanner: () => void;
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  visible,
  onClose,
  onStartChat,
  onOpenQrScanner,
}) => {
  const { t } = useI18n();
  const mdns = MdnsDiscovery.getInstance();

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [peerName, setPeerName] = useState('');
  const [peerKey, setPeerKey] = useState('');
  const [peerIp, setPeerIp] = useState('192.168.43.1');

  const nearbyPeers = mdns.getDiscoveredPeers();

  const handleStartManualKey = () => {
    const cleanKey = peerKey.trim().toLowerCase();
    if (!cleanKey || cleanKey.length < 16) {
      Alert.alert(t('cancel'), t('invalid_pk_error'));
      return;
    }
    const name = peerName.trim() || `Node-${cleanKey.substring(0, 6)}`;
    onStartChat(cleanKey, name);
    resetAndClose();
  };

  const handleStartDirectIp = () => {
    const ip = peerIp.trim();
    if (!ip) return;
    const name = peerName.trim() || `Host-${ip}`;
    const generatedKey = `ip_${ip.replace(/\./g, '_')}_` + Date.now().toString(16);
    onStartChat(generatedKey, name);
    resetAndClose();
  };

  const handleStartPublicBroadcast = () => {
    onStartChat('BROADCAST', 'Canal Public / Open Mesh');
    resetAndClose();
  };

  const resetAndClose = () => {
    setSelectedMethod(null);
    setPeerName('');
    setPeerKey('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={resetAndClose}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={Platform.OS === 'ios' ? 70 : 100} tint="dark" style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{t('new_chat_title')}</Text>
              <Text style={styles.subtitle}>{t('new_chat_subtitle')}</Text>
            </View>
            <TouchableOpacity onPress={resetAndClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Method 1: Nearby Radar */}
            <TouchableOpacity
              style={[
                styles.methodCard,
                selectedMethod === 'RADAR' && styles.methodCardActive,
              ]}
              onPress={() => setSelectedMethod(selectedMethod === 'RADAR' ? null : 'RADAR')}
            >
              <View style={styles.methodIconBox}>
                <Ionicons name="radio" size={24} color={theme.colors.accent} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{t('method_radar_title')}</Text>
                <Text style={styles.methodDesc}>{t('method_radar_desc')}</Text>
              </View>
              <Ionicons
                name={selectedMethod === 'RADAR' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>

            {selectedMethod === 'RADAR' && (
              <View style={styles.expandedContent}>
                {nearbyPeers.length === 0 ? (
                  <Text style={styles.emptyPeersText}>Niciun nod detectat momentan în proximitate.</Text>
                ) : (
                  nearbyPeers.map((p, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.peerSelectItem}
                      onPress={() => {
                        onStartChat(p.txt?.pk || `peer_${p.name}`, p.name);
                        resetAndClose();
                      }}
                    >
                      <View>
                        <Text style={styles.peerSelectName}>{p.name}</Text>
                        <Text style={styles.peerSelectMeta}>{p.ip}:{p.port}</Text>
                      </View>
                      <Text style={styles.peerSelectAction}>Conectează</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}

            {/* Method 2: Scan QR Code */}
            <TouchableOpacity
              style={styles.methodCard}
              onPress={() => {
                resetAndClose();
                onOpenQrScanner();
              }}
            >
              <View style={[styles.methodIconBox, { borderColor: '#8A2387' }]}>
                <Ionicons name="qr-code" size={24} color="#C471ED" />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{t('method_qr_title')}</Text>
                <Text style={styles.methodDesc}>{t('method_qr_desc')}</Text>
              </View>
              <Ionicons name="camera-outline" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            {/* Method 3: Manual Public Key */}
            <TouchableOpacity
              style={[
                styles.methodCard,
                selectedMethod === 'KEY' && styles.methodCardActive,
              ]}
              onPress={() => setSelectedMethod(selectedMethod === 'KEY' ? null : 'KEY')}
            >
              <View style={[styles.methodIconBox, { borderColor: theme.colors.success }]}>
                <Ionicons name="key" size={24} color={theme.colors.success} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{t('method_pk_title')}</Text>
                <Text style={styles.methodDesc}>{t('method_pk_desc')}</Text>
              </View>
              <Ionicons
                name={selectedMethod === 'KEY' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>

            {selectedMethod === 'KEY' && (
              <View style={styles.expandedContent}>
                <TextInput
                  style={styles.modalInput}
                  placeholder={t('enter_name')}
                  placeholderTextColor={theme.colors.textMuted}
                  value={peerName}
                  onChangeText={setPeerName}
                />
                <TextInput
                  style={[styles.modalInput, { minHeight: 60 }]}
                  placeholder={t('enter_pk')}
                  placeholderTextColor={theme.colors.textMuted}
                  value={peerKey}
                  onChangeText={setPeerKey}
                  multiline
                />
                <TouchableOpacity style={styles.primaryActionBtn} onPress={handleStartManualKey}>
                  <Text style={styles.primaryActionBtnText}>{t('start_chat_btn')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Method 4: Direct Local IP / Hotspot */}
            <TouchableOpacity
              style={[
                styles.methodCard,
                selectedMethod === 'IP' && styles.methodCardActive,
              ]}
              onPress={() => setSelectedMethod(selectedMethod === 'IP' ? null : 'IP')}
            >
              <View style={[styles.methodIconBox, { borderColor: '#F59E0B' }]}>
                <Ionicons name="wifi" size={24} color="#F59E0B" />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{t('method_ip_title')}</Text>
                <Text style={styles.methodDesc}>{t('method_ip_desc')}</Text>
              </View>
              <Ionicons
                name={selectedMethod === 'IP' ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>

            {selectedMethod === 'IP' && (
              <View style={styles.expandedContent}>
                <TextInput
                  style={styles.modalInput}
                  placeholder={t('enter_name')}
                  placeholderTextColor={theme.colors.textMuted}
                  value={peerName}
                  onChangeText={setPeerName}
                />
                <TextInput
                  style={styles.modalInput}
                  placeholder={t('enter_ip')}
                  placeholderTextColor={theme.colors.textMuted}
                  value={peerIp}
                  onChangeText={setPeerIp}
                />
                <TouchableOpacity style={styles.primaryActionBtn} onPress={handleStartDirectIp}>
                  <Text style={styles.primaryActionBtnText}>{t('start_chat_btn')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Method 5: Share Invite Link */}
            <TouchableOpacity
              style={styles.methodCard}
              onPress={() => {
                Alert.alert(
                  'mesh://connect',
                  'Link de invitație generat! Partajează acest link sau folosește-l pentru conectare:\nmesh://connect?node=MyDevice'
                );
              }}
            >
              <View style={[styles.methodIconBox, { borderColor: '#3B82F6' }]}>
                <Ionicons name="link" size={24} color="#60A5FA" />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{t('method_invite_title')}</Text>
                <Text style={styles.methodDesc}>{t('method_invite_desc')}</Text>
              </View>
              <Ionicons name="share-social-outline" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>

            {/* Method 6: Open Public Channel */}
            <TouchableOpacity
              style={[styles.methodCard, { borderColor: 'rgba(0, 230, 118, 0.3)' }]}
              onPress={handleStartPublicBroadcast}
            >
              <View style={[styles.methodIconBox, { borderColor: theme.colors.success }]}>
                <Ionicons name="megaphone" size={24} color={theme.colors.success} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{t('method_broadcast_title')}</Text>
                <Text style={styles.methodDesc}>{t('method_broadcast_desc')}</Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color={theme.colors.success} />
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 40,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(10, 15, 26, 0.94)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  scrollArea: {
    marginTop: 8,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(18, 26, 42, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 10,
  },
  methodCardActive: {
    borderColor: theme.colors.accent,
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
  },
  methodIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  methodDesc: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  expandedContent: {
    backgroundColor: 'rgba(13, 20, 32, 0.9)',
    borderRadius: 14,
    padding: 12,
    marginTop: -4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  modalInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 12,
    color: theme.colors.textPrimary,
    fontSize: 13,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  primaryActionBtn: {
    backgroundColor: theme.colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryActionBtnText: {
    color: '#050B14',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  emptyPeersText: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    padding: 6,
  },
  peerSelectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  peerSelectName: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  peerSelectMeta: {
    color: theme.colors.textMuted,
    fontSize: 10,
  },
  peerSelectAction: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
});
