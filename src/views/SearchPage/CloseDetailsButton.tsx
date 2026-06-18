'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { buildSearchHref } from '@/lib/search/buildSearchPath';

type CloseDetailsButtonProps = {
    page: number;
    q: string;
};

export function CloseDetailsButton({ page, q }: CloseDetailsButtonProps) {
    const t = useTranslations('details');
    const router = useRouter();
    const pathname = usePathname();

    const closeDetails = () => {
        router.push(buildSearchHref(pathname, { q, page }));
    };

    return (
        <button
            type="button"
            className="btn btn--on-dark close-btn"
            onClick={closeDetails}
            aria-label={t('closeAria')}
        >
            <span aria-hidden="true">×</span>
        </button>
    );
}
