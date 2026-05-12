import type { MenuItem } from '../types';

export interface OrderItem {
  item: MenuItem;
  qty: number;
}

let items = $state<OrderItem[]>([]);

function removeItem(itemId: string): void {
  const idx = items.findIndex((o) => o.item.id === itemId);
  if (idx !== -1) items.splice(idx, 1);
}

export const order = {
  get items() {
    return items;
  },

  add(item: MenuItem): void {
    const existing = items.find((o) => o.item.id === item.id);
    if (existing) {
      existing.qty++;
    } else {
      items.push({ item, qty: 1 });
    }
  },

  remove: removeItem,

  setQty(itemId: string, qty: number): void {
    if (qty <= 0) {
      removeItem(itemId);
      return;
    }
    const existing = items.find((o) => o.item.id === itemId);
    if (existing) existing.qty = qty;
  },

  clear(): void {
    items.splice(0, items.length);
  },
};
