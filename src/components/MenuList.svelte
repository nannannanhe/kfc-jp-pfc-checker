<script lang="ts">
  import type { MenuItem, Locale } from '../types';
  import MenuItemCard from './MenuItemCard.svelte';

  let { items, locale }: { items: MenuItem[]; locale: Locale } = $props();
</script>

<div class="flex flex-col gap-2">
  {#each items as item (item.id)}
    <MenuItemCard {item} {locale} />
  {/each}
</div>
