<script lang="ts">
  import type { Category, Locale } from './types';
  import { loadMenuItems } from './lib/nutrition';
  import LanguageToggle from './components/LanguageToggle.svelte';
  import CategoryTabs from './components/CategoryTabs.svelte';
  import MenuList from './components/MenuList.svelte';
  import SelectedList from './components/SelectedList.svelte';
  import TotalRow from './components/TotalRow.svelte';

  let locale: Locale = $state('ja');
  let activeCategory: Category = $state('chicken');

  const allItems = loadMenuItems();
  const visibleItems = $derived(allItems.filter((i) => i.category === activeCategory));
</script>

<div class="min-h-screen bg-gray-50">
  <header class="bg-red-600 text-white px-4 py-3 flex justify-between items-center sticky top-0 z-10 shadow">
    <h1 class="text-base font-bold">KFC Japan PFC Checker</h1>
    <LanguageToggle bind:locale />
  </header>

  <main class="max-w-xl mx-auto px-4 py-4 pb-8">
    <section>
      <CategoryTabs bind:activeCategory {locale} />
      <MenuList items={visibleItems} {locale} />
    </section>

    <section class="mt-6">
      <SelectedList {locale} />
      <TotalRow {locale} />
    </section>
  </main>
</div>
