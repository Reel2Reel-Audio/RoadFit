import { Tabs } from 'expo-router';
import { Text } from 'react-native';

const icon = (symbol: string) => ({ color }: { color: string }) => (
  <Text style={{ color, fontSize: 18 }}>{symbol}</Text>
);

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#111B2D', borderTopColor: '#25334A', height: 64, paddingTop: 7, paddingBottom: 7 },
      tabBarActiveTintColor: '#56D6B0',
      tabBarInactiveTintColor: '#8392A8',
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: icon('⌂') }} />
      <Tabs.Screen name="meals" options={{ title: 'Meals', tabBarIcon: icon('◷') }} />
      <Tabs.Screen name="workouts" options={{ title: 'Train', tabBarIcon: icon('↗') }} />
      <Tabs.Screen name="shopping" options={{ title: 'Shop', tabBarIcon: icon('✓') }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: icon('▥') }} />
    </Tabs>
  );
}
