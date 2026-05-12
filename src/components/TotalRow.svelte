<script lang="ts">
  import type { Locale } from '../types';
  import { order } from '../stores/order.svelte';
  import { calcTotal } from '../lib/nutrition';

  let { locale }: { locale: Locale } = $props();

  const total = $derived(calcTotal(order.items));
</script>

{#if order.items.length > 0}
  <div class="bg-red-600 text-white rounded-lg p-4 mt-4">
    <h2 class="font-bold text-sm mb-2">{locale === 'ja' ? '合計' : 'Total'}</h2>
    <div class="grid grid-cols-3 gap-y-1 text-sm sm:flex sm:gap-4">
      <div>
        <span class="text-red-200 text-xs">{locale === 'ja' ? 'カロリー' : 'Calories'}</span>
        <p class="font-semibold">{total.calories.toFixed(1)} kcal</p>
      </div>
      <div>
        <span class="text-red-200 text-xs">{locale === 'ja' ? '炭水化物' : 'Carbs'}</span>
        <p class="font-semibold">{total.carbs.toFixed(1)} g</p>
      </div>
      <div>
        <span class="text-red-200 text-xs">{locale === 'ja' ? 'タンパク質' : 'Protein'}</span>
        <p class="font-semibold">{total.protein.toFixed(1)} g</p>
      </div>
      <div>
        <span class="text-red-200 text-xs">{locale === 'ja' ? '脂質' : 'Fat'}</span>
        <p class="font-semibold">{total.fat.toFixed(1)} g</p>
      </div>
      <div>
        <span class="text-red-200 text-xs">{locale === 'ja' ? '食物繊維' : 'Fiber'}</span>
        <p class="font-semibold">{total.fiber.toFixed(1)} g</p>
      </div>
    </div>
  </div>
{/if}
