'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearSelectedItems } from '@/store/searchSlice';
import { SelectedItemsFlyout } from '@/components/SelectedItemsFlyout/SelectedItemsFlyout';

export function SelectedItemsFlyoutContainer() {
    const dispatch = useAppDispatch();
    const selectedItems = useAppSelector((state) => state.search.selectedItems);

    return (
        <SelectedItemsFlyout
            count={selectedItems.length}
            selectedItems={selectedItems}
            onUnselectAll={() => dispatch(clearSelectedItems())}
        />
    );
}
