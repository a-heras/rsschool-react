import { vi } from 'vitest';
import { buildSearchHref } from '@/lib/search/buildSearchPath';
import { pushMock } from './mockNextNavigation';

function parseQ(value: FormDataEntryValue | null): string {
    return typeof value === 'string' ? value : '';
}

function parsePage(value: FormDataEntryValue | null): number {
    return Math.max(1, Number(value) || 1);
}

export const submitSearchActionMock = vi.fn(
    async (_prevState: unknown, formData: FormData) => {
        const q = parseQ(formData.get('q')).trim();
        const currentQ = parseQ(formData.get('currentQ')).trim();

        if (q === currentQ) {
            return null;
        }

        pushMock(buildSearchHref('/', { q, page: 1 }));
        return null;
    }
);

export const selectDetailsActionMock = vi.fn(async (formData: FormData) => {
    const detailsId = String(formData.get('detailsId') ?? '');
    const currentDetailsId = parseQ(formData.get('currentDetailsId')) || null;
    const q = parseQ(formData.get('q'));
    const page = parsePage(formData.get('page'));

    if (!detailsId || detailsId === 'undefined') {
        return;
    }

    const nextDetailsId =
        currentDetailsId === detailsId ? null : detailsId;

    pushMock(buildSearchHref('/', { q, page, detailsId: nextDetailsId }));
});

export const closeDetailsActionMock = vi.fn(async (formData: FormData) => {
    const q = parseQ(formData.get('q'));
    const page = parsePage(formData.get('page'));

    pushMock(buildSearchHref('/', { q, page }));
});

vi.mock('@/actions/search', () => ({
    submitSearchAction: (
        prevState: unknown,
        formData: FormData
    ) => submitSearchActionMock(prevState, formData),
    selectDetailsAction: (formData: FormData) =>
        selectDetailsActionMock(formData),
    closeDetailsAction: (formData: FormData) =>
        closeDetailsActionMock(formData),
}));
