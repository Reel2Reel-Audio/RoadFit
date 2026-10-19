import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import { useRoadFit } from '../../src/RoadFitProvider';
import { AppText, Button, Card, Header, Pill, Screen, SmallLabel, C } from '../../src/ui';

export default function Progress() {
  const { data, updateWeight, setStartingWeight, setGoalWeight, syncNow, cloudConfigured, authEmail, signIn, signUp, signOut, clearProgress } = useRoadFit();
  const [weightInput, setWeightInput] = useState('');
  const [startInput, setStartInput] = useState(data.startingWeight?.toString() ?? '');
  const [goalInput, setGoalInput] = useState(data.goalWeight?.toString() ?? '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const latestEntry = data.weightEntries[data.weightEntries.length - 1];
  const latest = latestEntry?.weight;
  const lost = data.startingWeight && latest ? data.startingWeight - latest : null;
  const remaining = data.goalWeight && latest ? latest - data.goalWeight : null;
  const fieldStyle = { color: C.text, backgroundColor: C.bg, borderColor: C.border, borderWidth: 1, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, marginTop: 7, marginBottom: 10 } as const;
  const number = (s: string) => Number(s.replace(',', '.'));
  const runAuth = async (fn: () => Promise<void>, successMessage: string) => {
    try { await fn(); Alert.alert('RoadFit account', successMessage); }
    catch (e: any) { Alert.alert('Account error', e?.message || 'Please check your details and try again.'); }
  };
  return <Screen><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
    <Header showBack eyebrow="YOUR DATA STAYS ON YOUR DEVICE" title="Progress" subtitle="Log weight when convenient and look at trends over time, not day-to-day fluctuations." />
    <Card>
      <SmallLabel>LOG TODAY'S WEIGHT (KG)</SmallLabel>
      <TextInput value={weightInput} onChangeText={setWeightInput} placeholder="e.g. 110.5" placeholderTextColor={C.muted} keyboardType="decimal-pad" style={fieldStyle} />
      <Button title="Save weight" onPress={() => { const n = number(weightInput); if (Number.isFinite(n) && n > 0) { updateWeight(n); setWeightInput(''); } else Alert.alert('Check your weight', 'Enter a valid weight in kilograms.'); }} />
      {latestEntry && <AppText style={{ color: C.muted, fontSize: 11, marginTop: 9 }}>Latest: {latestEntry.weight} kg on {latestEntry.date}</AppText>}
    </Card>
    <Card>
      <SmallLabel>SET YOUR BASELINE AND GOAL</SmallLabel>
      <Text style={{ color: C.muted, fontSize: 11 }}>Starting weight (kg)</Text>
      <TextInput value={startInput} onChangeText={setStartInput} placeholder="Enter starting weight" placeholderTextColor={C.muted} keyboardType="decimal-pad" style={fieldStyle} />
      <Text style={{ color: C.muted, fontSize: 11 }}>Goal weight (kg)</Text>
      <TextInput value={goalInput} onChangeText={setGoalInput} placeholder="Enter target weight" placeholderTextColor={C.muted} keyboardType="decimal-pad" style={fieldStyle} />
      <Button title="Save goals" onPress={() => { if (number(startInput) > 0) setStartingWeight(number(startInput)); if (number(goalInput) > 0) setGoalWeight(number(goalInput)); }} secondary />
    </Card>
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Card style={{ flex: 1 }}><SmallLabel>CHANGE</SmallLabel><Text style={{ color: C.text, fontSize: 22, fontWeight: '800' }}>{lost === null ? '—' : `${lost > 0 ? '−' : '+'}${Math.abs(lost).toFixed(1)} kg`}</Text><AppText style={{ color: C.muted, fontSize: 10 }}>vs starting weight</AppText></Card>
      <Card style={{ flex: 1 }}><SmallLabel>TO GOAL</SmallLabel><Text style={{ color: C.text, fontSize: 22, fontWeight: '800' }}>{remaining === null ? '—' : `${remaining.toFixed(1)} kg`}</Text><AppText style={{ color: C.muted, fontSize: 10 }}>based on latest entry</AppText></Card>
    </View>
    <Card>
      <Text style={{ color: C.text, fontSize: 16, fontWeight: '800', marginBottom: 9 }}>Weight history</Text>
      {data.weightEntries.length === 0 ? <AppText style={{ color: C.muted, fontSize: 12 }}>No entries yet. Add your first weight above.</AppText> : data.weightEntries.slice().reverse().map(entry => <View key={entry.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 0.5, borderBottomColor: C.border }}><Text style={{ color: C.muted, fontSize: 12 }}>{entry.date}</Text><Text style={{ color: C.text, fontWeight: '800' }}>{entry.weight.toFixed(1)} kg</Text></View>)}
    </Card>
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}><Text style={{ color: C.text, fontSize: 16, fontWeight: '800' }}>Cloud account</Text><Pill color={cloudConfigured ? C.green : C.amber}>{cloudConfigured ? (authEmail ? 'Signed in' : 'Configured') : 'Not set up'}</Pill></View>
      <AppText style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>{!cloudConfigured ? 'Local/offline saving works now. Add Supabase details to .env to enable account sync.' : authEmail ? `Signed in as ${authEmail}. Use Sync now to merge this device with your cloud backup.` : 'Create an account or sign in on each device to sync progress between them.'}</AppText>
      {cloudConfigured && !authEmail && <>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" placeholder="Email address" placeholderTextColor={C.muted} style={fieldStyle} />
        <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password (at least 6 characters)" placeholderTextColor={C.muted} style={fieldStyle} />
        <View style={{ gap: 8 }}>
          <Button title="Create cloud account" onPress={() => runAuth(() => signUp(email, password), 'Account request sent. If email confirmation is enabled, confirm your email, then sign in.')} />
          <Button title="Sign in" secondary onPress={() => runAuth(() => signIn(email, password), 'You are signed in. You can now sync your progress.')} />
        </View>
      </>}
      {cloudConfigured && !!authEmail && <View style={{ gap: 8 }}><Button title="Sync now" onPress={syncNow} /><Button title="Sign out" secondary onPress={() => runAuth(signOut, 'You have signed out. Your local data remains on this device.')} /></View>}
      {!cloudConfigured && <Button title="Sync setup instructions" onPress={() => Alert.alert('Enable cloud sync', 'Follow the README in the RoadFit starter ZIP: create a Supabase project, run supabase/schema.sql, set the two EXPO_PUBLIC_SUPABASE values in .env, and restart Expo.')} />}
      {data.lastSyncedAt && <AppText style={{ color: C.muted, fontSize: 10, marginTop: 8 }}>Last sync: {new Date(data.lastSyncedAt).toLocaleString()}</AppText>}
    </Card>
    <Button title="Reset all saved progress" onPress={clearProgress} secondary />
    <Text style={{ color: C.muted, fontSize: 10, textAlign: 'center', marginTop: 12 }}>General fitness guidance only. Avoid crash dieting; seek personalised guidance if needed.</Text>
  </ScrollView></Screen>;
}
