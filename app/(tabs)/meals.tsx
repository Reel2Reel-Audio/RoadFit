import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { mealPlan, snacks, weekDays } from '../../src/data';
import { useRoadFit } from '../../src/RoadFitProvider';
import { AppText, Card, CheckRow, Header, Pill, Screen, C } from '../../src/ui';

export default function Meals() {
  const [day, setDay] = useState('Monday');
  const { data, toggleMeal } = useRoadFit();
  const meals = useMemo(() => mealPlan.filter(m => m.day === day), [day]);
  return <Screen><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
    <Header showBack eyebrow="ROAD-FRIENDLY FOOD" title="Meal planner" subtitle="Designed for a cooler or fridge. No microwave required; pack food safely and eat at a rest stop." />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14, maxHeight: 42 }}>
      <View style={{ flexDirection: 'row', gap: 7 }}>
        {weekDays.map(d => <Text key={d} onPress={() => setDay(d)} style={{ overflow: 'hidden', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: day === d ? C.bg : C.text, backgroundColor: day === d ? C.green : C.panel2, fontSize: 12, fontWeight: '800' }}>{d.slice(0,3)}</Text>)}
      </View>
    </ScrollView>
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}><Text style={{ color: C.text, fontSize: 18, fontWeight: '800' }}>{day}</Text><Pill>{meals.filter(m => data.completedMeals.includes(m.id)).length}/{meals.length} done</Pill></View>
      {meals.map(m => <CheckRow key={m.id} title={`${m.type}: ${m.title}`} subtitle={m.details} checked={data.completedMeals.includes(m.id)} onPress={() => toggleMeal(m.id)} />)}
    </Card>
    <Card>
      <Text style={{ color: C.text, fontSize: 16, fontWeight: '800', marginBottom: 5 }}>Road snack kit</Text>
      <AppText style={{ color: C.muted, fontSize: 12, marginBottom: 8 }}>Choose snacks when hungry; keep chilled items cold.</AppText>
      {snacks.map(sn => <View key={sn.id} style={{ paddingVertical: 9, borderBottomColor: C.border, borderBottomWidth: 0.5 }}><Text style={{ color: C.text, fontSize: 13, fontWeight: '700' }}>{sn.title}</Text><Text style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>{sn.details}</Text></View>)}
    </Card>
    <Card style={{ borderColor: '#765B31' }}>
      <Text style={{ color: C.amber, fontWeight: '800', marginBottom: 5 }}>Food safety reminder</Text>
      <AppText style={{ color: C.muted, fontSize: 12 }}>Use an insulated cooler with frozen ice packs; keep perishable foods at 5°C or colder. If you cannot keep food cold, choose shelf-stable items until you can refrigerate them. Follow food label storage instructions.</AppText>
    </Card>
  </ScrollView></Screen>;
}
