'use client';

import { useTranslations } from 'next-intl';

export function ErrorFallback() {
    const t = useTranslations('error');

    return (
        <div style={{ padding: '20px', color: 'darkred' }}>
            <h2>{t('title')}</h2>
            <p>{t('description')}</p>
        </div>
    );
}
