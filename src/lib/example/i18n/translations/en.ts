import { t, p } from '$lib/i18n/index.js';

export const en = {
  app: t`svelte-lang`,

  'Something went wrong': t`Something went wrong`,
  'Welcome $firstName $lastName': t`Welcome ${p('firstName')} ${p('lastName')}`
} as const;
