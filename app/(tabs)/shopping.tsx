import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { shoppingItems } from '../../src/data';
import { useRoadFit } from '../../src/RoadFitProvider';
import { AppText, Card, CheckRow, Header, Pill, Screen, C } from '../../src/ui';

export default function Shopping() {
  const { data, toggleShopping } = useRoadFit();
  const categories = [...new Set(shoppingItems.map(x => x.category))];
  const checked = data.checkedShopping.length;
  return <Screen><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
    <Header showBack eyebrow="PREP BEFORE YOUR SHIFT" title="Shopping list" subtitle="Tick off items as you shop. The list stays saved on your phone." />
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Text style={{ color: C.text, fontSize: 17, fontWeight: '800' }}>Your list</Text><Pill>{checked}/{shoppingItems.length} packed</Pill></View>
      <View style={{ height: 5, backgroundColor: C.border, borderRadius: 9, marginTop: 12, marginBottom: 4, overflow: 'hidden' }}><View style={{ height: 5, width: `${Math.min(100, checked / shoppingItems.length * 100)}%`, backgroundColor: C.green }} /></View>
    </Card>
    {categories.map(category => <Card key={category}>
      <Text style={{ color: C.green, fontSize: 10, letterSpacing: 1.4, fontWeight: '800', marginBottom: 5 }}>{category.toUpperCase()}</Text>
      {shoppingItems.filter(x => x.category === category).map(item => <CheckRow key={item.id} title={item.name} checked={data.checkedShopping.includes(item.id)} onPress={() => toggleShopping(item.id)} />)}
    </Card>)}
    <AppText style={{ color: C.muted, fontSize: 11 }}>Tip: pack perishable food in an insulated cooler with frozen ice packs and keep it at 5°C or colder.</AppText>
  </ScrollView></Screen>;
}
