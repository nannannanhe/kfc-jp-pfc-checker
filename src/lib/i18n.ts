import type { Locale, Category } from '../types';

const categoryLabels: Record<Category, Record<Locale, string>> = {
  chicken: { ja: 'チキン', en: 'Chicken' },
  burger: { ja: 'バーガー', en: 'Burger' },
  sides: { ja: 'サイド', en: 'Sides' },
  drink: { ja: 'ドリンク', en: 'Drink' },
};

const nutritionLabels: Record<string, Record<Locale, string>> = {
  calories: { ja: 'カロリー', en: 'Calories' },
  carbs: { ja: '炭水化物', en: 'Carbs' },
  protein: { ja: 'タンパク質', en: 'Protein' },
  fat: { ja: '脂質', en: 'Fat' },
  fiber: { ja: '食物繊維', en: 'Fiber' },
};

export const nutritionUnits: Record<string, string> = {
  calories: 'kcal',
  carbs: 'g',
  protein: 'g',
  fat: 'g',
  fiber: 'g',
};

export function getCategoryLabel(category: Category, locale: Locale): string {
  return categoryLabels[category][locale];
}

export function getNutritionLabel(nutrient: string, locale: Locale): string {
  return nutritionLabels[nutrient]?.[locale] ?? nutrient;
}
