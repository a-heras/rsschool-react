'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { Pagination } from '@/components/Pagination/Pagination';
import { ErrorButton } from '@/components/ErrorButton/ErrorButton';
import { buildSearchHref } from '@/lib/search/buildSearchPath';

type SearchResultsFooterProps = {
    page: number;
    q: string;
    detailsId: string | null;
    total: number;
    maxPage: number;
};

export function SearchResultsFooter({
    page,
    q,
    detailsId,
    total,
    maxPage,
}: SearchResultsFooterProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handlePageChange = (newPage: number) => {
        router.push(
            buildSearchHref(pathname, {
                q,
                page: newPage,
                detailsId,
            })
        );
    };

    return (
        <>
            {total > 0 && (
                <Pagination
                    page={page}
                    maxPage={maxPage}
                    onPageChange={handlePageChange}
                />
            )}
            <ErrorButton />
        </>
    );
}
