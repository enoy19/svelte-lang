import { translations } from '$lib/example/i18n/index.js';
import { i18nHook } from '$lib/i18n/hooks.server.js';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = i18nHook(translations, 'de');
