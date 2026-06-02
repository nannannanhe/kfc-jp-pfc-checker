import { describe, it, expect } from 'vitest';
import { calcTotal, formatValue, scaleValue, loadMenuItems, getDataDate } from '../../src/lib/nutrition';
import type { MenuItem } from '../../src/types';

function mockItem(overrides: Partial<MenuItem['nutrition']> = {}): MenuItem {
  return {
    id: 'test-item',
    name: 'テスト',
    name_en: 'Test',
    category: 'chicken',
    nutrition: {
      calories: 200,
      carbs: 10,
      protein: 15,
      fat: 8,
      fiber: 1,
      ...overrides,
    },
  };
}

describe('calcTotal', () => {
  it('returns zeros for empty array', () => {
    expect(calcTotal([])).toEqual({ calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0 });
  });

  it('treats null values as zero in total', () => {
    const item = mockItem({ calories: null, fiber: null });
    const total = calcTotal([{ item, qty: 1 }]);
    expect(total.calories).toBe(0);
    expect(total.fiber).toBe(0);
  });

  it('multiplies values by quantity', () => {
    const item = mockItem();
    const total = calcTotal([{ item, qty: 2 }]);
    expect(total.calories).toBe(400);
    expect(total.protein).toBe(30);
  });

  it('sums multiple items correctly', () => {
    const a = mockItem({ calories: 100 });
    const b = mockItem({ calories: 200 });
    const total = calcTotal([
      { item: a, qty: 1 },
      { item: b, qty: 1 },
    ]);
    expect(total.calories).toBe(300);
  });

  it('handles mixed null and non-null across items', () => {
    const a = mockItem({ fiber: null });
    const b = mockItem({ fiber: 2 });
    const total = calcTotal([
      { item: a, qty: 1 },
      { item: b, qty: 3 },
    ]);
    expect(total.fiber).toBe(6);
  });
});

describe('formatValue', () => {
  it('returns "-" for null', () => {
    expect(formatValue(null)).toBe('-');
  });

  it('returns string for integer', () => {
    expect(formatValue(10)).toBe('10');
  });

  it('returns string for decimal', () => {
    expect(formatValue(10.5)).toBe('10.5');
  });

  it('returns string for zero', () => {
    expect(formatValue(0)).toBe('0');
  });
});

describe('scaleValue', () => {
  it('returns "-" for null', () => {
    expect(scaleValue(null, 3)).toBe('-');
  });

  it('returns scaled integer as string', () => {
    expect(scaleValue(10, 2)).toBe('20');
  });

  it('rounds decimal to 1 place', () => {
    expect(scaleValue(10.5, 2)).toBe('21.0');
  });
});

describe('getDataDate', () => {
  it('returns a non-empty date string', () => {
    const date = getDataDate();
    expect(typeof date).toBe('string');
    expect(date.length).toBeGreaterThan(0);
  });

  it('returns the date from nutrition.json', () => {
    const date = getDataDate();
    expect(date).toMatch(/\d{4}\/\d{1,2}\/\d{1,2}/);
  });
});

describe('loadMenuItems', () => {
  it('loads items with all required fields', () => {
    const items = loadMenuItems();
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.name_en).toBeTruthy();
      expect(['chicken', 'burger', 'sides', 'drink']).toContain(item.category);
    }
  });

  it('generates id in kebab-case from name_en', () => {
    const items = loadMenuItems();
    const original = items.find((i) => i.name_en === 'Original Recipe Chicken');
    expect(original?.id).toBe('original-recipe-chicken');
  });

  it('has no negative nutrition values', () => {
    const items = loadMenuItems();
    for (const item of items) {
      for (const val of Object.values(item.nutrition)) {
        if (val !== null) expect(val).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('maps energy→calories, carbohydrate→carbs, dietary_fiber→fiber', () => {
    const items = loadMenuItems();
    const first = items[0];
    expect(first.nutrition.calories).toBeDefined();
    expect(first.nutrition.carbs).toBeDefined();
    expect(first.nutrition.fiber).toBeDefined();
  });
});
