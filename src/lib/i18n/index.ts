import { persisted } from 'svelte-persisted-store';
import { writable, derived, type Writable, type Readable, get } from 'svelte/store';

export function p<T extends string>(name: T) {
  return { type: 'param', name } as const;
}

type ParamPlaceholder = ReturnType<typeof p>;

export function t<T extends ParamPlaceholder>(strings: TemplateStringsArray, ...values: T[]) {
  return { strings, values } as const;
}

type ExtractParams<T extends readonly any[]> = T extends { type: 'param'; name: infer Name }[]
  ? Name
  : never;

type TranslationEntry = ReturnType<typeof t>;

type TranslationsPerLanguage = Record<string, TranslationEntry>;

export type Translations = Record<string, TranslationsPerLanguage>;

const inlineParameterRegex = /\(({.*})\)$/;

export function setupI18n<
  TTranslations extends Translations,
  TDefaultLanguage extends keyof TTranslations
>(
  translations: TTranslations,
  defaultLanguage: TDefaultLanguage,
  options?: { languagePersisted?: boolean }
) {
  const language: Writable<keyof TTranslations> = options?.languagePersisted
    ? persisted('svelte-lang', defaultLanguage)
    : writable(defaultLanguage);
  const supportedLanguages = Object.keys(translations) as (keyof TTranslations)[];

  // Derived translation function
  const tFunction: Readable<
    <
      TKey extends keyof TTranslations[TDefaultLanguage],
      TParams extends Record<ExtractParams<TTranslations[TDefaultLanguage][TKey]['values']>, any>
    >(
      key: TKey,
      params?: TParams
    ) => string
  > = derived(language, ($language) => {
    return function (key: any, params: any) {
      const currentTranslations = translations[$language as keyof TTranslations];

      const inlineParametersMatcher = inlineParameterRegex.exec(key);
      if (inlineParametersMatcher && inlineParametersMatcher.length === 2) {
        try {
          console.debug(`[svelte-lang] Found inline parameter: ${key}`);
          console.debug(`[svelte-lang] Inline parameter: ${inlineParametersMatcher[1]}`);
          const inlineParameters = JSON.parse(inlineParametersMatcher[1]);
          key = key.replace(inlineParameterRegex, '');
          params = { ...inlineParameters, params };
        } catch (error) {
          console.error(`[svelte-lang] Failed to parse inline parameter: ${key}`);
        }
      }

      const translation = currentTranslations[key as string];

      if (!translation) {
        console.warn(
          `[svelte-lang] Missing translation for key "${String(key)}" in language "${String($language)}"`
        );
        return `{${String(key)}}`;
      }

      const { strings, values } = translation;
      let result = '';

      for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
          const value = values[i];
          if (value.type === 'param') {
            const paramValue = params?.[value.name];
            if (paramValue !== undefined) {
              result += paramValue;
            } else {
              result += `$${value.name}`;
              console.warn(
                `[svelte-lang] Missing parameter "${value.name}" for key "${String(key)}"`
              );
            }
          } else {
            result += value;
          }
        }
      }
      return result;
    };
  });

  const tUnsafe = derived(tFunction, (tFunction) => {
    return (key: string, params?: Record<string, unknown> | undefined | null) =>
      tFunction(key, params as any);
  });

  const initLanguage = (lang: string) => {
    language.set(lang);
  };

  return { t: tFunction, language, supportedLanguages, tUnsafe, initLanguage };
}
