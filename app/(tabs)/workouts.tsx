import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { getWorkouts, weekDays, type Exercise, type Workout } from '../../src/data';
import { useRoadFit } from '../../src/RoadFitProvider';
import { AppText, Button, Card, CheckRow, Header, Pill, Screen, C } from '../../src/ui';

type WorkoutDraft = Omit<Workout, 'id'>;
const emptyDraft = (day = 'Monday'): WorkoutDraft => ({
  day, title: '', kind: 'strength', duration: '', details: '', exercises: [{ name: '', dose: '', cue: '' }],
});
const todayWeekday = () => weekDays[(new Date().getDay() + 6) % 7];

export default function Workouts() {
  const { data, toggleWorkout, toggleWorkoutActivity, updateWorkout, addWorkout, deleteWorkout } = useRoadFit();
  const [selectedDay, setSelectedDay] = useState(todayWeekday);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<WorkoutDraft>(emptyDraft());
  useEffect(() => setSelectedDay(todayWeekday()), [data.lastActiveDate]);
  const workouts = useMemo(
    () => getWorkouts(data.workoutEdits, data.customWorkouts, data.deletedWorkoutIds),
    [data.workoutEdits, data.customWorkouts, data.deletedWorkoutIds],
  );
  const visibleWorkouts = selectedDay === 'All' ? workouts : workouts.filter(workout => workout.day === selectedDay);
  const fieldStyle = {
    color: C.text, backgroundColor: C.bg, borderColor: C.border, borderWidth: 1,
    borderRadius: 12, paddingHorizontal: 13, paddingVertical: 11, fontSize: 14, marginTop: 8,
  } as const;
  const closeEditor = () => {
    setEditingId(null);
    setAdding(false);
  };
  const editWorkout = (workout: Workout) => {
    setDraft({ ...workout, exercises: workout.exercises.map(exercise => ({ ...exercise })) });
    setEditingId(workout.id);
    setAdding(false);
  };
  const beginAdd = () => {
    setDraft(emptyDraft(selectedDay === 'All' ? 'Monday' : selectedDay));
    setEditingId(null);
    setAdding(true);
  };
  const updateDraft = (updates: Partial<WorkoutDraft>) => setDraft(current => ({ ...current, ...updates }));
  const updateExercise = (index: number, updates: Partial<Exercise>) => updateDraft({
    exercises: draft.exercises.map((exercise, i) => i === index ? { ...exercise, ...updates } : exercise),
  });
  const removeExercise = (index: number) => updateDraft({ exercises: draft.exercises.filter((_, i) => i !== index) });
  const save = () => {
    if (!draft.title.trim()) {
      Alert.alert('Add a workout name', 'Enter a name for your workout before saving it.');
      return;
    }
    const exercises = draft.exercises
      .map(exercise => ({ name: exercise.name.trim(), dose: exercise.dose.trim(), cue: exercise.cue.trim() }))
      .filter(exercise => exercise.name);
    if (exercises.length === 0) {
      Alert.alert('Add an activity', 'A workout needs at least one named activity.');
      return;
    }
    const cleanDraft = { ...draft, title: draft.title.trim(), duration: draft.duration.trim() || 'Custom session', details: draft.details.trim(), exercises };
    if (editingId) updateWorkout(editingId, cleanDraft);
    else addWorkout(cleanDraft.day, cleanDraft.title, cleanDraft.duration, cleanDraft.details, cleanDraft.kind, cleanDraft.exercises);
    closeEditor();
  };
  const deleteWorkoutConfirm = (workout: Workout) => Alert.alert(
    'Remove this workout?',
    `"${workout.title}" and its completion history will be removed.`,
    [{ text: 'Keep workout', style: 'cancel' }, { text: 'Remove', style: 'destructive', onPress: () => deleteWorkout(workout.id) }],
  );
  const editor = (
    <Card style={{ borderColor: C.green, borderWidth: 1.5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View><Text style={{ color: C.text, fontSize: 18, fontWeight: '800' }}>{editingId ? 'Edit workout' : 'New workout'}</Text><Text style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>Update the plan and its activities</Text></View>
        <Pressable onPress={closeEditor} accessibilityRole="button" accessibilityLabel="Close editor" hitSlop={10}><Text style={{ color: C.muted, fontSize: 23, paddingHorizontal: 5 }}>×</Text></Pressable>
      </View>

      <Text style={{ color: C.muted, fontSize: 11, fontWeight: '800', marginTop: 15 }}>DAY</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7, paddingVertical: 8 }}>
        {weekDays.map(day => <Pressable key={day} onPress={() => updateDraft({ day })} style={{ paddingHorizontal: 11, paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: draft.day === day ? C.green : C.border, backgroundColor: draft.day === day ? '#15352F' : C.panel2 }}>
          <Text style={{ color: draft.day === day ? C.green : C.muted, fontSize: 11, fontWeight: '700' }}>{day.slice(0, 3)}</Text>
        </Pressable>)}
      </ScrollView>
      <TextInput value={draft.title} onChangeText={title => updateDraft({ title })} placeholder="Workout name" placeholderTextColor={C.muted} style={fieldStyle} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['strength', 'pool'] as const).map(kind => <Pressable key={kind} onPress={() => updateDraft({ kind })} style={{ flex: 1, alignItems: 'center', borderRadius: 11, padding: 11, marginTop: 8, backgroundColor: draft.kind === kind ? '#15352F' : C.panel2, borderWidth: 1, borderColor: draft.kind === kind ? C.green : C.border }}>
          <Text style={{ color: draft.kind === kind ? C.green : C.muted, fontSize: 12, fontWeight: '800' }}>{kind === 'pool' ? 'Pool / cardio' : 'Strength'}</Text>
        </Pressable>)}
      </View>
      <TextInput value={draft.duration} onChangeText={duration => updateDraft({ duration })} placeholder="Duration (e.g. 30 minutes)" placeholderTextColor={C.muted} style={fieldStyle} />
      <TextInput value={draft.details} onChangeText={details => updateDraft({ details })} placeholder="Workout notes (optional)" placeholderTextColor={C.muted} multiline style={[fieldStyle, { minHeight: 66, textAlignVertical: 'top' }]} />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 17, marginBottom: 2 }}>
        <Text style={{ color: C.text, fontSize: 15, fontWeight: '800' }}>Activities</Text>
        <Pill>{draft.exercises.filter(exercise => exercise.name.trim()).length} added</Pill>
      </View>
      <AppText style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>Add the activity name, target and a helpful cue.</AppText>
      {draft.exercises.map((exercise, index) => <View key={index} style={{ padding: 11, marginTop: 10, borderRadius: 13, backgroundColor: C.panel2, borderWidth: 1, borderColor: C.border }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: C.green, fontSize: 11, fontWeight: '800' }}>ACTIVITY {index + 1}</Text>
          <Pressable onPress={() => removeExercise(index)} accessibilityRole="button" accessibilityLabel={`Remove activity ${index + 1}`} hitSlop={8}>
            <Text style={{ color: C.red, fontSize: 12, fontWeight: '700' }}>Remove</Text>
          </Pressable>
        </View>
        <TextInput value={exercise.name} onChangeText={name => updateExercise(index, { name })} placeholder="Activity name" placeholderTextColor={C.muted} style={fieldStyle} />
        <TextInput value={exercise.dose} onChangeText={dose => updateExercise(index, { dose })} placeholder="Target (e.g. 3 × 10)" placeholderTextColor={C.muted} style={fieldStyle} />
        <TextInput value={exercise.cue} onChangeText={cue => updateExercise(index, { cue })} placeholder="Tip or cue (optional)" placeholderTextColor={C.muted} style={fieldStyle} />
      </View>)}
      <View style={{ marginTop: 10 }}><Button title="+ Add activity" onPress={() => updateDraft({ exercises: [...draft.exercises, { name: '', dose: '', cue: '' }] })} secondary /></View>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <View style={{ flex: 1 }}><Button title={editingId ? 'Save changes' : 'Add workout'} onPress={save} /></View>
        <View style={{ flex: 1 }}><Button title="Cancel" onPress={closeEditor} secondary /></View>
      </View>
    </Card>
  );

  return <Screen><ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 30 }}>
    <Header showBack eyebrow="MOVE AT YOUR PACE" title="Your workouts" subtitle="Shape the weekly plan around you. Edit a session, adjust its activities, then track each one as you go." />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }}>
      <View><Text style={{ color: C.text, fontSize: 16, fontWeight: '800' }}>Weekly plan</Text><Text style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>Tap a day to filter sessions</Text></View>
      <Pill color={C.blue}>{data.completedWorkouts.length} complete</Pill>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7, paddingBottom: 3 }}>
      {['All', ...weekDays].map(day => <Pressable key={day} onPress={() => setSelectedDay(day)} style={{ minWidth: day === 'All' ? 54 : 57, paddingHorizontal: 11, paddingVertical: 10, alignItems: 'center', borderRadius: 11, borderWidth: 1, borderColor: selectedDay === day ? C.green : C.border, backgroundColor: selectedDay === day ? '#15352F' : C.panel }}>
        <Text style={{ color: selectedDay === day ? C.green : C.muted, fontSize: 11, fontWeight: '800' }}>{day === 'All' ? 'All' : day.slice(0, 3)}</Text>
      </Pressable>)}
    </ScrollView>
    <View style={{ marginTop: 14, marginBottom: 4 }}>
      {adding && editor}
      {!adding && !editingId && <Button title="+ Build a workout" onPress={beginAdd} />}
    </View>
    {visibleWorkouts.length === 0 && !adding && <Card><Text style={{ color: C.text, fontSize: 15, fontWeight: '800' }}>No workout planned for {selectedDay}</Text><Text style={{ color: C.muted, fontSize: 12, marginTop: 5 }}>Add a session whenever you are ready.</Text></Card>}
    {visibleWorkouts.map(workout => {
      if (editingId === workout.id) return <React.Fragment key={workout.id}>{editor}</React.Fragment>;
      const completedActivities = data.workoutActivities[workout.id] ?? [];
      const allActivitiesDone = workout.exercises.length > 0 && workout.exercises.every((_, index) => completedActivities.includes(String(index)));
      const done = data.completedWorkouts.includes(workout.id);
      return <Card key={workout.id}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.green, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>{workout.day.toUpperCase()} · {workout.kind === 'pool' ? 'POOL / CARDIO' : 'STRENGTH'}</Text>
            <Text style={{ color: C.text, fontSize: 17, lineHeight: 22, fontWeight: '800', marginTop: 4 }}>{workout.title}</Text>
          </View>
          <Pill color={workout.kind === 'pool' ? C.blue : C.green}>{workout.duration}</Pill>
        </View>
        {!!workout.details && <AppText style={{ color: C.muted, fontSize: 12, marginTop: 7 }}>{workout.details}</AppText>}
        <View style={{ marginTop: 8, marginBottom: 3 }}>
          {workout.exercises.map((exercise, index) => <View key={`${workout.id}-${index}`}>
            <CheckRow
              title={exercise.name}
              subtitle={[exercise.dose, exercise.cue].filter(Boolean).join(' · ')}
              checked={completedActivities.includes(String(index))}
              onPress={() => toggleWorkoutActivity(workout.id, String(index))}
            />
          </View>)}
        </View>
        <Button title={done ? '✓ Workout completed' : allActivitiesDone ? 'Complete workout' : `Complete all ${workout.exercises.length} activities to finish`} onPress={() => toggleWorkout(workout.id)} secondary disabled={!allActivitiesDone && !done} />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 9 }}>
          <View style={{ flex: 1 }}><Button title="Edit plan" onPress={() => editWorkout(workout)} secondary /></View>
          <View style={{ flex: 1 }}><Button title="Remove" onPress={() => deleteWorkoutConfirm(workout)} secondary /></View>
        </View>
      </Card>;
    })}
    <Card style={{ borderColor: '#765B31' }}>
      <Text style={{ color: C.amber, fontWeight: '800', marginBottom: 5 }}>Safety first</Text>
      <AppText style={{ color: C.muted, fontSize: 12 }}>Do not exercise while fatigued behind the wheel. Swim only if confident and safe in the water; water walking is an alternative. Stop if you experience chest pain, faintness, unusual severe breathlessness or sharp pain.</AppText>
    </Card>
  </ScrollView></Screen>;
}
