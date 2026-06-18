'use client';

import { useTranslations } from 'next-intl';
import './SelectedItemsFlyout.css';

interface SelectedItemsFlyoutProps {
    count: number;
    onUnselectAll: () => void;
    onDownload: () => void;
}

export function SelectedItemsFlyout({
    count,
    onUnselectAll,
    onDownload,
}: SelectedItemsFlyoutProps) {
    const t = useTranslations('flyout');

    if (count === 0) return null;

    const countLabel =
        count === 1 ? t('oneSelected') : t('manySelected', { count });

    return (
        <div className="flyout" role="region" aria-label={t('ariaLabel')}>
            <p className="flyout-count">{countLabel}</p>
            <div className="flyout-actions">
                <button
                    type="button"
                    className="btn btn--on-dark"
                    onClick={onUnselectAll}
                >
                    {t('unselectAll')}
                </button>
                <button
                    type="button"
                    className="btn btn--on-dark"
                    onClick={onDownload}
                >
                    {t('download')}
                </button>
            </div>
        </div>
    );
}
