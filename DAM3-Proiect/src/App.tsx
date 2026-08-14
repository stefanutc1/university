import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ConversationsScreen } from './ui/screens/ConversationsScreen';
import { ConversationDetailScreen } from './ui/screens/ConversationDetailScreen';
import { NearbyPeersScreen } from './ui/screens/NearbyPeersScreen';
import { MeshStatusScreen } from './ui/screens/MeshStatusScreen';
import { SosScreen } from './ui/screens/SosScreen';
import { SettingsScreen } from './ui/screens/SettingsScreen';

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

export default function App() {
  useEffect(() => {
    // Bootstrap offline services
    const storage = EncryptedStorage.getInstance();
    storage.init();

    const ble = BleMeshTransport.getInstance();
    ble.start();

    const p2p = LocalPeerTransport.getInstance();
    p2p.start();

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
          options={{ tabBarLabel: 'Chats' }}
        />
        <Tab.Screen
          name="Peers"
          component={NearbyPeersScreen}
          options={{ tabBarLabel: 'Peers' }}
        />
        <Tab.Screen
          name="Mesh"
          component={MeshStatusScreen}
          options={{ tabBarLabel: 'Mesh' }}
        />
        <Tab.Screen
          name="SOS"
          component={SosScreen}
          options={{
            tabBarLabel: 'SOS',
            tabBarActiveTintColor: theme.colors.sosEmergency,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ tabBarLabel: 'Settings' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
