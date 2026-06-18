import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    submitSearchAction,
    selectDetailsAction,
    closeDetailsAction,
} from './search';

const redirectMock = vi.fn();
const getLocaleMock = vi.fn(async () => 'en');

vi.mock('@/i18n/navigation', () => ({
    redirect: (...args: unknown[]) => redirectMock(...args),
}));

vi.mock('next-intl/server', () => ({
    getLocale: () => getLocaleMock(),
}));

describe('search server actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('submitSearchAction redirects with trimmed query on new search', async () => {
        const formData = new FormData();
        formData.set('q', '  hello  ');
        formData.set('currentQ', '');

        await submitSearchAction(null, formData);

        expect(redirectMock).toHaveBeenCalledWith({
            href: '/?q=hello',
            locale: 'en',
        });
    });

    it('submitSearchAction does not redirect when query is unchanged', async () => {
        const formData = new FormData();
        formData.set('q', 'same');
        formData.set('currentQ', 'same');

        const result = await submitSearchAction(null, formData);

        expect(result).toBeNull();
        expect(redirectMock).not.toHaveBeenCalled();
    });

    it('selectDetailsAction redirects with details id', async () => {
        const formData = new FormData();
        formData.set('detailsId', '42');
        formData.set('currentDetailsId', '');
        formData.set('q', 'term');
        formData.set('page', '2');

        await selectDetailsAction(formData);

        expect(redirectMock).toHaveBeenCalledWith({
            href: '/?q=term&page=2&details=42',
            locale: 'en',
        });
    });

    it('selectDetailsAction clears details when the same item is selected', async () => {
        const formData = new FormData();
        formData.set('detailsId', '42');
        formData.set('currentDetailsId', '42');
        formData.set('q', 'term');
        formData.set('page', '1');

        await selectDetailsAction(formData);

        expect(redirectMock).toHaveBeenCalledWith({
            href: '/?q=term',
            locale: 'en',
        });
    });

    it('closeDetailsAction redirects without details param', async () => {
        const formData = new FormData();
        formData.set('q', 'term');
        formData.set('page', '3');

        await closeDetailsAction(formData);

        expect(redirectMock).toHaveBeenCalledWith({
            href: '/?q=term&page=3',
            locale: 'en',
        });
    });
});
