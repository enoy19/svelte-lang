import type { Translations } from '$lib/i18n/index.js';
import type { Handle } from '@sveltejs/kit';
import { pick } from 'accept-language-parser';

export function i18nHook<
  TTranslations extends Translations,
  TDefaultLanguage extends keyof TTranslations
>(translations: TTranslations, defaultLanguage: TDefaultLanguage) {
  return (async ({ event, resolve }) => {
    const supportedLanguages = Object.keys(translations);

    const acceptLanguageHeader =
      event.request.headers.get('Accept-Language') ?? event.request.headers.get('accept-language');

    let language = String(defaultLanguage);

    if (acceptLanguageHeader) {
      language = String(pick(supportedLanguages, acceptLanguageHeader) ?? defaultLanguage);
    }

    event.locals.language = language;

    return resolve(event);
  }) satisfies Handle;
}
