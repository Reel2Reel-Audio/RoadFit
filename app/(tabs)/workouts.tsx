import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import { workouts } from '../../src/data';
import { useRoadFit } from '../../src/RoadFitProvider';
import { AppText, Button, Card, CheckRow, Header, Pill, Screen, C } from '../../src/ui';

export default function Workouts() {
  const { data, toggleWorkout, toggleWorkoutActivity, addCustomWorkout } = useRoadFit();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [details, setDetails] = useState('');
  const [activitiesInput, setActivitiesInput] = useState('');
  const fieldStyle = { color: C.text, backgroundColor: C.bg, borderColor: C.border, borderWidth: 1, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, marginTop: 8 } as const;
  const saveCustomWorkout = () => {
    if (!title.trim()) {
      Alert.alert('Add a workout name', 'Enter a name for your workout before saving it.');
      return;
    }
    const activities = activitiesInput.split(/\r?\n/).map(activity => activity.trim()).filter(Boolean);
    if (activities.length === 0) {
      Alert.alert('Add an activity', 'Enter at least one activity, with each activity on its own line.');
      return;
    }
    addCustomWorkout(title, duration, details, activities);
    setTitle('');
    setDuration('');
    setDetails('');
    setActivitiesInput('');
  };
  return <Screen><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
    <Header showBack eyebrow="5-DAY ROUTINE" title="Train for strength" subtitle="Three strength sessions and two low-impact pool sessions. Start easy and build gradually." />
    <Card>
      <Text style={{ color: C.text, fontSize: 17, fontWeight: '800' }}>Add your own workout</Text>
      <AppText style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>Add one activity per line. Mark each activity done to unlock workout completion.</AppText>
      <TextInput value={title} onChangeText={setTitle} placeholder="Workout name (required)" placeholderTextColor={C.muted} style={fieldStyle} />
      <TextInput value={duration} onChangeText={setDuration} placeholder="Duration (optional)" placeholderTextColor={C.muted} style={fieldStyle} />
      <TextInput value={activitiesInput} onChangeText={setActivitiesInput} placeholder="Activities (one per line, required)" placeholderTextColor={C.muted} multiline style={[fieldStyle, { minHeight: 80, textAlignVertical: 'top' }]} />
      <TextInput value={details} onChangeText={setDetails} placeholder="Notes (optional)" placeholderTextColor={C.muted} multiline style={[fieldStyle, { minHeight: 72, textAlignVertical: 'top' }]} />
      <View style={{ marginTop: 10 }}><Button title="Add workout" onPress={saveCustomWorkout} /></View>
    </Card>
    {data.customWorkouts.length > 0 && <>
      <Text style={{ color: C.green, fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginBottom: 10 }}>YOUR WORKOUTS · {data.customWorkouts.filter(w => data.completedWorkouts.includes(w.id)).length}/{data.customWorkouts.length} COMPLETE</Text>
      {data.customWorkouts.map(w => {
        const done = data.completedWorkouts.includes(w.id);
        const activities = w.activities?.length ? w.activities : [w.title];
        const completedActivities = data.workoutActivities[w.id] ?? [];
        const allActivitiesDone = activities.every((_, index) => completedActivities.includes(String(index)));
        return <Card key={w.id}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
            <Text style={{ color: C.text, fontSize: 17, fontWeight: '800', flex: 1 }}>{w.title}</Text>
            <Pill>{w.duration}</Pill>
          </View>
          {!!w.details && <AppText style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>{w.details}</AppText>}
          {activities.map((activity, index) => <CheckRow
            key={`${w.id}-${index}`}
            title={activity}
            checked={completedActivities.includes(String(index))}
            onPress={() => toggleWorkoutActivity(w.id, String(index))}
          />)}
          <View style={{ marginTop: 10 }}><Button title={done ? '✓ Workout completed' : allActivitiesDone ? 'Complete workout' : 'Complete all activities to unlock'} onPress={() => toggleWorkout(w.id)} secondary={done} disabled={!allActivitiesDone && !done} /></View>
        </Card>;
      })}
    </>}
    <Text style={{ color: C.green, fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginBottom: 10 }}>WEEKLY PLAN</Text>
    {workouts.map(w => {
      const done = data.completedWorkouts.includes(w.id);
      const completedActivities = data.workoutActivities[w.id] ?? [];
      const allActivitiesDone = w.exercises.every((_, index) => completedActivities.includes(String(index)));
      return <Card key={w.id}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}><Text style={{ color: C.green, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>{w.day.toUpperCase()}</Text><Text style={{ color: C.text, fontSize: 17, fontWeight: '800', marginTop: 4 }}>{w.title}</Text></View>
          <Pill color={w.kind === 'pool' ? C.blue : C.green}>{w.duration}</Pill>
        </View>
        <AppText style={{ color: C.muted, fontSize: 12, marginTop: 8, marginBottom: 8 }}>{w.details}</AppText>
        {w.exercises.map((ex, index) => <View key={ex.name} style={{ borderTopColor: C.border, borderTopWidth: 0.5 }}>
          <CheckRow
            title={`${ex.name} · ${ex.dose}`}
            subtitle={ex.cue}
            checked={completedActivities.includes(String(index))}
            onPress={() => toggleWorkoutActivity(w.id, String(index))}
          />
        </View>)}
        <View style={{ marginTop: 10 }}><Button title={done ? '✓ Workout completed' : allActivitiesDone ? 'Complete workout' : 'Complete all activities to unlock'} onPress={() => toggleWorkout(w.id)} secondary={done} disabled={!allActivitiesDone && !done} /></View>
      </Card>;
    })}
    <Card style={{ borderColor: '#765B31' }}>
      <Text style={{ color: C.amber, fontWeight: '800', marginBottom: 5 }}>Safety first</Text>
      <AppText style={{ color: C.muted, fontSize: 12 }}>Do not exercise while fatigued behind the wheel. Swim only if confident and safe in the water; water walking is an alternative. Stop if you experience chest pain, faintness, unusual severe breathlessness or sharp pain.</AppText>
    </Card>
  </ScrollView></Screen>;
}
