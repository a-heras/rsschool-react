import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import searchReducer, {
    fetchItems,
    setSearchTerm,
    toggleItemSelection,
    clearSelectedItems,
} from './searchSlice';
import { loadDataMock, resetApiMocks } from '../test-utils/mockApi';

vi.mock('../api/api', async () => {
    const { loadDataMock: mockedLoadData } =
        await import('../test-utils/mockApi');
    return { loadData: mockedLoadData };
});

function createStore() {
    return configureStore({
        reducer: {
            search: searchReducer,
        },
    });
}

describe('searchSlice', () => {
    beforeEach(() => {
        resetApiMocks();
    });

    it('setSearchTerm updates searchTerm in state', () => {
        const store = createStore();

        store.dispatch(setSearchTerm('hello'));

        expect(store.getState().search.searchTerm).toBe('hello');
    });

    it('fetchItems.fulfilled stores items and total', async () => {
        loadDataMock.mockResolvedValue({
            items: [{ id: 1, name: 'A', description: 'B' }],
            total: 1,
        });

        const store = createStore();

        await store.dispatch(fetchItems({ term: 'test', page: 1 }));

        const state = store.getState().search;
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.items).toHaveLength(1);
        expect(state.total).toBe(1);
        expect(loadDataMock).toHaveBeenCalledWith('test', 1);
    });

    it('fetchItems.rejected sets error message', async () => {
        loadDataMock.mockRejectedValue(new Error('fail'));

        const store = createStore();

        await store.dispatch(fetchItems({ term: '', page: 1 }));

        const state = store.getState().search;
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Failed to load data. Please try again.');
    });

    it('toggleItemSelection adds and removes item', () => {
        const store = createStore();
        const item = { id: 1, name: 'A', description: 'B' };

        store.dispatch(toggleItemSelection(item));
        expect(store.getState().search.selectedItems).toHaveLength(1);

        store.dispatch(toggleItemSelection(item));
        expect(store.getState().search.selectedItems).toHaveLength(0);
    });

    it('clearSelectedItems empties selection', () => {
        const store = createStore();
        const item = { id: 1, name: 'A', description: 'B' };

        store.dispatch(toggleItemSelection(item));
        store.dispatch(clearSelectedItems());

        expect(store.getState().search.selectedItems).toHaveLength(0);
    });

    it('fetchItems.pending sets loading to true', () => {
        loadDataMock.mockReturnValue(new Promise(() => {}));

        const store = createStore();

        store.dispatch(fetchItems({ term: '', page: 1 }));

        expect(store.getState().search.loading).toBe(true);
        expect(store.getState().search.error).toBeNull();
    });
});
