<script lang="ts">
  import { language, supportedLanguages, t, tUnsafe } from '$lib/example/i18n/index.js';

  let name = 'Peter';
  let unsafeKey = 'app';
  let inlineParamsKey = 'Welcome $name({"name": "John"})';
</script>

<main>
  <h1>{$t('app')}</h1>

  <div>
    <select name="language" id="language" bind:value={$language}>
      {#each supportedLanguages as supportedLanguage}
        <option value={supportedLanguage}>{supportedLanguage}</option>
      {/each}
    </select>
  </div>

  <div>
    <label for="name">Name:</label>
    <input id="name" type="text" bind:value={name} />

    <p>{$t('Welcome $name', { name })}</p>
  </div>

  <div>
    <h2>Unsafe:</h2>

    <label for="unsafe-key">Key:</label>
    <input id="unsafe-key" type="text" bind:value={unsafeKey} />

    <p>{$tUnsafe(unsafeKey)}</p>
  </div>

  <div>
    <h2>Inline Params:</h2>

    <label for="inline-params-key">Key:</label>
    <input id="inline-params-key" type="text" bind:value={inlineParamsKey} />

    <p>{$tUnsafe(inlineParamsKey)}</p>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  main div {
    margin-top: 1rem;
    width: 50%;
  }

  main div * {
    width: 100%;
  }
</style>
