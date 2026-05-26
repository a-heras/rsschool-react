import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import searchReducer, {
    setSearchTerm,
    toggleItemSelection,
    clearSelectedItems,
} from './searchSlice';

function createStore() {
    return configureStore({
        reducer: {
            search: searchReducer,
        },
    });
}

describe('searchSlice', () => {
    it('setSearchTerm updates searchTerm in state', () => {
        const store = createStore();

        store.dispatch(setSearchTerm('hello'));

        expect(store.getState().search.searchTerm).toBe('hello');
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
});