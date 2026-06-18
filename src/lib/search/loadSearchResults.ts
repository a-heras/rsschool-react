import { loadData, loadDetails } from '@/api/api';
import { ITEMS_PER_PAGE } from '@/config/pagination';
import type { Item } from '@/types/item';

export type SearchListResult =
    | { ok: true; items: Item[]; total: number; maxPage: number }
    | { ok: false; error: true };

export type SearchDetailsResult =
    | { ok: true; item: Item }
    | { ok: false; error: true };

export async function loadSearchList(
    q: string,
    page: number
): Promise<SearchListResult> {
    try {
        const { items, total } = await loadData(q, page);
        const maxPage = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
        const clampedPage = page > maxPage && total > 0 ? maxPage : page;

        if (clampedPage !== page) {
            const refetch = await loadData(q, clampedPage);
            return {
                ok: true,
                items: refetch.items,
                total: refetch.total,
                maxPage,
            };
        }

        return { ok: true, items, total, maxPage };
    } catch {
        return { ok: false, error: true };
    }
}

export async function loadSearchDetails(
    detailsId: string | null
): Promise<SearchDetailsResult | null> {
    if (!detailsId) {
        return null;
    }

    try {
        const item = await loadDetails(detailsId);
        return { ok: true, item };
    } catch {
        return { ok: false, error: true };
    }
}
