import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DetailsPage } from './DetailsPage';
import { loadDetails } from '../../api/api';
import { createTestStore } from '../../test-utils/testStore';
import type { Item } from '../../types/item';

vi.mock('../../api/api');

const loadDetailsMock = vi.mocked(loadDetails);

const itemOne: Item = {
    id: 1,
    name: 'Test Item',
    description: 'Some description',
};

const itemTwo: Item = {
    id: 2,
    name: 'Second Item',
    description: 'Another description',
};

function renderDetails(itemId: string) {
    const store = createTestStore();
    return {
        store,
        ...render(
            <Provider store={store}>
                <DetailsPage itemId={itemId} />
            </Provider>
        ),
    };
}

describe('DetailsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state initially', () => {
        loadDetailsMock.mockReturnValue(new Promise(() => {}));

        renderDetails('1');

        expect(loadDetailsMock).toHaveBeenCalledWith('1');
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('renders details after successful load', async () => {
        loadDetailsMock.mockResolvedValue(itemOne);

        renderDetails('1');

        expect(loadDetailsMock).toHaveBeenCalledWith('1');
        expect(await screen.findByText('Test Item')).toBeInTheDocument();
        expect(screen.getByText('Some description')).toBeInTheDocument();
        expect(screen.getByText('Item #1')).toBeInTheDocument();
    });

    it('shows error message on failure', async () => {
        loadDetailsMock.mockRejectedValue(new Error('fail'));

        renderDetails('1');

        expect(loadDetailsMock).toHaveBeenCalledWith('1');
        expect(
            await screen.findByText('Failed to load details. Please try again.')
        ).toBeInTheDocument();
    });

    it('hides loading after data is loaded', async () => {
        loadDetailsMock.mockResolvedValue(itemOne);

        renderDetails('1');

        await screen.findByText('Test Item');

        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    it('does not render item content when load fails', async () => {
        loadDetailsMock.mockRejectedValue(new Error('fail'));

        renderDetails('1');

        await screen.findByText('Failed to load details. Please try again.');

        expect(screen.queryByText('Item #1')).not.toBeInTheDocument();
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    it('renders content inside details-panel', async () => {
        loadDetailsMock.mockResolvedValue(itemOne);

        const { container } = renderDetails('1');

        await screen.findByText('Test Item');

        expect(container.querySelector('.details-panel')).toBeInTheDocument();
        expect(
            container.querySelector('.details-container')
        ).toBeInTheDocument();
    });

    it('reloads details when itemId changes', async () => {
        loadDetailsMock
            .mockResolvedValueOnce(itemOne)
            .mockResolvedValueOnce(itemTwo);

        const store = createTestStore();
        const { rerender } = render(
            <Provider store={store}>
                <DetailsPage itemId="1" />
            </Provider>
        );

        expect(await screen.findByText('Test Item')).toBeInTheDocument();

        rerender(
            <Provider store={store}>
                <DetailsPage key="2" itemId="2" />
            </Provider>
        );

        expect(await screen.findByText('Second Item')).toBeInTheDocument();
        expect(screen.getByText('Another description')).toBeInTheDocument();
        expect(screen.getByText('Item #2')).toBeInTheDocument();
        expect(screen.queryByText('Test Item')).not.toBeInTheDocument();
        expect(loadDetailsMock).toHaveBeenCalledWith('2');
        expect(loadDetailsMock).toHaveBeenCalledTimes(2);
    });

    it('returns null when load resolves without item', async () => {
        loadDetailsMock.mockResolvedValue(null as unknown as Item);

        const { container } = renderDetails('1');

        await waitFor(() => {
            expect(loadDetailsMock).toHaveBeenCalledWith('1');
            expect(container).toBeEmptyDOMElement();
        });

        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        expect(
            screen.queryByText('Failed to load details. Please try again.')
        ).not.toBeInTheDocument();
    });

    it('shows loading while fetching new itemId', async () => {
        let resolveSecond!: (value: Item) => void;

        loadDetailsMock.mockResolvedValueOnce(itemOne).mockImplementationOnce(
            () =>
                new Promise<Item>((resolve) => {
                    resolveSecond = resolve;
                })
        );

        const store = createTestStore();
        const { rerender } = render(
            <Provider store={store}>
                <DetailsPage itemId="1" />
            </Provider>
        );

        await screen.findByText('Test Item');

        rerender(
            <Provider store={store}>
                <DetailsPage key="2" itemId="2" />
            </Provider>
        );

        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        resolveSecond(itemTwo);

        await waitFor(() => {
            expect(screen.getByText('Second Item')).toBeInTheDocument();
        });

        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
});