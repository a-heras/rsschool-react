'use client';

import { CardList } from '@/components/CardList/CardList';
import { selectDetailsAction } from '@/actions/search';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleItemSelection } from '@/store/searchSlice';
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
    const selectedItems = useAppSelector((state) => state.search.selectedItems);

    return (
        <CardList
            items={items}
            selectedItems={selectedItems}
            onToggleSelect={(item) => dispatch(toggleItemSelection(item))}
            selectDetailsAction={selectDetailsAction}
            searchContext={{ q, page, detailsId }}
        />
    );
}
