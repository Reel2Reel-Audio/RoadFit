import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { getMealPlan, getSnackPlan, weekDays } from '../../src/data';
import { useRoadFit } from '../../src/RoadFitProvider';
import { AppText, Button, Card, Header, Pill, Screen, C } from '../../src/ui';

type PlannerTab = 'meals' | 'snacks';

const todayWeekday = () => weekDays[(new Date().getDay() + 6) % 7];

export default function Meals() {
  const [tab, setTab] = useState<PlannerTab>('meals');
  const [day, setDay] = useState(todayWeekday);
  const [draftDay, setDraftDay] = useState(todayWeekday);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [typeInput, setTypeInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [detailsInput, setDetailsInput] = useState('');
  const { data, toggleMeal, updateMeal, addMeal, deleteMeal, updateSnack, addSnack, deleteSnack } = useRoadFit();
  useEffect(() => {
    const currentDay = todayWeekday();
    setDay(currentDay);
    setDraftDay(currentDay);
  }, [data.lastActiveDate]);
  const allMeals = useMemo(
    () => getMealPlan(data.mealEdits, data.customMeals, data.deletedMealIds),
    [data.mealEdits, data.customMeals, data.deletedMealIds],
  );
  const meals = allMeals.filter(meal => meal.day === day);
  const snacks = useMemo(
    () => getSnackPlan(data.snackEdits, data.customSnacks, data.deletedSnackIds),
    [data.snackEdits, data.customSnacks, data.deletedSnackIds],
  );
  const fieldStyle = {
    color: C.text, backgroundColor: C.bg, borderColor: C.border, borderWidth: 1,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, marginTop: 9,
  } as const;
  const clearForm = () => {
    setEditingId(null);
    setAdding(false);
    setTypeInput('');
    setTitleInput('');
    setDetailsInput('');
  };
  const beginEditMeal = (meal: (typeof allMeals)[number]) => {
    setEditingId(meal.id);
    setDraftDay(meal.day);
    setTypeInput(meal.type);
    setTitleInput(meal.title);
    setDetailsInput(meal.details);
    setAdding(false);
  };
  const beginEditSnack = (snack: (typeof snacks)[number]) => {
    setEditingId(snack.id);
    setTypeInput('');
    setTitleInput(snack.title);
    setDetailsInput(snack.details);
    setAdding(false);
  };
  const saveMeal = (id?: string) => {
    if (!titleInput.trim()) {
      Alert.alert('Add a meal name', 'Enter a name for the meal before saving it.');
      return;
    }
    if (id) updateMeal(id, { day: draftDay, type: typeInput.trim() || 'Meal', title: titleInput.trim(), details: detailsInput.trim() });
    else addMeal(draftDay, typeInput, titleInput, detailsInput);
    clearForm();
  };
  const saveSnack = (id?: string) => {
    if (!titleInput.trim()) {
      Alert.alert('Add a snack name', 'Enter a name for the snack before saving it.');
      return;
    }
    if (id) updateSnack(id, { title: titleInput.trim(), details: detailsInput.trim() });
    else addSnack(titleInput, detailsInput);
    clearForm();
  };
  const confirmDelete = (label: string, onDelete: () => void) => Alert.alert(
    `Remove ${label}?`,
    'This item will be removed from your plan.',
    [{ text: 'Keep it', style: 'cancel' }, { text: 'Remove', style: 'destructive', onPress: onDelete }],
  );
  const tabButton = (value: PlannerTab, title: string, count: number) => (
    <Pressable
      key={value}
      accessibilityRole="tab"
      accessibilityState={{ selected: tab === value }}
      onPress={() => { setTab(value); clearForm(); }}
      style={{ flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', backgroundColor: tab === value ? C.green : 'transparent' }}
    >
      <Text style={{ color: tab === value ? C.bg : C.muted, fontWeight: '800', fontSize: 13 }}>{title} <Text style={{ opacity: 0.75 }}>· {count}</Text></Text>
    </Pressable>
  );
  const dayPicker = (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 3 }}>
      {weekDays.map(value => {
        const selected = value === day;
        return <Pressable key={value} onPress={() => { setDay(value); clearForm(); }} style={{ minWidth: 56, paddingHorizontal: 13, paddingVertical: 10, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: selected ? C.green : C.border, backgroundColor: selected ? '#15352F' : C.panel }}>
          <Text style={{ color: selected ? C.green : C.muted, fontSize: 12, fontWeight: '800' }}>{value.slice(0, 3)}</Text>
        </Pressable>;
      })}
    </ScrollView>
  );
  const form = (id?: string) => (
    <View style={{ paddingTop: 8 }}>
      {tab === 'meals' && <>
        <Text style={{ color: C.muted, fontSize: 11, fontWeight: '700', marginTop: 6 }}>DAY</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 8 }}>
          {weekDays.map(value => <Pressable key={value} onPress={() => setDraftDay(value)} style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 9, backgroundColor: draftDay === value ? '#15352F' : C.panel2, borderWidth: 1, borderColor: draftDay === value ? C.green : C.border }}>
            <Text style={{ color: draftDay === value ? C.green : C.muted, fontSize: 11, fontWeight: '700' }}>{value.slice(0, 3)}</Text>
          </Pressable>)}
        </ScrollView>
        <TextInput value={typeInput} onChangeText={setTypeInput} placeholder="Meal type (e.g. Lunch)" placeholderTextColor={C.muted} style={fieldStyle} />
      </>}
      <TextInput value={titleInput} onChangeText={setTitleInput} placeholder={tab === 'meals' ? 'Meal name' : 'Snack name'} placeholderTextColor={C.muted} style={fieldStyle} />
      <TextInput value={detailsInput} onChangeText={setDetailsInput} placeholder="Notes or details (optional)" placeholderTextColor={C.muted} multiline style={[fieldStyle, { minHeight: 78, textAlignVertical: 'top' }]} />
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <View style={{ flex: 1 }}><Button title={id ? 'Save changes' : `Add ${tab === 'meals' ? 'meal' : 'snack'}`} onPress={() => tab === 'meals' ? saveMeal(id) : saveSnack(id)} /></View>
        <View style={{ flex: 1 }}><Button title="Cancel" onPress={clearForm} secondary /></View>
      </View>
    </View>
  );

  return <Screen><ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 30 }}>
    <Header showBack eyebrow="FOOD THAT FITS YOUR ROUTE" title="Your food plan" subtitle="Make it yours. Add, edit or remove meals and snacks whenever your plans change." />
    <View accessibilityRole="tablist" style={{ flexDirection: 'row', padding: 4, borderRadius: 16, backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, marginBottom: 16 }}>
      {tabButton('meals', 'Meals', allMeals.length)}
      {tabButton('snacks', 'Snacks', snacks.length)}
    </View>

    {tab === 'meals' ? <>
      {dayPicker}
      <Card style={{ marginTop: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
          <View><Text style={{ color: C.text, fontSize: 19, fontWeight: '800' }}>{day}</Text><Text style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>A simple plan for your day</Text></View>
          <Pill>{meals.filter(meal => data.completedMeals.includes(meal.id)).length}/{meals.length} done</Pill>
        </View>
        {meals.length === 0 && !adding && <View style={{ paddingVertical: 22, alignItems: 'center' }}><Text style={{ color: C.text, fontSize: 15, fontWeight: '700' }}>Nothing planned yet</Text><Text style={{ color: C.muted, fontSize: 12, marginTop: 5 }}>Add a meal to get started.</Text></View>}
        {meals.map((meal, index) => <View key={meal.id} style={{ paddingTop: 13, paddingBottom: 11, borderTopColor: C.border, borderTopWidth: index === 0 ? 1 : 0.5, marginTop: 10 }}>
          {editingId === meal.id ? form(meal.id) : <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.green, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>{meal.type.toUpperCase()}</Text>
                <Text style={{ color: C.text, fontSize: 15, lineHeight: 21, fontWeight: '700', marginTop: 4 }}>{meal.title}</Text>
              </View>
              {data.completedMeals.includes(meal.id) && <Pill>Done</Pill>}
            </View>
            {!!meal.details && <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 5 }}>{meal.details}</Text>}
            <View style={{ flexDirection: 'row', gap: 7, marginTop: 11 }}>
              <View style={{ flex: 1 }}><Button title={data.completedMeals.includes(meal.id) ? 'Undo' : 'Mark done'} onPress={() => toggleMeal(meal.id)} secondary /></View>
              <View style={{ flex: 1 }}><Button title="Edit" onPress={() => beginEditMeal(meal)} secondary /></View>
              <View style={{ flex: 1 }}><Button title="Remove" onPress={() => confirmDelete('this meal', () => deleteMeal(meal.id))} secondary /></View>
            </View>
          </>}
        </View>)}
        {adding && form()}
        {!adding && !editingId && <View style={{ marginTop: 12 }}><Button title="+ Add a meal" onPress={() => { setDraftDay(day); setAdding(true); setTitleInput(''); setDetailsInput(''); setTypeInput(''); }} /></View>}
      </Card>
    </> : <>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <View><Text style={{ color: C.text, fontSize: 19, fontWeight: '800' }}>Road snack kit</Text><Text style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>Easy options for a safe break</Text></View>
          <Pill>{snacks.length} items</Pill>
        </View>
        {snacks.length === 0 && !adding && <Text style={{ color: C.muted, fontSize: 13, paddingVertical: 18 }}>Your snack list is empty. Add one below.</Text>}
        {snacks.map((snack, index) => <View key={snack.id} style={{ borderTopColor: C.border, borderTopWidth: 0.5, paddingTop: 13, paddingBottom: 12, marginTop: index === 0 ? 10 : 0 }}>
          {editingId === snack.id ? form(snack.id) : <>
            <Text style={{ color: C.text, fontSize: 15, fontWeight: '700' }}>{snack.title}</Text>
            {!!snack.details && <Text style={{ color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 4 }}>{snack.details}</Text>}
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <View style={{ flex: 1 }}><Button title="Edit snack" onPress={() => beginEditSnack(snack)} secondary /></View>
              <View style={{ flex: 1 }}><Button title="Remove" onPress={() => confirmDelete('this snack', () => deleteSnack(snack.id))} secondary /></View>
            </View>
          </>}
        </View>)}
        {adding && form()}
        {!adding && !editingId && <View style={{ marginTop: 12 }}><Button title="+ Add a snack" onPress={() => { setAdding(true); setTitleInput(''); setDetailsInput(''); }} /></View>}
      </Card>
      <Card style={{ borderColor: '#765B31' }}>
        <Text style={{ color: C.amber, fontWeight: '800', marginBottom: 5 }}>Keep chilled food safe</Text>
        <AppText style={{ color: C.muted, fontSize: 12 }}>Use an insulated cooler with frozen ice packs; keep perishable foods at 5°C or colder. Follow food-label storage instructions.</AppText>
      </Card>
    </>}
  </ScrollView></Screen>;
}
