export type NutritionValue = number | null;
export type Locale = 'ja' | 'en';
export type Category = 'chicken' | 'burger' | 'sides' | 'drink';

export interface MenuItem {
  id: string;
  name: string;
  name_en: string;
  category: Category;
  nutrition: {
    calories: NutritionValue;
    carbs: NutritionValue;
    protein: NutritionValue;
    fat: NutritionValue;
    fiber: NutritionValue;
  };
}
