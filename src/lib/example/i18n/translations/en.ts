import { t, p } from '$lib/i18n/index.js';

export const en = {
  app: t`svelte-lang`,

  'Something went wrong': t`Something went wrong`,
  'Welcome $name': t`Welcome ${p('name')}`
} as const;
