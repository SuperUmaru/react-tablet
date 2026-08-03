import { Globe2 } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher({ light = false }: { light?: boolean }) {
  const { i18n, t } = useTranslation();
  useEffect(() => { document.documentElement.lang = i18n.resolvedLanguage?.split('-')[0] ?? 'en'; }, [i18n.resolvedLanguage]);
  return (
    <label className={`language-switcher ${light ? 'language-switcher--light' : ''}`}>
      <Globe2 size={18} aria-hidden="true" />
      <span className="sr-only">{t('common.language')}</span>
      <select
        value={i18n.resolvedLanguage?.split('-')[0] ?? 'en'}
        onChange={(event) => void i18n.changeLanguage(event.target.value)}
        aria-label={t('common.language')}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </label>
  );
}
