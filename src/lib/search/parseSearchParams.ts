export type ParsedSearchParams = {
    page: number;
    q: string;
    detailsId: string | null;
};

export function parseSearchParams(
    searchParams: Record<string, string | string[] | undefined>
): ParsedSearchParams {
    const page = Math.max(1, Number(searchParams.page) || 1);
    const rawQ = searchParams.q;
    const q = typeof rawQ === 'string' ? rawQ : '';
    const rawDetails = searchParams.details;
    const detailsId =
        typeof rawDetails === 'string' && rawDetails !== 'undefined'
            ? rawDetails
            : null;

    return { page, q, detailsId };
}
