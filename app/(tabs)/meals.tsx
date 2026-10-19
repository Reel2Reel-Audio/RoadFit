import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import { getMealPlan, snacks, weekDays } from '../../src/data';
import { useRoadFit } from '../../src/RoadFitProvider';
import { AppText, Button, Card, Header, Pill, Screen, C } from '../../src/ui';

export default function Meals() {
  const [day, setDay] = useState('Monday');
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [addingMeal, setAddingMeal] = useState(false);
  const [typeInput, setTypeInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [detailsInput, setDetailsInput] = useState('');
  const { data, toggleMeal, updateMeal, addMeal, deleteMeal } = useRoadFit();
  const meals = useMemo(
    () => getMealPlan(data.mealEdits, data.customMeals, data.deletedMealIds).filter(m => m.day === day),
    [data.mealEdits, data.customMeals, data.deletedMealIds, day],
  );
  const fieldStyle = { color: C.text, backgroundColor: C.bg, borderColor: C.border, borderWidth: 1, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginTop: 7 } as const;
  const beginEdit = (meal: (typeof meals)[number]) => {
    setEditingMealId(meal.id);
    setTypeInput(meal.type);
    setTitleInput(meal.title);
    setDetailsInput(meal.details);
    setAddingMeal(false);
  };
  const saveEdit = (id: string) => {
    if (!titleInput.trim()) {
      Alert.alert('Add a meal name', 'Enter a name for the meal before saving it.');
      return;
    }
    updateMeal(id, { type: typeInput.trim() || 'Meal', title: titleInput.trim(), details: detailsInput.trim() });
    setEditingMealId(null);
  };
  const saveNewMeal = () => {
    if (!titleInput.trim()) {
      Alert.alert('Add a meal name', 'Enter a name for the meal before saving it.');
      return;
    }
    addMeal(day, typeInput, titleInput, detailsInput);
    setAddingMeal(false);
    setTypeInput('');
    setTitleInput('');
    setDetailsInput('');
  };
  const cancelEdit = () => {
    setEditingMealId(null);
    setAddingMeal(false);
  };
  return <Screen><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
    <Header showBack eyebrow="ROAD-FRIENDLY FOOD" title="Meal planner" subtitle="Edit the plan to suit you. Changes are saved on this device and sync with your account." />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14, maxHeight: 42 }}>
      <View style={{ flexDirection: 'row', gap: 7 }}>
        {weekDays.map(d => <Text key={d} onPress={() => setDay(d)} style={{ overflow: 'hidden', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: day === d ? C.bg : C.text, backgroundColor: day === d ? C.green : C.panel2, fontSize: 12, fontWeight: '800' }}>{d.slice(0,3)}</Text>)}
      </View>
    </ScrollView>
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}><Text style={{ color: C.text, fontSize: 18, fontWeight: '800' }}>{day}</Text><Pill>{meals.filter(m => data.completedMeals.includes(m.id)).length}/{meals.length} done</Pill></View>
      {meals.map(meal => <View key={meal.id} style={{ paddingVertical: 10, borderTopColor: C.border, borderTopWidth: 0.5 }}>
        {editingMealId === meal.id ? <>
          <TextInput value={typeInput} onChangeText={setTypeInput} placeholder="Meal type" placeholderTextColor={C.muted} style={fieldStyle} />
          <TextInput value={titleInput} onChangeText={setTitleInput} placeholder="Meal name" placeholderTextColor={C.muted} style={fieldStyle} />
          <TextInput value={detailsInput} onChangeText={setDetailsInput} placeholder="Notes / preparation" placeholderTextColor={C.muted} multiline style={[fieldStyle, { minHeight: 68, textAlignVertical: 'top' }]} />
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}><View style={{ flex: 1 }}><Button title="Save changes" onPress={() => saveEdit(meal.id)} /></View><View style={{ flex: 1 }}><Button title="Cancel" onPress={cancelEdit} secondary /></View></View>
        </> : <>
          <Text style={{ color: C.green, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>{meal.type.toUpperCase()}</Text>
          <Text style={{ color: C.text, fontSize: 13, fontWeight: '700', marginTop: 3 }}>{meal.title}</Text>
          {!!meal.details && <Text style={{ color: C.muted, fontSize: 11, lineHeight: 16, marginTop: 3 }}>{meal.details}</Text>}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 9 }}>
            <View style={{ flex: 1 }}><Button title={data.completedMeals.includes(meal.id) ? '✓ Done' : 'Mark done'} onPress={() => toggleMeal(meal.id)} secondary={data.completedMeals.includes(meal.id)} /></View>
            <View style={{ flex: 1 }}><Button title="Edit" onPress={() => beginEdit(meal)} secondary /></View>
            <View style={{ flex: 1 }}><Button title="Delete" onPress={() => Alert.alert('Delete this meal?', 'This removes the meal from your plan.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => deleteMeal(meal.id) }])} secondary /></View>
          </View>
        </>}
      </View>)}
      {addingMeal && <View style={{ borderTopColor: C.border, borderTopWidth: 0.5, paddingTop: 8 }}>
        <TextInput value={typeInput} onChangeText={setTypeInput} placeholder="Meal type (e.g. Lunch)" placeholderTextColor={C.muted} style={fieldStyle} />
        <TextInput value={titleInput} onChangeText={setTitleInput} placeholder="Meal name" placeholderTextColor={C.muted} style={fieldStyle} />
        <TextInput value={detailsInput} onChangeText={setDetailsInput} placeholder="Notes / preparation (optional)" placeholderTextColor={C.muted} multiline style={[fieldStyle, { minHeight: 68, textAlignVertical: 'top' }]} />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}><View style={{ flex: 1 }}><Button title="Add meal" onPress={saveNewMeal} /></View><View style={{ flex: 1 }}><Button title="Cancel" onPress={cancelEdit} secondary /></View></View>
      </View>}
      {!addingMeal && !editingMealId && <View style={{ marginTop: 12 }}><Button title={`+ Add meal to ${day}`} onPress={() => { setTypeInput(''); setTitleInput(''); setDetailsInput(''); setAddingMeal(true); }} /></View>}
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
