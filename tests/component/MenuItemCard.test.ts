import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, beforeEach } from 'vitest';
import MenuItemCard from '../../src/components/MenuItemCard.svelte';
import { order } from '../../src/stores/order.svelte';
import type { MenuItem } from '../../src/types';

const baseItem: MenuItem = {
  id: 'test-chicken',
  name: 'テストチキン',
  name_en: 'Test Chicken',
  category: 'chicken',
  nutrition: {
    calories: 218,
    carbs: 9.1,
    protein: 16.5,
    fat: 12.8,
    fiber: null,
  },
};

beforeEach(() => {
  order.clear();
});

describe('MenuItemCard', () => {
  it('displays Japanese name in ja locale', () => {
    render(MenuItemCard, { item: baseItem, locale: 'ja' });
    expect(screen.getByText('テストチキン')).toBeInTheDocument();
  });

  it('displays English name in en locale', () => {
    render(MenuItemCard, { item: baseItem, locale: 'en' });
    expect(screen.getByText('Test Chicken')).toBeInTheDocument();
  });

  it('displays "-" for null fiber value', () => {
    render(MenuItemCard, { item: baseItem, locale: 'ja' });
    expect(screen.getByText(/繊 -g/)).toBeInTheDocument();
  });

  it('displays 脂 label for fat in ja locale', () => {
    render(MenuItemCard, { item: baseItem, locale: 'ja' });
    expect(screen.getByText(/脂 12\.8g/)).toBeInTheDocument();
  });

  it('displays F label for fat in en locale', () => {
    render(MenuItemCard, { item: baseItem, locale: 'en' });
    expect(screen.getByText(/F 12\.8g/)).toBeInTheDocument();
  });

  it('shows calories in the card', () => {
    render(MenuItemCard, { item: baseItem, locale: 'ja' });
    expect(screen.getByText(/218 kcal/)).toBeInTheDocument();
  });

  it('clicking + adds item to order', async () => {
    render(MenuItemCard, { item: baseItem, locale: 'ja' });
    const addBtn = screen.getByLabelText('add');
    await fireEvent.click(addBtn);
    expect(order.items).toHaveLength(1);
    expect(order.items[0].qty).toBe(1);
  });

  it('clicking + twice sets qty to 2', async () => {
    render(MenuItemCard, { item: baseItem, locale: 'ja' });
    const addBtn = screen.getByLabelText('add');
    await fireEvent.click(addBtn);
    await fireEvent.click(addBtn);
    expect(order.items[0].qty).toBe(2);
  });

  it('clicking − removes item when qty reaches 0', async () => {
    render(MenuItemCard, { item: baseItem, locale: 'ja' });
    const addBtn = screen.getByLabelText('add');
    await fireEvent.click(addBtn);
    const decBtn = screen.getByLabelText('decrease');
    await fireEvent.click(decBtn);
    expect(order.items).toHaveLength(0);
  });
});
