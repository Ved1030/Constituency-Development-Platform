// Moved to i18n-core.ts to resolve module-resolution collision with use-translation.tsx.
// This file is kept as a re-export to avoid breaking any deep imports.
export {
  I18nContext,
  LOCALE_STORAGE_KEY,
  LOCALE_COOKIE,
  translations,
  ensureLocale,
  getNestedValue,
  useTranslation,
} from "./i18n-core";
export type { I18nContextValue } from "./i18n-core";
