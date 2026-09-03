import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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

function ChatStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' },
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
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' },
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
        options={{ title: 'Pairing QR' }}
      />
      <Stack.Screen
        name="ClipboardSync"
        component={ClipboardSyncScreen}
        options={{ title: 'Clipboard Sync' }}
      />
      <Stack.Screen
        name="MeshStatus"
        component={MeshStatusScreen}
        options={{ title: 'Diagnoza Mesh' }}
      />
      <Stack.Screen
        name="Sos"
        component={SosScreen}
        options={{ title: 'Urgenta SOS' }}
      />
      <Stack.Screen
        name="NearbyPeers"
        component={NearbyPeersScreen}
        options={{ title: 'Noduri Vecine' }}
      />
    </Stack.Navigator>
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
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.surfaceBorder,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: theme.colors.textPrimary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Chats"
          component={ChatStack}
          options={{ tabBarLabel: 'Mesaje' }}
        />
        <Tab.Screen
          name="AirDrop"
          component={FileTransfer}
          options={{ tabBarLabel: 'AirDrop' }}
        />
        <Tab.Screen
          name="Walkie"
          component={VoiceIntercom}
          options={{ tabBarLabel: 'Intercom' }}
        />
        <Tab.Screen
          name="IncidentMap"
          component={IncidentMap}
          options={{ tabBarLabel: 'Harta' }}
        />
        <Tab.Screen
          name="Tools"
          component={ToolsStack}
          options={{ tabBarLabel: 'Utilitare' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
