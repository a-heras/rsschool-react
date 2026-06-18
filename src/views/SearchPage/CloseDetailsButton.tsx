'use client';

import { useTranslations } from 'next-intl';
import { closeDetailsAction } from '@/actions/search';

type CloseDetailsButtonProps = {
    page: number;
    q: string;
};

export function CloseDetailsButton({ page, q }: CloseDetailsButtonProps) {
    const t = useTranslations('details');

    return (
        <form action={closeDetailsAction}>
            <input type="hidden" name="q" value={q} />
            <input type="hidden" name="page" value={String(page)} />
            <button
                type="submit"
                className="btn btn--on-dark close-btn"
                aria-label={t('closeAria')}
            >
                <span aria-hidden="true">×</span>
            </button>
        </form>
    );
}
