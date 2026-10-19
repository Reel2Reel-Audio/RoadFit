import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { RoadFitProvider } from '../src/RoadFitProvider';

export default function RootLayout() {
  return (
    <RoadFitProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0B1220' } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </RoadFitProvider>
  );
}
