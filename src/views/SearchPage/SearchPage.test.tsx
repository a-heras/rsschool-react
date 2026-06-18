import '@/test-utils/mockNextNavigation';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { SearchPage } from './SearchPage';
import { createTestStore } from '@/test-utils/testStore';
import {
    loadDataMock,
    loadDetailsMock,
    resetApiMocks,
} from '@/test-utils/mockApi';
import {
    setInitialSearch,
    getSearchSnapshot,
    pushMock,
} from '@/test-utils/mockNextNavigation';

vi.mock('@/api/api', async () => {
    const { loadDataMock: mockedLoadData, loadDetailsMock: mockedLoadDetails } =
        await import('@/test-utils/mockApi');
    return { loadData: mockedLoadData, loadDetails: mockedLoadDetails };
});

const downloadSelectedItemsCsvMock = vi.fn();

vi.mock('@/utils/downloadSelectedItemsCsv', () => ({
    downloadSelectedItemsCsv: (...args: unknown[]) =>
        downloadSelectedItemsCsvMock(...args),
}));

function renderSearchPage(url = '/?page=1') {
    const search = url.includes('?') ? url.split('?')[1] : 'page=1';
    setInitialSearch(search);
    pushMock.mockClear();

    const store = createTestStore();

    render(
        <Provider store={store}>
            <SearchPage />
        </Provider>
    );

    return {
        getSearch: () => getSearchSnapshot(),
    };
}

const emptyLoadResult = { items: [], total: 0 };

const listItem = { id: 1, name: 'Item 1', description: 'Desc 1' };

describe('SearchPage component', () => {
    beforeEach(() => {
        localStorage.clear();
        resetApiMocks();
        loadDataMock.mockResolvedValue(emptyLoadResult);
        downloadSelectedItemsCsvMock.mockClear();
    });

    it('loads initial data on mount (success)', async () => {
        localStorage.setItem('searchTerm', 'initial');
        loadDataMock.mockResolvedValue({
            items: [{ id: 1, name: 'A', description: 'B' }],
            total: 1,
        });

        renderSearchPage();

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('A')).toBeInTheDocument();
            expect(screen.getByText('B')).toBeInTheDocument();
        });

        expect(loadDataMock).toHaveBeenCalledWith('initial', 1);
    });

    it('shows error message when initial load fails', async () => {
        localStorage.setItem('searchTerm', 'initial');
        loadDataMock.mockRejectedValue(new Error('fail'));

        renderSearchPage();

        await waitFor(() => {
            expect(
                screen.getByText('Failed to load data. Please try again.')
            ).toBeInTheDocument();
        });
    });

    it('calls loadData on mount with empty searchTerm when localStorage is empty', async () => {
        renderSearchPage();

        await waitFor(() => {
            expect(loadDataMock).toHaveBeenCalledWith('', 1);
        });
    });

    it('loads data for the page from URL', async () => {
        renderSearchPage('/?page=2');

        await waitFor(() => {
            expect(loadDataMock).toHaveBeenCalledWith('', 2);
        });
    });

    it('calls loadData with trimmed search term when searching', async () => {
        renderSearchPage();

        const input = screen.getByPlaceholderText('Search...');
        const button = screen.getByText('Search');

        fireEvent.change(input, { target: { value: '   hello   ' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(loadDataMock).toHaveBeenCalledWith('hello', 1);
        });
    });

    it('does not search if term is same as lastSearchTerm', async () => {
        localStorage.setItem('searchTerm', 'same');

        renderSearchPage();

        await waitFor(() => {
            expect(loadDataMock).toHaveBeenCalledWith('same', 1);
        });

        const callsBefore = loadDataMock.mock.calls.length;

        const input = screen.getByPlaceholderText('Search...');
        const button = screen.getByText('Search');

        fireEvent.change(input, { target: { value: 'same' } });
        fireEvent.click(button);

        expect(loadDataMock.mock.calls.length).toBe(callsBefore);
    });

    it('shows loading when searching', async () => {
        renderSearchPage();

        const input = screen.getByPlaceholderText('Search...');
        const button = screen.getByText('Search');

        fireEvent.change(input, { target: { value: 'abc' } });
        fireEvent.click(button);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows error message when search fails', async () => {
        loadDataMock.mockRejectedValue(new Error('fail'));

        renderSearchPage();

        const input = screen.getByPlaceholderText('Search...');
        const button = screen.getByText('Search');

        fireEvent.change(input, { target: { value: 'abc' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(
                screen.getByText('Failed to load data. Please try again.')
            ).toBeInTheDocument();
        });
    });

    it('does not show pagination when total is 0', async () => {
        renderSearchPage();

        await waitFor(() => {
            expect(loadDataMock).toHaveBeenCalled();
        });

        expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('loads next page when pagination Next is clicked', async () => {
        loadDataMock.mockResolvedValue({
            items: [listItem],
            total: 12,
        });

        renderSearchPage();

        await waitFor(() => {
            expect(screen.getByText('Next')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(loadDataMock).toHaveBeenCalledWith('', 2);
        });
    });

    it('reuses cached list data when returning to a previous page', async () => {
        loadDataMock.mockResolvedValue({
            items: [listItem],
            total: 12,
        });

        renderSearchPage();

        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(loadDataMock).toHaveBeenCalledWith('', 2);
        });

        const callsAfterPage2 = loadDataMock.mock.calls.length;

        fireEvent.click(screen.getByText('Prev'));

        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });

        expect(loadDataMock.mock.calls.length).toBe(callsAfterPage2);
    });

    it('shows loading in details panel on first open only', async () => {
        loadDataMock.mockResolvedValue({
            items: [listItem],
            total: 1,
        });

        let resolveDetails: (value: {
            id: number;
            name: string;
            description: string;
        }) => void = () => {};
        loadDetailsMock.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveDetails = resolve;
                })
        );

        const navigation = renderSearchPage();

        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Item 1'));

        await waitFor(() => {
            expect(navigation.getSearch()).toContain('details=1');
        });

        expect(screen.getAllByText(/loading/i).length).toBeGreaterThan(0);

        resolveDetails({
            id: 1,
            name: 'Detail 1',
            description: 'Detail desc',
        });

        await screen.findByText('Detail 1');

        fireEvent.click(
            screen.getByRole('button', { name: 'Close details' })
        );

        await waitFor(() => {
            expect(navigation.getSearch()).not.toContain('details=');
        });

        expect(loadDetailsMock).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByText('Item 1'));

        await waitFor(() => {
            expect(navigation.getSearch()).toContain('details=1');
        });

        expect(await screen.findByText('Detail 1')).toBeInTheDocument();
        expect(loadDetailsMock).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('clamps page when page in URL exceeds maxPage', async () => {
        loadDataMock.mockResolvedValue({
            items: [listItem],
            total: 6,
        });

        const navigation = renderSearchPage('/?page=10');

        await waitFor(() => {
            const search = navigation.getSearch();
            expect(search).toContain('page=2');
            expect(search).not.toContain('page=10');
        });
    });

    it('refetches list when Refresh is clicked', async () => {
        loadDataMock.mockResolvedValue({
            items: [listItem],
            total: 1,
        });

        renderSearchPage();

        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });

        const callsBefore = loadDataMock.mock.calls.length;

        fireEvent.click(
            screen.getByRole('button', { name: 'Refresh search results' })
        );

        await waitFor(() => {
            expect(loadDataMock.mock.calls.length).toBeGreaterThan(callsBefore);
        });
    });

    it('shows details error in split view while list stays visible', async () => {
        loadDataMock.mockResolvedValue({
            items: [listItem],
            total: 1,
        });
        loadDetailsMock.mockRejectedValue(new Error('fail'));

        renderSearchPage();

        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Item 1'));

        await waitFor(() => {
            expect(
                screen.getByText('Failed to load details. Please try again.')
            ).toBeInTheDocument();
        });

        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(
            screen.queryByText('Failed to load data. Please try again.')
        ).not.toBeInTheDocument();
    });

    it('shows details error when details id is already in URL', async () => {
        loadDataMock.mockResolvedValue({
            items: [listItem],
            total: 1,
        });
        loadDetailsMock.mockRejectedValue(new Error('fail'));

        renderSearchPage('/?page=1&details=1');

        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeInTheDocument();
            expect(
                screen.getByText('Failed to load details. Please try again.')
            ).toBeInTheDocument();
        });
    });

    it('opens details panel and sets details query param', async () => {
        loadDataMock.mockResolvedValue({
            items: [listItem],
            total: 1,
        });
        loadDetailsMock.mockResolvedValue({
            id: 1,
            name: 'Detail 1',
            description: 'Detail desc',
        });

        const navigation = renderSearchPage();

        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Item 1'));

        await waitFor(() => {
            expect(navigation.getSearch()).toContain('details=1');
            expect(
                screen.getByRole('button', { name: 'Close details' })
            ).toBeInTheDocument();
        });

        expect(await screen.findByText('Detail 1')).toBeInTheDocument();
    });

    it('closes details when the same item row is clicked again', async () => {
        loadDataMock.mockResolvedValue({
            items: [listItem],
            total: 1,
        });
        loadDetailsMock.mockResolvedValue({
            id: 1,
            name: 'Detail 1',
            description: 'Detail desc',
        });

        const navigation = renderSearchPage('/?page=1&details=1');

        await waitFor(() => {
            expect(screen.getByText('Detail 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Item 1'));

        await waitFor(() => {
            expect(navigation.getSearch()).not.toContain('details=');
            expect(
                screen.queryByRole('button', { name: 'Close details' })
            ).not.toBeInTheDocument();
        });
    });

    it('closes details panel and removes details from URL', async () => {
        loadDataMock.mockResolvedValue({
            items: [listItem],
            total: 1,
        });
        loadDetailsMock.mockResolvedValue({
            id: 1,
            name: 'Detail 1',
            description: 'Detail desc',
        });

        const navigation = renderSearchPage('/?page=1&details=1');

        await waitFor(() => {
            expect(
                screen.getByRole('button', { name: 'Close details' })
            ).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole('button', { name: 'Close details' }));

        await waitFor(() => {
            expect(navigation.getSearch()).not.toContain('details=');
        });
    });

    it('keeps details param when changing page', async () => {
        loadDataMock.mockResolvedValue({
            items: [listItem],
            total: 12,
        });
        loadDetailsMock.mockResolvedValue({
            id: 1,
            name: 'Detail 1',
            description: 'Detail desc',
        });

        const navigation = renderSearchPage('/?page=1&details=1');

        await waitFor(() => {
            expect(screen.getByText('Next')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            const search = navigation.getSearch();
            expect(search).toContain('page=2');
            expect(search).toContain('details=1');
        });

        expect(loadDataMock).toHaveBeenCalledWith('', 2);
    });

    it('shows flyout with count when an item is selected', async () => {
        loadDataMock.mockResolvedValue({
            items: [listItem],
            total: 1,
        });

        renderSearchPage();

        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });

        expect(
            screen.queryByRole('region', { name: 'Selected items' })
        ).not.toBeInTheDocument();

        fireEvent.click(
            screen.getByRole('checkbox', { name: 'Select Item 1' })
        );

        expect(
            screen.getByRole('region', { name: 'Selected items' })
        ).toBeInTheDocument();
        expect(screen.getByText('1 item selected')).toBeInTheDocument();
    });

    it('hides flyout and clears selection when Unselect all is clicked', async () => {
        loadDataMock.mockResolvedValue({
            items: [listItem],
            total: 1,
        });

        renderSearchPage();

        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });

        fireEvent.click(
            screen.getByRole('checkbox', { name: 'Select Item 1' })
        );
        expect(screen.getByText('1 item selected')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Unselect all' }));

        expect(
            screen.queryByRole('region', { name: 'Selected items' })
        ).not.toBeInTheDocument();
        expect(
            screen.getByRole('checkbox', { name: 'Select Item 1' })
        ).not.toBeChecked();
    });

    it('calls downloadSelectedItemsCsv when Download is clicked', async () => {
        loadDataMock.mockResolvedValue({
            items: [listItem],
            total: 1,
        });

        renderSearchPage();

        await waitFor(() => {
            expect(screen.getByText('Item 1')).toBeInTheDocument();
        });

        fireEvent.click(
            screen.getByRole('checkbox', { name: 'Select Item 1' })
        );
        fireEvent.click(screen.getByRole('button', { name: 'Download' }));

        expect(downloadSelectedItemsCsvMock).toHaveBeenCalledWith(
            [listItem],
            window.location.origin
        );
    });
});
