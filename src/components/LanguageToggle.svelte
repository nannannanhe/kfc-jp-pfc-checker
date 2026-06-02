<script lang="ts">
  import type { Locale } from '../types';

  let { locale = $bindable() }: { locale: Locale } = $props();
</script>

<button
  onclick={() => {
    locale = locale === 'ja' ? 'en' : 'ja';
  }}
  class="px-3 py-1 bg-white text-primary rounded font-medium text-sm hover:bg-blue-50 transition-colors"
>
  {locale === 'ja' ? 'English' : '日本語'}
</button>
