<script lang="ts">
  import type { Locale } from '../types';
  import { order } from '../stores/order.svelte';
  import { scaleValue } from '../lib/nutrition';

  let { locale }: { locale: Locale } = $props();
</script>

{#if order.items.length > 0}
  <div class="bg-white rounded-lg shadow-sm p-4">
    <h2 class="font-bold text-gray-900 mb-3 text-sm">
      {locale === 'ja' ? '選択中' : 'Selected'}
    </h2>
    {#each order.items as { item, qty } (item.id)}
      <div class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">
            {locale === 'ja' ? item.name : item.name_en}
            {#if qty > 1}
              <span class="text-gray-500 font-normal">× {qty}</span>
            {/if}
          </p>
          <div class="text-xs text-gray-500 flex flex-wrap gap-x-3 mt-0.5">
            <span>{scaleValue(item.nutrition.calories, qty)} kcal</span>
            <span>{locale === 'ja' ? '炭' : 'C'} {scaleValue(item.nutrition.carbs, qty)}g</span>
            <span>P {scaleValue(item.nutrition.protein, qty)}g</span>
            <span>{locale === 'ja' ? '脂' : 'F'} {scaleValue(item.nutrition.fat, qty)}g</span>
            <span>{locale === 'ja' ? '繊' : 'Fb'} {scaleValue(item.nutrition.fiber, qty)}g</span>
          </div>
        </div>
        <button
          onclick={() => order.remove(item.id)}
          class="ml-4 text-red-500 text-xs hover:text-red-700 shrink-0"
          aria-label="remove"
        >
          {locale === 'ja' ? '削除' : 'Remove'}
        </button>
      </div>
    {/each}
  </div>
{/if}
