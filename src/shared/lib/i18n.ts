import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const namespaces = [
  'common',
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
    resources: {},
  });

export default i18n;
