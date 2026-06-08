import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Item } from '../types/item';

type SearchState = {
    searchTerm: string;
    selectedItems: Item[];
};

const initialState: SearchState = {
    searchTerm: '',
    selectedItems: [],
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        toggleItemSelection: (state, action: PayloadAction<Item>) => {
            const index = state.selectedItems.findIndex(
                (item) => item.id === action.payload.id
            );
            if (index >= 0) {
                state.selectedItems.splice(index, 1);
            } else {
                state.selectedItems.push(action.payload);
            }
        },
        clearSelectedItems: (state) => {
            state.selectedItems = [];
        },
    },
});

export const { setSearchTerm, toggleItemSelection, clearSelectedItems } = searchSlice.actions;
export default searchSlice.reducer;