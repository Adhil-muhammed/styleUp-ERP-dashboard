import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const namespaces = [
  'common',
  'auth',
  'dashboard',
  'user-management',
  'merchant-management',
  'staff-management',
  'service-catalog',
  'package-management',
  'booking-management',
  'calendar-scheduling',
  'payments',
  'promotions',
  'reviews',
  'messaging',
  'notifications',
  'loyalty',
  'media-library',
  'reports-analytics',
  'system-configuration',
  'role-permission',
  'audit-logs',
] as const;

type LocaleResource = Record<string, unknown>;

const localeModules = import.meta.glob<{ default: LocaleResource }>(
  '../../locales/*/*.json',
  { eager: true },
);

const resources: Record<string, Record<string, LocaleResource>> = {};

for (const path of Object.keys(localeModules)) {
  const match = /\/locales\/([\w-]+)\/([\w-]+)\.json$/.exec(path);
  if (!match) {
    continue;
  }
  const [, lng, ns] = match;
  resources[lng] ??= {};
  resources[lng][ns] = localeModules[path].default;
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ml'],
    ns: namespaces,
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    resources,
  });

export default i18n;
