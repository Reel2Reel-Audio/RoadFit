import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useRoadFit } from '../../src/RoadFitProvider';
import { getMealPlan, getWorkouts } from '../../src/data';
import { AppText, Button, Card, Header, Pill, Screen, SmallLabel, C } from '../../src/ui';

export default function Dashboard() {
  const { data, toggleWorkout, toggleMeal, addWater, removeWater } = useRoadFit();
  const router = useRouter();
  const latest = data.weightEntries[data.weightEntries.length - 1]?.weight;
  const lost = data.startingWeight && latest ? Math.max(0, data.startingWeight - latest) : 0;
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = dayNames[new Date().getDay()];
  const todaysWorkout = getWorkouts(data.workoutEdits, data.customWorkouts, data.deletedWorkoutIds).find(w => w.day === today);
  const todaysMeals = getMealPlan(data.mealEdits, data.customMeals, data.deletedMealIds).filter(m => m.day === today);
  const completedWorkoutCount = data.completedWorkouts.length;
  return <Screen><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
    <Header eyebrow="ROADFIT • YOUR CAB, YOUR PLAN" title="Ready for today?" subtitle="Small, consistent choices add up. Plan your break, then drive safely." />
    <Card style={{ backgroundColor: '#15352F', borderColor: '#28584F' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <SmallLabel>YOUR GOAL</SmallLabel>
          <Text style={{ color: C.text, fontSize: 24, fontWeight: '800' }}>−20 kg</Text>
          <AppText style={{ color: '#B4DAD0', fontSize: 12 }}>Long-term goal • steady progress</AppText>
        </View>
        <Pill color={C.green}>{latest ? `${latest.toFixed(1)} kg` : 'Add weight'}</Pill>
      </View>
      <View style={{ height: 1, backgroundColor: '#28584F', marginVertical: 14 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View><Text style={{ color: '#B4DAD0', fontSize: 11 }}>Starting weight</Text><Text style={{ color: C.text, fontWeight: '800', fontSize: 16 }}>{data.startingWeight ? `${data.startingWeight} kg` : '—'}</Text></View>
        <View><Text style={{ color: '#B4DAD0', fontSize: 11 }}>Change so far</Text><Text style={{ color: C.text, fontWeight: '800', fontSize: 16 }}>{data.startingWeight && latest ? `${lost.toFixed(1)} kg` : '—'}</Text></View>
      </View>
      <View style={{ marginTop: 14 }}><Button title="Log weight →" onPress={() => router.push('/progress')} /></View>
    </Card>
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Card style={{ flex: 1 }}>
        <SmallLabel>WORKOUTS</SmallLabel><Text style={{ color: C.text, fontSize: 23, fontWeight: '800' }}>{completedWorkoutCount}</Text><AppText style={{ color: C.muted, fontSize: 11 }}>sessions completed</AppText>
      </Card>
      <Card style={{ flex: 1 }}>
        <SmallLabel>WATER</SmallLabel><Text style={{ color: C.text, fontSize: 23, fontWeight: '800' }}>{data.waterLitres.toFixed(2)}<Text style={{ color: C.muted, fontSize: 13 }}> L</Text></Text><View style={{ flexDirection: 'row', gap: 6 }}><View style={{ flex: 1 }}><Button title="− 250 ml" onPress={removeWater} secondary disabled={data.waterLitres < 0.25} /></View><View style={{ flex: 1 }}><Button title="+ 250 ml" onPress={addWater} secondary /></View></View>
      </Card>
    </View>
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <SmallLabel>{today.toUpperCase()} PLAN PREVIEW</SmallLabel><Pill color={C.blue}>{todaysWorkout?.duration ?? 'Rest day'}</Pill>
      </View>
      <Text style={{ color: C.text, fontSize: 17, fontWeight: '800', marginBottom: 5 }}>{todaysWorkout?.title ?? 'Recovery day'}</Text>
      <AppText style={{ color: C.muted, fontSize: 12 }}>{todaysWorkout?.details ?? 'Rest, hydrate and prepare for your next session. An optional gentle walk is fine if you feel good.'}</AppText>
      <View style={{ marginTop: 12 }}><Button title="View workouts" onPress={() => router.push('/workouts')} secondary /></View>
    </Card>
    <Card>
      <SmallLabel>MEAL CHECKLIST • {today.toUpperCase()}</SmallLabel>
      {todaysMeals.map(m => <View key={m.id} style={{ marginBottom: 2 }}><Text style={{ color: C.green, fontSize: 10, fontWeight: '800', marginTop: 7 }}>{m.type.toUpperCase()}</Text><Text style={{ color: C.text, fontSize: 13, fontWeight: '700', marginTop: 2 }}>{m.title}</Text><Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{m.details}</Text><View style={{ alignSelf: 'flex-start', marginTop: 7 }}><Button title={data.completedMeals.includes(m.id) ? '✓ Done' : 'Mark done'} onPress={() => toggleMeal(m.id)} secondary /></View></View>)}
      <View style={{ marginTop: 12 }}><Button title="Open meal planner" onPress={() => router.push('/meals')} /></View>
    </Card>
    <AppText style={{ color: C.muted, fontSize: 10, textAlign: 'center' }}>Eat during safe breaks, never while driving. Keep perishable food cold.</AppText>
  </ScrollView></Screen>;
}
