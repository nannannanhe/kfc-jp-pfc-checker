<script lang="ts">
  import type { MenuItem, Locale } from '../types';
  import { formatValue } from '../lib/nutrition';
  import { order } from '../stores/order.svelte';

  let { item, locale }: { item: MenuItem; locale: Locale } = $props();

  const orderItem = $derived(order.items.find((o) => o.item.id === item.id));
  const qty = $derived(orderItem?.qty ?? 0);
</script>

<div class="bg-white rounded-lg p-4 shadow-sm">
  <div class="flex justify-between items-start gap-4">
    <div class="flex-1 min-w-0">
      <p class="font-medium text-gray-900 text-sm leading-snug">
        {locale === 'ja' ? item.name : item.name_en}
      </p>
      <div class="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
        <span>{formatValue(item.nutrition.calories)} kcal</span>
        <span>{locale === 'ja' ? '炭' : 'C'} {formatValue(item.nutrition.carbs)}g</span>
        <span>P {formatValue(item.nutrition.protein)}g</span>
        <span>F {formatValue(item.nutrition.fat)}g</span>
        <span>{locale === 'ja' ? '繊' : 'Fb'} {formatValue(item.nutrition.fiber)}g</span>
      </div>
    </div>
    <div class="flex items-center gap-1.5 shrink-0">
      {#if qty > 0}
        <button
          onclick={() => order.setQty(item.id, qty - 1)}
          class="w-7 h-7 rounded-full bg-gray-100 text-gray-700 font-bold text-lg leading-none hover:bg-gray-200 transition-colors"
          aria-label="decrease"
        >
          −
        </button>
        <span class="w-5 text-center text-sm font-semibold">{qty}</span>
      {/if}
      <button
        onclick={() => order.add(item)}
        class="w-7 h-7 rounded-full bg-primary text-white font-bold text-lg leading-none hover:bg-primary-hover transition-colors"
        aria-label="add"
      >
        +
      </button>
    </div>
  </div>
</div>
