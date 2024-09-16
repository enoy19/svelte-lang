import { setupI18n } from '$lib/i18n/index.js';
import { get } from 'svelte/store';
import { de } from './translations/de.js';
import { en } from './translations/en.js';

export const translations = {
  de,
  en
} as const;

export const { t, language, supportedLanguages, tUnsafe, initLanguage } = setupI18n(
  translations,
  'de',
  { languagePersisted: true }
);
