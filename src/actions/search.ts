'use server';

import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { buildSearchHref } from '@/lib/search/buildSearchPath';

export type SearchActionState = {
    error?: string;
} | null;

type SearchRedirectParams = {
    q?: string;
    page?: number;
    detailsId?: string | null;
};

function parsePage(value: FormDataEntryValue | null): number {
    return Math.max(1, Number(value) || 1);
}

function parseQ(value: FormDataEntryValue | null): string {
    return typeof value === 'string' ? value : '';
}

async function redirectToSearch(params: SearchRedirectParams) {
    const locale = await getLocale();

    redirect({
        href: buildSearchHref('/', params),
        locale,
    });
}

export async function submitSearchAction(
    _prevState: SearchActionState,
    formData: FormData
): Promise<SearchActionState> {
    const q = parseQ(formData.get('q')).trim();
    const currentQ = parseQ(formData.get('currentQ')).trim();

    if (q === currentQ) {
        return null;
    }

    await redirectToSearch({ q, page: 1 });
    return null;
}

export async function selectDetailsAction(formData: FormData): Promise<void> {
    const detailsId = String(formData.get('detailsId') ?? '');
    const currentDetailsId = parseQ(formData.get('currentDetailsId')) || null;
    const q = parseQ(formData.get('q'));
    const page = parsePage(formData.get('page'));

    if (!detailsId || detailsId === 'undefined') {
        return;
    }

    const nextDetailsId =
        currentDetailsId === detailsId ? null : detailsId;

    await redirectToSearch({ q, page, detailsId: nextDetailsId });
}

export async function closeDetailsAction(formData: FormData): Promise<void> {
    const q = parseQ(formData.get('q'));
    const page = parsePage(formData.get('page'));

    await redirectToSearch({ q, page });
}
