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
    {#if locale === 'ja'}
      栄養成分データは
      <a href="https://www.kfc.co.jp/food_information" target="_blank" rel="noopener noreferrer"
        class="underline text-primary">KFC Japan 公式栄養成分表</a
      >
      に基づきます（掲載データ更新日: {dataDate}）
    {:else}
      Nutrition data is based on the
      <a href="https://www.kfc.co.jp/food_information" target="_blank" rel="noopener noreferrer"
        class="underline text-primary">KFC Japan official nutrition table</a
      >
      (Data updated: {dataDate})
    {/if}
  </div>

  <main class="max-w-5xl mx-auto px-4 py-4 pb-8 flex flex-col md:grid md:grid-cols-[1fr_380px] md:gap-6 md:items-start">
    <section data-testid="selection-section" class="order-1 md:order-2 mb-6 md:mb-0 md:sticky md:top-[52px]">
      <SelectedList {locale} />
      <TotalRow {locale} />
    </section>

    <section data-testid="menu-section" class="order-2 md:order-1">
      <CategoryTabs bind:activeCategory {locale} />
      <MenuList items={visibleItems} {locale} />
    </section>
  </main>

  <footer class="flex justify-center px-4 py-2">
    <a
      href="https://nannannanhe.github.io/"
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
      nannannanhe.github.io
    </a>
  </footer>
</div>
