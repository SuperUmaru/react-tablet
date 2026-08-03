import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Brand({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="brand" aria-label={t('brand')}>
      <span className="brand-mark"><Sparkles aria-hidden="true" size={compact ? 20 : 24} /></span>
      <span className="brand-word">{t('brand')}</span>
    </div>
  );
}

