'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Search } from '@/components/Search/Search';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchTerm } from '@/store/searchSlice';
import { buildSearchHref } from '@/lib/search/buildSearchPath';

type SearchPageToolbarProps = {
    q: string;
    detailsId: string | null;
    onRefresh?: () => void;
};

export function SearchPageToolbar({
    q,
    detailsId,
    onRefresh,
}: SearchPageToolbarProps) {
    const t = useTranslations('search');
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const searchTerm = useAppSelector((state) => state.search.searchTerm);

    useEffect(() => {
        if (q !== searchTerm) {
            dispatch(setSearchTerm(q));
            localStorage.setItem('searchTerm', q);
        }
    }, [dispatch, q, searchTerm]);

    useEffect(() => {
        const saved = localStorage.getItem('searchTerm') ?? '';

        if (!q && saved) {
            router.replace(
                buildSearchHref(pathname, { q: saved, page: 1, detailsId })
            );
        }
    }, [detailsId, pathname, q, router]);

    const handleSearch = (term: string) => {
        const trimmed = term.trim();

        if (trimmed === q) {
            return;
        }

        dispatch(setSearchTerm(trimmed));
        localStorage.setItem('searchTerm', trimmed);
        router.push(buildSearchHref(pathname, { q: trimmed, page: 1 }));
    };

    const handleRefreshList = () => {
        onRefresh?.();
        router.refresh();
    };

    return (
        <div className="top-controls">
            <Search key={q} savedTerm={q} onSearch={handleSearch} />
            <button
                type="button"
                className="btn btn--on-dark"
                onClick={handleRefreshList}
                aria-label={t('refreshAria')}
            >
                {t('refresh')}
            </button>
        </div>
    );
}
