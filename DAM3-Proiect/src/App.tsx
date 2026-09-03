import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { I18nProvider, useI18n } from './i18n/I18nContext';
import { GlassTabBar } from './ui/components/GlassTabBar';

import { ConversationsScreen } from './ui/screens/Conversations';
import { ConversationDetailScreen } from './ui/screens/ConversationDetail';
import { NearbyPeersScreen } from './ui/screens/NearbyPeers';
import { MeshStatusScreen } from './ui/screens/MeshStatus';
import { SosScreen } from './ui/screens/Sos';
import { SettingsScreen } from './ui/screens/Settings';

import { FileTransfer } from './ui/screens/FileTransfer';
import { VoiceIntercom } from './ui/screens/VoiceIntercom';
import { IncidentMap } from './ui/screens/IncidentMap';
import { QrPairingScreen } from './ui/screens/QrPairing';
import { ClipboardSyncScreen } from './ui/screens/ClipboardSync';

import { BleMeshTransport } from './network/BleMeshTransport';
import { LocalPeerTransport } from './network/LocalPeerTransport';
import { EncryptedStorage } from './storage/EncryptedStorage';
import { theme } from './ui/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const NavigationDarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.textPrimary,
    border: theme.colors.surfaceBorder,
  },
};

function ChatStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: 'rgba(16, 22, 34, 0.95)' },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: { fontWeight: '800' },
      }}
    >
      <Stack.Screen
        name="ConversationsList"
        component={ConversationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConversationDetail"
        component={ConversationDetailScreen}
        options={({ route }: any) => ({
          title: route.params?.peerName || 'Chat',
        })}
      />
    </Stack.Navigator>
  );
}

function ToolsStack() {
  const { t } = useI18n();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: 'rgba(16, 22, 34, 0.95)' },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: { fontWeight: '800' },
      }}
    >
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QrPairing"
        component={QrPairingScreen}
        options={{ title: t('open_qr') }}
      />
      <Stack.Screen
        name="ClipboardSync"
        component={ClipboardSyncScreen}
        options={{ title: t('open_clip') }}
      />
      <Stack.Screen
        name="MeshStatus"
        component={MeshStatusScreen}
        options={{ title: t('open_diag') }}
      />
      <Stack.Screen
        name="Sos"
        component={SosScreen}
        options={{ title: t('open_sos') }}
      />
      <Stack.Screen
        name="NearbyPeers"
        component={NearbyPeersScreen}
        options={{ title: t('open_peers') }}
      />
    </Stack.Navigator>
  );
}

function MainNavigation() {
  return (
    <NavigationContainer theme={NavigationDarkTheme}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <Tab.Navigator
        tabBar={(props) => <GlassTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Chats" component={ChatStack} />
        <Tab.Screen name="AirDrop" component={FileTransfer} />
        <Tab.Screen name="Walkie" component={VoiceIntercom} />
        <Tab.Screen name="IncidentMap" component={IncidentMap} />
        <Tab.Screen name="Tools" component={ToolsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    // Pornire servicii offline locale
    const storage = EncryptedStorage.getInstance();
    storage.init();

    const ble = BleMeshTransport.getInstance();
    ble.start();

    const p2p = LocalPeerTransport.getInstance();
    p2p.start(false, 'MyPhone');

    return () => {
      ble.stop();
      p2p.stop();
    };
  }, []);

  return (
    <I18nProvider>
      <MainNavigation />
    </I18nProvider>
  );
}
