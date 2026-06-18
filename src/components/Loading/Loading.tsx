'use client';

import { useTranslations } from 'next-intl';
import './Loading.css';

export function Loading() {
    const t = useTranslations('loading');

    return <div className="loading">{t('text')}</div>;
}
