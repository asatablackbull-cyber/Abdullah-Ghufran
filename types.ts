export interface MacroData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionResult {
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  description: string;
  detailedFoods?: FoodItem[];
}

export interface AppState {
  view: 'landing' | 'analyzer';
  isAnalyzing: boolean;
  result: NutritionResult | null;
  error: string | null;
}