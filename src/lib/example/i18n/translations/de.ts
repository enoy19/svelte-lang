import { t, p } from '$lib/i18n/index.js';

export const de = {
  app: t`svelte-lang`,

  'Something went wrong': t`Etwas ist schief gelaufen`,
  'Welcome $name': t`Willkommen ${p('name')}`
} as const;
