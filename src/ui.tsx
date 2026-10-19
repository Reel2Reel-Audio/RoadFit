import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';

export const C = {
  bg: '#0B1220', panel: '#111B2D', panel2: '#162238', border: '#25334A',
  text: '#F4F7FB', muted: '#91A0B5', green: '#56D6B0', blue: '#77B8FF',
  amber: '#FFC66D', red: '#FF8D8D',
};

export function Screen({ children }: { children: React.ReactNode }) {
  return <View style={styles.screen}>{children}</View>;
}
export function Header({ eyebrow, title, subtitle, showBack = false }: { eyebrow?: string; title: string; subtitle?: string; showBack?: boolean }) {
  const router = useRouter();
  return <View style={styles.header}>
    {showBack && <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
      style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7 }]}
    >
      <Text style={styles.backButtonText}>‹  Back</Text>
    </Pressable>}
    {!!eyebrow && <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text>}
    <Text style={styles.title}>{title}</Text>
    {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>;
}
export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}
export function AppText({ children, style }: { children: React.ReactNode; style?: any }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}
export function SmallLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}
export function Button({ title, onPress, secondary, disabled }: { title: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.button, secondary && styles.buttonSecondary, disabled && { opacity: 0.45 }, pressed && { opacity: 0.8 }]}>
    <Text style={[styles.buttonText, secondary && { color: C.text }]}>{title}</Text>
  </Pressable>;
}
export function Pill({ children, color = C.green }: { children: React.ReactNode; color?: string }) {
  return <View style={[styles.pill, { borderColor: color + '66', backgroundColor: color + '18' }]}><Text style={[styles.pillText, { color }]}>{children}</Text></View>;
}
export function CheckRow({ title, subtitle, checked, onPress }: { title: string; subtitle?: string; checked: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.checkRow}>
    <View style={[styles.checkBox, checked && styles.checkBoxChecked]}>{checked ? <Text style={{ color: C.bg, fontWeight: '900' }}>✓</Text> : null}</View>
    <View style={{ flex: 1 }}>
      <Text style={[styles.checkTitle, checked && { color: C.muted, textDecorationLine: 'line-through' }]}>{title}</Text>
      {!!subtitle && <Text style={styles.checkSubtitle}>{subtitle}</Text>}
    </View>
  </Pressable>;
}
export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 18, paddingTop: 18 },
  header: { marginBottom: 18 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 7, paddingRight: 12, marginBottom: 8 },
  backButtonText: { color: C.green, fontSize: 14, fontWeight: '800' },
  eyebrow: { color: C.green, fontSize: 10, letterSpacing: 1.8, fontWeight: '800', marginBottom: 7 },
  title: { color: C.text, fontSize: 28, lineHeight: 33, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: C.muted, fontSize: 13, lineHeight: 19, marginTop: 6 },
  card: { backgroundColor: C.panel, borderColor: C.border, borderWidth: 1, borderRadius: 18, padding: 15, marginBottom: 12 },
  body: { color: C.text, fontSize: 14, lineHeight: 20 },
  label: { color: C.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 8 },
  button: { backgroundColor: C.green, paddingVertical: 12, paddingHorizontal: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buttonSecondary: { backgroundColor: C.panel2, borderColor: C.border, borderWidth: 1 },
  buttonText: { color: C.bg, fontWeight: '800', fontSize: 13 },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 99, borderWidth: 1 },
  pillText: { fontSize: 10, fontWeight: '800' },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 11, borderBottomColor: C.border, borderBottomWidth: StyleSheet.hairlineWidth, gap: 11 },
  checkBox: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, borderColor: '#52627A', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkBoxChecked: { backgroundColor: C.green, borderColor: C.green },
  checkTitle: { color: C.text, fontSize: 13, fontWeight: '700', lineHeight: 18 },
  checkSubtitle: { color: C.muted, fontSize: 11, lineHeight: 16, marginTop: 3 },
});
