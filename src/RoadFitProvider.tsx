import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { isCloudConfigured, supabase } from './supabase';

const STORAGE_KEY = 'roadfit.v1.state';

export type WeightEntry = { id: string; date: string; weight: number };
export type CustomWorkout = { id: string; title: string; duration: string; details: string; activities: string[] };
export type RoadFitState = {
  startingWeight: number | null;
  goalWeight: number | null;
  weightEntries: WeightEntry[];
  completedMeals: string[];
  completedWorkouts: string[];
  workoutActivities: Record<string, string[]>;
  customWorkouts: CustomWorkout[];
  checkedShopping: string[];
  waterGlasses: number;
  lastSyncedAt: string | null;
};

const initialState: RoadFitState = {
  startingWeight: null,
  goalWeight: null,
  weightEntries: [],
  completedMeals: [],
  completedWorkouts: [],
  workoutActivities: {},
  customWorkouts: [],
  checkedShopping: [],
  waterGlasses: 0,
  lastSyncedAt: null,
};

type ContextValue = {
  data: RoadFitState;
  ready: boolean;
  cloudConfigured: boolean;
  updateWeight: (weight: number, date?: string) => void;
  setStartingWeight: (weight: number) => void;
  setGoalWeight: (weight: number) => void;
  toggleMeal: (id: string) => void;
  toggleWorkout: (id: string) => void;
  toggleWorkoutActivity: (workoutId: string, activityId: string) => void;
  addCustomWorkout: (title: string, duration: string, details: string, activities: string[]) => void;
  toggleShopping: (id: string) => void;
  addWater: () => void;
  resetWater: () => void;
  syncNow: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  authEmail: string | null;
  clearProgress: () => void;
};
const RoadFitContext = createContext<ContextValue | null>(null);

export function RoadFitProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<RoadFitState>(initialState);
  const [ready, setReady] = useState(false);
  const [authEmail, setAuthEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setData({ ...initialState, ...JSON.parse(saved) });
      } catch (e) {
        console.warn('Could not load RoadFit data', e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(e => console.warn('Could not save RoadFit data', e));
  }, [data, ready]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: sessionData }) => {
      setAuthEmail(sessionData.session?.user.email ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthEmail(session?.user.email ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const mutate = useCallback((fn: (prev: RoadFitState) => RoadFitState) => setData(prev => fn(prev)), []);
  const updateWeight = useCallback((weight: number, date = new Date().toISOString().slice(0,10)) => {
    if (!Number.isFinite(weight) || weight <= 0 || weight > 500) {
      Alert.alert('Check the weight', 'Enter a weight between 1 and 500 kg.');
      return;
    }
    mutate(prev => {
      const entries = prev.weightEntries.filter(e => e.date !== date);
      entries.push({ id: `${date}-${Date.now()}`, date, weight });
      entries.sort((a,b) => a.date.localeCompare(b.date));
      return { ...prev, weightEntries: entries, startingWeight: prev.startingWeight ?? weight };
    });
  }, [mutate]);
  const setStartingWeight = useCallback((weight: number) => {
    if (!Number.isFinite(weight) || weight <= 0 || weight > 500) return;
    mutate(prev => ({ ...prev, startingWeight: weight }));
  }, [mutate]);
  const setGoalWeight = useCallback((weight: number) => {
    if (!Number.isFinite(weight) || weight <= 0 || weight > 500) return;
    mutate(prev => ({ ...prev, goalWeight: weight }));
  }, [mutate]);
  const toggleArray = (field: 'completedMeals' | 'completedWorkouts' | 'checkedShopping', id: string) => {
    mutate(prev => {
      const list = prev[field];
      return { ...prev, [field]: list.includes(id) ? list.filter(x => x !== id) : [...list, id] };
    });
  };
  const toggleMeal = useCallback((id: string) => toggleArray('completedMeals', id), []);
  const toggleWorkout = useCallback((id: string) => toggleArray('completedWorkouts', id), []);
  const toggleShopping = useCallback((id: string) => toggleArray('checkedShopping', id), []);
  const toggleWorkoutActivity = useCallback((workoutId: string, activityId: string) => {
    mutate(prev => {
      const current = prev.workoutActivities[workoutId] ?? [];
      const isDone = current.includes(activityId);
      const updatedActivities = isDone ? current.filter(id => id !== activityId) : [...current, activityId];
      return {
        ...prev,
        workoutActivities: { ...prev.workoutActivities, [workoutId]: updatedActivities },
        completedWorkouts: isDone ? prev.completedWorkouts.filter(id => id !== workoutId) : prev.completedWorkouts,
      };
    });
  }, [mutate]);
  const addCustomWorkout = useCallback((title: string, duration: string, details: string, activities: string[]) => {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      Alert.alert('Add a workout name', 'Enter a name for your workout before saving it.');
      return;
    }
    if (activities.length === 0) {
      Alert.alert('Add an activity', 'Add at least one activity to your workout.');
      return;
    }
    mutate(prev => ({
      ...prev,
      customWorkouts: [...prev.customWorkouts, {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: cleanTitle,
        duration: duration.trim() || 'Custom session',
        details: details.trim(),
        activities,
      }],
    }));
  }, [mutate]);
  const addWater = useCallback(() => mutate(prev => ({ ...prev, waterGlasses: Math.min(prev.waterGlasses + 1, 30) })), [mutate]);
  const resetWater = useCallback(() => mutate(prev => ({ ...prev, waterGlasses: 0 })), [mutate]);
  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Cloud sync is not configured. Add your Supabase details to .env first.');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
  }, []);
  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Cloud sync is not configured. Add your Supabase details to .env first.');
    const { error } = await supabase.auth.signUp({ email: email.trim(), password });
    if (error) throw error;
  }, []);
  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);
  const syncNow = useCallback(async () => {
    if (!isCloudConfigured || !supabase) {
      Alert.alert('Cloud sync not configured', 'RoadFit is saving on this device. To enable sync, configure Supabase using the README and .env.example.');
      return;
    }
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const userId = sessionData.session?.user.id;
      if (!userId) {
        Alert.alert('Sign in to sync', 'Create a RoadFit cloud account or sign in on this device first. Your local data is still saved offline.');
        return;
      }
      const { data: remoteRow, error: readError } = await supabase
        .from('roadfit_user_data')
        .select('payload')
        .eq('user_id', userId)
        .maybeSingle();
      if (readError) throw readError;
      const remote = (remoteRow?.payload ?? {}) as Partial<RoadFitState>;
      const local = data;
      const byDate = new Map<string, WeightEntry>();
      [...(remote.weightEntries ?? []), ...local.weightEntries].forEach(entry => byDate.set(entry.date, entry));
      const syncedAt = new Date().toISOString();
      const merged: RoadFitState = {
        ...initialState,
        ...remote,
        ...local,
        startingWeight: local.startingWeight ?? remote.startingWeight ?? null,
        goalWeight: local.goalWeight ?? remote.goalWeight ?? null,
        weightEntries: [...byDate.values()].sort((a,b) => a.date.localeCompare(b.date)),
        completedMeals: [...new Set([...(remote.completedMeals ?? []), ...local.completedMeals])],
        completedWorkouts: [...new Set([...(remote.completedWorkouts ?? []), ...local.completedWorkouts])],
        customWorkouts: [...new Map([...(remote.customWorkouts ?? []), ...local.customWorkouts].map(workout => [workout.id, workout])).values()],
        workoutActivities: Object.fromEntries(
          Object.entries({ ...(remote.workoutActivities ?? {}), ...(local.workoutActivities ?? {}) }).map(([workoutId, localActivities]) => [
            workoutId,
            [...new Set([...(remote.workoutActivities?.[workoutId] ?? []), ...localActivities])],
          ]),
        ),
        checkedShopping: [...new Set([...(remote.checkedShopping ?? []), ...local.checkedShopping])],
        waterGlasses: Math.max(remote.waterGlasses ?? 0, local.waterGlasses),
        lastSyncedAt: syncedAt,
      };
      const { error: writeError } = await supabase.from('roadfit_user_data').upsert({
        user_id: userId,
        payload: merged,
        updated_at: syncedAt,
      }, { onConflict: 'user_id' });
      if (writeError) throw writeError;
      setData(merged);
      Alert.alert('Sync complete', 'RoadFit merged your saved progress with the cloud copy.');
    } catch (e: any) {
      Alert.alert('Sync failed', e?.message || 'Check your connection and Supabase setup.');
    }
  }, [data]);
  const clearProgress = useCallback(() => {
    Alert.alert('Reset RoadFit?', 'This removes saved progress on this device. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => setData(initialState) },
    ]);
  }, []);
  const value = useMemo(() => ({
    data, ready, cloudConfigured: isCloudConfigured, updateWeight, setStartingWeight, setGoalWeight,
    toggleMeal, toggleWorkout, toggleWorkoutActivity, addCustomWorkout, toggleShopping, addWater, resetWater, syncNow, signIn, signUp, signOut, authEmail, clearProgress,
  }), [data, ready, updateWeight, setStartingWeight, setGoalWeight, toggleMeal, toggleWorkout, toggleWorkoutActivity, addCustomWorkout, toggleShopping, addWater, resetWater, syncNow, signIn, signUp, signOut, authEmail, clearProgress]);
  return <RoadFitContext.Provider value={value}>{children}</RoadFitContext.Provider>;
}

export function useRoadFit() {
  const value = useContext(RoadFitContext);
  if (!value) throw new Error('useRoadFit must be used inside RoadFitProvider');
  return value;
}
