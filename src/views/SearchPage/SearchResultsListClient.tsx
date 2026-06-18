'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { CardList } from '@/components/CardList/CardList';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleItemSelection } from '@/store/searchSlice';
import { buildSearchHref } from '@/lib/search/buildSearchPath';
import type { Item } from '@/types/item';

type SearchResultsListClientProps = {
    items: Item[];
    page: number;
    q: string;
    detailsId: string | null;
};

export function SearchResultsListClient({
    items,
    page,
    q,
    detailsId,
}: SearchResultsListClientProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const selectedItems = useAppSelector((state) => state.search.selectedItems);

    const openDetails = (id: string) => {
        if (!id || id === 'undefined') {
            return;
        }

        if (detailsId === id) {
            router.push(buildSearchHref(pathname, { q, page }));
            return;
        }

        router.push(
            buildSearchHref(pathname, {
                q,
                page,
                detailsId: id,
            })
        );
    };

    return (
        <CardList
            items={items}
            selectedItems={selectedItems}
            onToggleSelect={(item) => dispatch(toggleItemSelection(item))}
            onOpenDetails={openDetails}
        />
    );
}
