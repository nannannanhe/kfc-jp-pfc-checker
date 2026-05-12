import nutritionData from '../../data/nutrition.json';
import type { MenuItem, NutritionValue, Category } from '../types';

function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function loadMenuItems(): MenuItem[] {
  return nutritionData.items.map((item) => ({
    id: toKebabCase(item.name_en),
    name: item.name,
    name_en: item.name_en,
    category: item.category as Category,
    nutrition: {
      calories: item.energy as NutritionValue,
      carbs: item.carbohydrate as NutritionValue,
      protein: item.protein as NutritionValue,
      fat: item.fat as NutritionValue,
      fiber: item.dietary_fiber as NutritionValue,
    },
  }));
}

export interface NutritionTotal {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
}

export function calcTotal(items: Array<{ item: MenuItem; qty: number }>): NutritionTotal {
  return items.reduce(
    (acc, { item, qty }) => ({
      calories: acc.calories + (item.nutrition.calories ?? 0) * qty,
      carbs: acc.carbs + (item.nutrition.carbs ?? 0) * qty,
      protein: acc.protein + (item.nutrition.protein ?? 0) * qty,
      fat: acc.fat + (item.nutrition.fat ?? 0) * qty,
      fiber: acc.fiber + (item.nutrition.fiber ?? 0) * qty,
    }),
    { calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0 }
  );
}

export function formatValue(value: NutritionValue): string {
  if (value === null) return '-';
  return String(value);
}

export function scaleValue(value: NutritionValue, qty: number): string {
  if (value === null) return '-';
  const scaled = value * qty;
  return Number.isInteger(value) ? String(scaled) : scaled.toFixed(1);
}
