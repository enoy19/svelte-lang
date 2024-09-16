# svelte-lang

An internationalization (i18n) library for Svelte applications, designed to make multilingual support simple and efficient.

## Features

- **Simple Setup**: Easily integrate with Svelte applications.
- **Template Literal Translations**: Use template literals for translations, keeping code clean and readable.
- **Parameterized Translations**: Support dynamic parameters within translation strings.
- **Language Persistence**: Optionally persist the selected language in [localstorage](https://github.com/joshnuss/svelte-persisted-store).
- **Automatic Language Detection**: Detect user language preferences from the browser.
- **Inline Parameters**: Support inline parameters in translation keys.
- **Svelte Stores Integration**: Uses Svelte stores for reactive language and translation handling.

## Installation

```bash
npm install svelte-lang
```

## How to Use

### Setup Translations

Create translation files for each language in your project.

**Example: English Translations (`en.ts`)**

```typescript
// src/lib/i18n/translations/en.ts
import { t, p } from 'svelte-lang';

export const en = {
  app: t`svelte-lang`,
  'Something went wrong': t`Something went wrong`,
  'Welcome $name': t`Welcome ${p('name')}`
} as const;
```

**Example: German Translations (`de.ts`)**

```typescript
// src/lib/i18n/translations/de.ts
import { t, p } from 'svelte-lang';

export const de = {
  app: t`svelte-lang`,
  'Something went wrong': t`Etwas ist schief gelaufen`,
  'Welcome $name': t`Willkommen ${p('name')}`
} as const;
```

### Initialize i18n

Set up the i18n configuration in your project.

```typescript
// src/lib/i18n/index.ts
import { setupI18n } from 'svelte-lang';
import { en } from './translations/en';
import { de } from './translations/de';

export const translations = {
  en,
  de
} as const;

export const { t, language, supportedLanguages, tUnsafe, initLanguage } = setupI18n(
  translations,
  'en', // Default language
  { languagePersisted: true } // Persist language selection in localstorage
);
```

### Update `app.d.ts`

Ensure that the `language` property is available in the `App.Locals` interface.

```typescript
// src/app.d.ts
declare global {
  namespace App {
    interface Locals {
      language: string;
    }
  }
}

export {};
```

### Implement Language Detection Hook

Use a server hook to detect and set the user's preferred language.

```typescript
// src/hooks.server.ts
import { translations } from '$lib/i18n';
import { i18nHook } from 'svelte-lang';

export const handle = i18nHook(translations, 'en');
```

#### Add to existing Hook

```typescript
// src/hooks.server.ts
import { translations } from '$lib/i18n';
import { i18nHook } from 'svelte-lang';
import { sequence } from '@sveltejs/kit/hooks';
import { anotherHook } from './anotherHook';

// Combine multiple hooks
export const handle = sequence(
  i18nHook(translations, 'en'),
  anotherHook
  // Add more hooks as needed
);
```

### Initialize Language in Layout

Set the initial language in your root layout.

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { initLanguage } from '$lib/i18n';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  initLanguage(data.language);
</script>

<slot />
```

```typescript
// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  return { language: locals.language };
};
```

### Use Translations in Components

Use the `t` function to retrieve translations in your Svelte components.

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { language, supportedLanguages, t, tUnsafe } from '$lib/i18n';

  let name = 'John';
  let dynamicKey = 'app';
  let inlineParamsKey = 'Welcome $name({"name": "John"})';
</script>

<main>
  <h1>{$t('app')}</h1>

  <div>
    <label for="language">Select Language:</label>
    <select id="language" bind:value={$language}>
      {#each supportedLanguages as lang}
        <option value={lang}>{lang}</option>
      {/each}
    </select>
  </div>

  <div>
    <label for="name">Name:</label>
    <input id="name" type="text" bind:value={name} />
    <p>{$t('Welcome $name', { name })}</p>
  </div>

  <div>
    <h2>Dynamic Key Translation:</h2>
    <label for="dynamic-key">Key:</label>
    <input id="dynamic-key" type="text" bind:value={dynamicKey} />
    <p>{$tUnsafe(dynamicKey)}</p>
  </div>

  <div>
    <h2>Inline Parameters:</h2>
    <label for="inline-params-key">Key:</label>
    <input id="inline-params-key" type="text" bind:value={inlineParamsKey} />
    <p>{$tUnsafe(inlineParamsKey)}</p>
  </div>
</main>
```

### Accessing Translations with Parameters

To include dynamic parameters in your translations, use the `p` function when defining translations and pass the parameters when retrieving them.

**Defining a Translation with Parameters**

```typescript
// In your translation file
'Welcome $name': t`Welcome ${p('name')}`,
```

**Retrieving a Translation with Parameters**

```svelte
<p>{$t('Welcome $name', { name: 'Alice' })}</p>
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs or feature requests.

## License

This project is licensed under the MIT License.
