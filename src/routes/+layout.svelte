<script lang="ts">
  import { initLanguage } from '$lib/example/i18n/index.js';
  import type { LayoutData } from './$types.js';

  export let data: LayoutData;

  initLanguage(data.language);
</script>

<slot />
