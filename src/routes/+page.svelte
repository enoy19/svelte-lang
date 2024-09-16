<script lang="ts">
  import { language, supportedLanguages, t, tUnsafe } from '$lib/example/i18n/index.js';

  let firstName = 'John';
  let lastName = 'Doe';
  let unsafeKey = 'app';
  let inlineParamsKey = 'Welcome $firstName $lastName({"firstName": "John", "lastName": "Doe"})';
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
    <label for="firstName">First Name:</label>
    <input id="firstName" type="text" bind:value={firstName} />

    <label for="lastName">Last Name:</label>
    <input id="lastName" type="text" bind:value={lastName} />

    <p>{$t('Welcome $firstName $lastName', { firstName, lastName })}</p>
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
