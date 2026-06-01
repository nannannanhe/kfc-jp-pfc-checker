<script lang="ts">
  import type { Category, Locale } from './types';
  import { loadMenuItems, getDataDate } from './lib/nutrition';
  import LanguageToggle from './components/LanguageToggle.svelte';
  import CategoryTabs from './components/CategoryTabs.svelte';
  import MenuList from './components/MenuList.svelte';
  import SelectedList from './components/SelectedList.svelte';
  import TotalRow from './components/TotalRow.svelte';

  let locale: Locale = $state('ja');
  let activeCategory: Category = $state('chicken');

  const allItems = loadMenuItems();
  const visibleItems = $derived(allItems.filter((i) => i.category === activeCategory));
  const dataDate = getDataDate();
</script>

<div class="min-h-screen bg-gray-50">
  <header class="bg-primary text-white px-4 py-3 flex justify-between items-center sticky top-0 z-10 shadow">
    <h1 class="text-base font-bold">KFC Japan PFC Checker</h1>
    <LanguageToggle bind:locale />
  </header>
  <div class="bg-blue-50 border-b border-blue-200 text-xs text-center text-gray-600 px-4 py-1.5">
    栄養成分データは
    <a href="https://www.kfc.co.jp/food_information" target="_blank" rel="noopener noreferrer"
      class="underline text-primary">KFC Japan 公式栄養成分表</a
    >
    に基づきます（更新日: {dataDate}）
  </div>

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
