import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#090d16" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#121826' },
          headerTintColor: '#f3f4f6',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#090d16' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="tools/network/subnet-calc" options={{ title: 'Subnet / IP Calculator' }} />
        <Stack.Screen name="tools/network/dns-lookup" options={{ title: 'DNS Lookup Inspector' }} />
        <Stack.Screen name="tools/network/wifi-qr" options={{ title: 'Wi-Fi QR Generator' }} />
        <Stack.Screen name="tools/network/lan-scanner" options={{ title: 'Local LAN Host Scanner' }} />
        <Stack.Screen name="tools/scanner/camera-capture" options={{ title: 'Scanare Document' }} />
        <Stack.Screen name="tools/scanner/document-filter" options={{ title: 'Filtre Alb-Negru' }} />
        <Stack.Screen name="tools/scanner/pdf-compiler" options={{ title: 'Compilator PDF' }} />
        <Stack.Screen name="tools/converters/unit-converter" options={{ title: 'Convertor Unitati' }} />
        <Stack.Screen name="tools/converters/currency-converter" options={{ title: 'Convertor Valutar' }} />
        <Stack.Screen name="tools/converters/material-estimator" options={{ title: 'Estimator Materiale' }} />
        <Stack.Screen name="tools/expenses/group-detail" options={{ title: 'Detalii Grup Cheltuieli' }} />
        <Stack.Screen name="tools/expenses/new-expense" options={{ title: 'Adaugare Cheltuiala' }} />
        <Stack.Screen name="tools/expenses/debt-settlement" options={{ title: 'Simplificare Datorii' }} />
        <Stack.Screen name="tools/hardware/flashlight" options={{ title: 'Lanterna & Stroboscop' }} />
        <Stack.Screen name="tools/hardware/spirit-level" options={{ title: 'Nivela cu Bula' }} />
        <Stack.Screen name="tools/hardware/compass" options={{ title: 'Busola Digitala' }} />
        <Stack.Screen name="tools/hardware/password-gen" options={{ title: 'Generator Parole' }} />
        <Stack.Screen name="tools/dev/hash-generator" options={{ title: 'Generator Hash' }} />
        <Stack.Screen name="tools/dev/encoder-decoder" options={{ title: 'Encoder / Decoder' }} />
        <Stack.Screen name="tools/dev/jwt-decoder" options={{ title: 'Inspector Token JWT' }} />
        <Stack.Screen name="tools/dev/epoch-converter" options={{ title: 'Convertor Epoch Unix' }} />
        <Stack.Screen name="tools/network/speed-test" options={{ title: 'Speed Test & Latenta' }} />
        <Stack.Screen name="tools/hardware/voice-recorder" options={{ title: 'Inregistrator Voce' }} />
        <Stack.Screen name="tools/hardware/clipboard-manager" options={{ title: 'Istoric Clipboard' }} />
        <Stack.Screen name="tools/scanner/inventory-tracker" options={{ title: 'Inventar & Coduri Bare' }} />
        <Stack.Screen name="tools/dev/http-tester" options={{ title: 'Tester HTTP & API' }} />
        <Stack.Screen name="tools/converters/random-picker" options={{ title: 'Decident Aleatoriu' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
