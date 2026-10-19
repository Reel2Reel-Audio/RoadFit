import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import { getShoppingList } from '../../src/data';
import { useRoadFit } from '../../src/RoadFitProvider';
import { AppText, Button, Card, CheckRow, Header, Pill, Screen, C } from '../../src/ui';

export default function Shopping() {
  const {
    data, toggleShopping, updateShoppingItem, addShoppingItem, deleteShoppingItem,
  } = useRoadFit();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const items = useMemo(
    () => getShoppingList(data.shoppingEdits, data.customShoppingItems, data.deletedShoppingItemIds),
    [data.shoppingEdits, data.customShoppingItems, data.deletedShoppingItemIds],
  );
  const checkedIds = new Set(data.checkedShopping.filter(id => items.some(item => item.id === id)));
  const checkedCount = checkedIds.size;
  const categories = [...new Set(items.map(item => item.category.trim() || 'Other'))];
  const fieldStyle = {
    color: C.text, backgroundColor: C.bg, borderColor: C.border, borderWidth: 1,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, marginTop: 9,
  } as const;
  const resetForm = () => {
    setAdding(false);
    setEditingId(null);
    setNameInput('');
    setCategoryInput('');
  };
  const beginEdit = (id: string) => {
    const item = items.find(entry => entry.id === id);
    if (!item) return;
    setNameInput(item.name);
    setCategoryInput(item.category);
    setEditingId(id);
    setAdding(false);
  };
  const save = () => {
    if (!nameInput.trim()) {
      Alert.alert('Add an item name', 'Enter a name for the shopping item before saving it.');
      return;
    }
    if (editingId) updateShoppingItem(editingId, { name: nameInput.trim(), category: categoryInput.trim() || 'Other' });
    else addShoppingItem(nameInput, categoryInput);
    resetForm();
  };
  const form = (
    <View style={{ paddingTop: 9 }}>
      <TextInput
        value={nameInput}
        onChangeText={setNameInput}
        placeholder="Item name"
        placeholderTextColor={C.muted}
        style={fieldStyle}
        autoFocus
      />
      <TextInput
        value={categoryInput}
        onChangeText={setCategoryInput}
        placeholder="Category (e.g. Fruit & veg)"
        placeholderTextColor={C.muted}
        style={fieldStyle}
        returnKeyType="done"
        onSubmitEditing={save}
      />
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <View style={{ flex: 1 }}><Button title={editingId ? 'Save changes' : 'Add item'} onPress={save} /></View>
        <View style={{ flex: 1 }}><Button title="Cancel" onPress={resetForm} secondary /></View>
      </View>
    </View>
  );

  return <Screen><ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 30 }}>
    <Header showBack eyebrow="PREP BEFORE YOUR SHIFT" title="Shopping list" subtitle="Make your own list. Add, edit or remove items, and tick them off as you shop." />
    <Card>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View><Text style={{ color: C.text, fontSize: 17, fontWeight: '800' }}>Your list</Text><Text style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>{items.length} {items.length === 1 ? 'item' : 'items'} to shop</Text></View>
        <Pill>{checkedCount}/{items.length} packed</Pill>
      </View>
      <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: items.length, now: checkedCount }} style={{ height: 6, backgroundColor: C.border, borderRadius: 9, marginTop: 13, overflow: 'hidden' }}>
        <View style={{ height: 6, width: `${items.length ? checkedCount / items.length * 100 : 0}%`, backgroundColor: C.green }} />
      </View>
      {!adding && !editingId && <View style={{ marginTop: 13 }}><Button title="+ Add an item" onPress={() => { setAdding(true); setNameInput(''); setCategoryInput(''); }} /></View>}
      {(adding || editingId) && form}
    </Card>
    {items.length === 0 && !adding ? <Card>
      <Text style={{ color: C.text, fontSize: 15, fontWeight: '800' }}>Your list is empty</Text>
      <AppText style={{ color: C.muted, fontSize: 12, marginTop: 5 }}>Add an item to start your shopping list.</AppText>
    </Card> : categories.map(category => {
      const categoryItems = items.filter(item => (item.category.trim() || 'Other') === category);
      return <Card key={category}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ color: C.green, fontSize: 10, letterSpacing: 1.4, fontWeight: '800' }}>{category.toUpperCase()}</Text>
          <Text style={{ color: C.muted, fontSize: 10 }}>{categoryItems.filter(item => checkedIds.has(item.id)).length}/{categoryItems.length}</Text>
        </View>
        {categoryItems.map(item => <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <View style={{ flex: 1 }}>
            <CheckRow title={item.name} checked={checkedIds.has(item.id)} onPress={() => toggleShopping(item.id)} />
          </View>
          <Button title="Edit" onPress={() => beginEdit(item.id)} secondary />
          <Button title="×" onPress={() => Alert.alert('Remove this item?', `Remove "${item.name}" from your list?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => deleteShoppingItem(item.id) },
          ])} secondary />
        </View>)}
      </Card>;
    })}
    <Card style={{ borderColor: '#765B31' }}>
      <Text style={{ color: C.amber, fontWeight: '800', marginBottom: 5 }}>Food safety tip</Text>
      <AppText style={{ color: C.muted, fontSize: 12 }}>Pack perishable food in an insulated cooler with frozen ice packs and keep it at 5°C or colder.</AppText>
    </Card>
  </ScrollView></Screen>;
}
