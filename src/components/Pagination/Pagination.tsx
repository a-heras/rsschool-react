'use client';

import { useTranslations } from 'next-intl';
import './Pagination.css';

interface PaginationProps {
    page: number;
    maxPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ page, maxPage, onPageChange }: PaginationProps) {
    const t = useTranslations('pagination');

    return (
        <div className="pagination">
            <button
                type="button"
                className="btn"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
            >
                {t('prev')}
            </button>

            <span className="pagination-page">{t('page', { page })}</span>

            <button
                type="button"
                className="btn"
                disabled={page >= maxPage}
                onClick={() => onPageChange(page + 1)}
            >
                {t('next')}
            </button>
        </div>
    );
}
