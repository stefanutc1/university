import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#121826' },
        headerTintColor: '#f3f4f6',
        tabBarStyle: {
          backgroundColor: '#121826',
          borderTopColor: '#243049',
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Panou',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          title: 'Retea',
          tabBarIcon: ({ color, size }) => <Ionicons name="wifi-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scanare',
          tabBarIcon: ({ color, size }) => <Ionicons name="camera-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Cheltuieli',
          tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: 'Utilitare',
          tabBarIcon: ({ color, size }) => <Ionicons name="apps-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Setari',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

// Expenses tab linked
