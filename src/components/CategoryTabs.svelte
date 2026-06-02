<script lang="ts">
  import type { Category, Locale } from '../types';
  import { getCategoryLabel } from '../lib/i18n';

  let { activeCategory = $bindable(), locale }: { activeCategory: Category; locale: Locale } =
    $props();

  const categories: Category[] = ['chicken', 'burger', 'sides', 'drink'];
</script>

<div class="flex border-b border-gray-200 mb-4">
  {#each categories as category}
    <button
      onclick={() => {
        activeCategory = category;
      }}
      class="px-4 py-2 text-sm font-medium transition-colors {activeCategory === category
        ? 'border-b-2 border-primary text-primary'
        : 'text-gray-500 hover:text-gray-700'}"
    >
      {getCategoryLabel(category, locale)}
    </button>
  {/each}
</div>
