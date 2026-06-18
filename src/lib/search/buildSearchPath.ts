type SearchPathParams = {
    q?: string;
    page?: number;
    detailsId?: string | null;
};

export function buildSearchQuery({
    q,
    page,
    detailsId,
}: SearchPathParams): string {
    const sp = new URLSearchParams();

    if (q) {
        sp.set('q', q);
    }

    if (page && page > 1) {
        sp.set('page', String(page));
    }

    if (detailsId) {
        sp.set('details', detailsId);
    }

    return sp.toString();
}

export function buildSearchHref(
    pathname: string,
    params: SearchPathParams
): string {
    const query = buildSearchQuery(params);
    return query ? `${pathname}?${query}` : pathname;
}
