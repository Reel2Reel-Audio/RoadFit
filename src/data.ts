export type Meal = { id: string; day: string; type: string; title: string; details: string; portable: boolean };
export type Exercise = { name: string; dose: string; cue: string };
export type Workout = { id: string; day: string; title: string; kind: 'strength' | 'pool'; duration: string; details: string; exercises: Exercise[] };
export type Snack = { id: string; title: string; details: string };

export const mealPlan: Meal[] = [
  { id:'m1', day:'Monday', type:'Breakfast', title:'Overnight oats with yoghurt and berries', details:'Mix oats, plain yoghurt and berries in a sealed jar; keep chilled.', portable:true },
  { id:'m2', day:'Monday', type:'Lunch', title:'Chicken salad wholegrain wrap', details:'Pack chicken, salad and hummus in a wrap; keep chilled until eating.', portable:true },
  { id:'m3', day:'Monday', type:'Dinner', title:'Chicken, rice and vegetables', details:'Use pre-cooked chicken, microwave rice at a stop if available, or chilled rice prepared safely.', portable:true },
  { id:'m4', day:'Tuesday', type:'Breakfast', title:'Boiled eggs, wholegrain crackers and tomato', details:'Keep eggs chilled in your cooler.', portable:true },
  { id:'m5', day:'Tuesday', type:'Lunch', title:'Tuna and bean salad tub', details:'Use an unopened tuna pouch/can and beans; mix with salad shortly before eating.', portable:true },
  { id:'m6', day:'Tuesday', type:'Dinner', title:'Chicken or tofu salad bowl', details:'Pack protein, salad vegetables and a wholegrain wrap or crackers.', portable:true },
  { id:'m7', day:'Wednesday', type:'Breakfast', title:'Greek yoghurt, oats and banana', details:'Choose plain yoghurt; add oats and sliced banana.', portable:true },
  { id:'m8', day:'Wednesday', type:'Lunch', title:'Leftover chicken or tofu wrap', details:'Keep chilled in a sealed container and eat during a safe break.', portable:true },
  { id:'m9', day:'Wednesday', type:'Dinner', title:'Bean chilli with wholegrain crackers', details:'Use canned beans and tomatoes; a thermos can keep a meal hot if prepared safely.', portable:true },
  { id:'m10', day:'Thursday', type:'Breakfast', title:'Peanut butter wholegrain toast + fruit', details:'Use single-serve peanut butter and whole fruit for a no-fridge backup.', portable:true },
  { id:'m11', day:'Thursday', type:'Lunch', title:'Egg, chickpea or chicken sandwich', details:'Use wholegrain bread and salad; keep perishable fillings chilled.', portable:true },
  { id:'m12', day:'Thursday', type:'Dinner', title:'Tuna and bean wholegrain pasta salad', details:'Cook pasta ahead, cool promptly and keep refrigerated; add tuna/beans and vegetables.', portable:true },
  { id:'m13', day:'Friday', type:'Breakfast', title:'Overnight oats with apple and cinnamon', details:'Prepare the night before and store in the cooler.', portable:true },
  { id:'m14', day:'Friday', type:'Lunch', title:'Leftover bean chilli or tuna salad', details:'Pack a safe chilled portion and eat at a rest stop.', portable:true },
  { id:'m15', day:'Friday', type:'Dinner', title:'Chicken, salad kit and potato', details:'Choose a sensible portion of roast chicken, bagged salad and ready-cooked potato where available.', portable:true },
  { id:'m16', day:'Saturday', type:'Breakfast', title:'Eggs and wholegrain crackers', details:'Keep eggs chilled; use fruit alongside.', portable:true },
  { id:'m17', day:'Saturday', type:'Lunch', title:'Falafel or chicken grain bowl', details:'Use a chilled prepared bowl or pack grains, vegetables and protein separately.', portable:true },
  { id:'m18', day:'Saturday', type:'Dinner', title:'Lean burger or bean patty with salad', details:'Use a wholegrain bun and salad; keep sauces modest if desired.', portable:true },
  { id:'m19', day:'Sunday', type:'Breakfast', title:'Muesli, UHT milk and fruit', details:'Shelf-stable UHT milk is useful when refrigeration is unavailable until opened.', portable:true },
  { id:'m20', day:'Sunday', type:'Lunch', title:'Bean soup in a food thermos', details:'Preheat the thermos and follow food-safety guidance for hot holding.', portable:true },
  { id:'m21', day:'Sunday', type:'Dinner', title:'Roast chicken or tofu, vegetables and potato', details:'Batch-cook safely; refrigerate promptly and keep chilled for transport.', portable:true },
];

export function getMealPlan(
  edits: Record<string, Partial<Meal>>,
  customMeals: Meal[],
  deletedMealIds: string[],
) {
  const deleted = new Set(deletedMealIds);
  return [
    ...mealPlan.filter(meal => !deleted.has(meal.id)).map(meal => ({ ...meal, ...edits[meal.id] })),
    ...customMeals.filter(meal => !deleted.has(meal.id)).map(meal => ({ ...meal, ...edits[meal.id] })),
  ];
}

export const snacks: Snack[] = [
  { id:'s1', title:'Whole fruit', details:'Apple, banana, mandarin or seasonal fruit' },
  { id:'s2', title:'Small pack of nuts', details:'Choose a portion that feels satisfying' },
  { id:'s3', title:'Wholegrain crackers', details:'Pair with tuna, cheese or hummus where practical' },
  { id:'s4', title:'Roasted chickpeas', details:'Shelf-stable, crunchy option' },
  { id:'s5', title:'UHT milk or tuna pouch', details:'Follow package storage instructions' },
  { id:'s6', title:'Greek yoghurt', details:'Only if kept cold in your cooler' },
];

export function getSnackPlan(
  edits: Record<string, Partial<Snack>>,
  customSnacks: Snack[],
  deletedSnackIds: string[],
) {
  const deleted = new Set(deletedSnackIds);
  return [
    ...snacks.filter(snack => !deleted.has(snack.id)).map(snack => ({ ...snack, ...edits[snack.id] })),
    ...customSnacks.filter(snack => !deleted.has(snack.id)).map(snack => ({ ...snack, ...edits[snack.id] })),
  ];
}

export const shoppingItems = [
  { id:'p1', category:'Protein', name:'Chicken or ready-cooked chicken' },
  { id:'p2', category:'Protein', name:'Canned tuna or tuna pouches' },
  { id:'p3', category:'Protein', name:'Eggs' },
  { id:'p4', category:'Protein', name:'Plain Greek yoghurt' },
  { id:'p5', category:'Protein', name:'Canned beans, chickpeas or lentils' },
  { id:'p6', category:'Protein', name:'Tofu or falafel' },
  { id:'p7', category:'Fruit & veg', name:'Apples, bananas and seasonal fruit' },
  { id:'p8', category:'Fruit & veg', name:'Salad leaves, tomatoes and cucumber' },
  { id:'p9', category:'Fruit & veg', name:'Carrots and frozen/mixed vegetables' },
  { id:'p10', category:'Fruit & veg', name:'Potatoes or microwave-ready potatoes' },
  { id:'p11', category:'Grains', name:'Oats or muesli' },
  { id:'p12', category:'Grains', name:'Wholegrain wraps, bread and crackers' },
  { id:'p13', category:'Grains', name:'Wholegrain pasta or ready grains' },
  { id:'p14', category:'Pantry', name:'UHT milk' },
  { id:'p15', category:'Pantry', name:'Nuts or single-serve nut butter' },
  { id:'p16', category:'Pantry', name:'Hummus, herbs and low-salt seasonings' },
  { id:'p17', category:'Equipment', name:'Insulated cooler bag and frozen ice packs' },
  { id:'p18', category:'Equipment', name:'Reusable water bottle and leakproof containers' },
];

export const workouts: Workout[] = [
  { id:'w1', day:'Monday', title:'Strength A — Full body', kind:'strength', duration:'35–50 min', details:'Warm up 5–8 minutes. Start with 2 sets per exercise; leave 2–3 good reps in reserve.', exercises:[
    {name:'Chair squat or goblet squat',dose:'2–3 × 8–12',cue:'Control the lowering phase; use a chair target or light weight.'},
    {name:'Chest press or incline push-up',dose:'2–3 × 8–12',cue:'Choose a comfortable range; wall push-ups are easier.'},
    {name:'Seated row or band row',dose:'2–3 × 8–12',cue:'Pull elbows back without shrugging or rocking.'},
    {name:'Romanian deadlift or glute bridge',dose:'2–3 × 8–12',cue:'Hinge at the hips with light weight, or use glute bridges.'},
    {name:'Sit-to-stand or low step-up',dose:'2 × 8–10',cue:'Use support if balance is uncertain.'},
  ]},
  { id:'w2', day:'Tuesday', title:'Pool cardio — steady', kind:'pool', duration:'15–35 min', details:'Use swimming if confident in the water, or water-walking in a suitable shallow area.', exercises:[
    {name:'Easy warm-up',dose:'5 min',cue:'Gentle water walking or relaxed swimming.'},
    {name:'Steady swim / water walk',dose:'10–25 min',cue:'Keep a pace where you can control your breathing; take breaks.'},
    {name:'Cool-down',dose:'5 min',cue:'Slow down and finish comfortably.'},
  ]},
  { id:'w3', day:'Wednesday', title:'Strength B — Full body', kind:'strength', duration:'35–50 min', details:'Use manageable loads and smooth technique. Rest 60–120 seconds between sets.', exercises:[
    {name:'Leg press or chair squat',dose:'2–3 × 8–12',cue:'Use a comfortable range; do not force depth.'},
    {name:'Lat pulldown or band pulldown',dose:'2–3 × 8–12',cue:'Pull toward the upper chest; avoid leaning far back.'},
    {name:'Light shoulder press or chest press',dose:'2–3 × 8–12',cue:'Use a pain-free range.'},
    {name:'Glute bridge or hip thrust',dose:'2–3 × 10–15',cue:'Squeeze glutes without over-arching the back.'},
    {name:'One-arm row',dose:'2–3 × 8–12 each side',cue:'Support yourself on a stable bench or chair.'},
  ]},
  { id:'w4', day:'Thursday', title:'Pool cardio — gentle intervals', kind:'pool', duration:'15–35 min', details:'Keep effort moderate, not all-out. Water walking is a good alternative to swimming.', exercises:[
    {name:'Easy warm-up',dose:'5 min',cue:'Relaxed swimming or water walking.'},
    {name:'Moderate / easy intervals',dose:'6–10 rounds',cue:'1 minute a little quicker, then 1–2 minutes easy.'},
    {name:'Cool-down',dose:'5 min',cue:'Easy movement; stop if you feel unwell.'},
  ]},
  { id:'w5', day:'Friday', title:'Strength A or B — alternate weekly', kind:'strength', duration:'35–50 min', details:'Alternate A and B each week. If very fatigued, reduce sets or make this an easy movement day.', exercises:[
    {name:'Squat pattern',dose:'2–3 × 8–12',cue:'Chair squat, goblet squat or leg press.'},
    {name:'Push pattern',dose:'2–3 × 8–12',cue:'Chest press, incline push-up or comfortable shoulder press.'},
    {name:'Pull pattern',dose:'2–3 × 8–12',cue:'Row or pulldown.'},
    {name:'Hip pattern',dose:'2–3 × 8–12',cue:'Glute bridge or light Romanian deadlift.'},
    {name:'Core',dose:'2 sets',cue:'Dead bug, bird dog or elevated plank.'},
  ]},
];

export function getWorkouts(
  edits: Record<string, Workout>,
  customWorkouts: Workout[],
  deletedWorkoutIds: string[],
) {
  const deleted = new Set(deletedWorkoutIds);
  return [
    ...workouts.filter(workout => !deleted.has(workout.id)).map(workout => edits[workout.id] ?? workout),
    ...customWorkouts.filter(workout => !deleted.has(workout.id)),
  ];
}

export const weekDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
