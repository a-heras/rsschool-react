import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadData } from '../api/api';
import type { Item } from '../types/item';
import type { PayloadAction } from '@reduxjs/toolkit';

type SearchState = {
    items: Item[];
    total: number;
    loading: boolean;
    error: string | null;
    searchTerm: string;
    selectedItems: Item[];
};

const initialState: SearchState = {
    items: [],
    total: 0,
    loading: false,
    error: null,
    searchTerm: '',
    selectedItems: [],
};

export const fetchItems = createAsyncThunk(
    'search/fetchItems',
    async ({ term, page }: { term: string; page: number }) => {
        return loadData(term, page);
    }
);

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
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.total = action.payload.total;
                state.loading = false;
            })
            .addCase(fetchItems.rejected, (state) => {
                state.loading = false;
                state.error = 'Failed to load data. Please try again.';
            });
    },
});

export const { setSearchTerm, toggleItemSelection, clearSelectedItems } =
    searchSlice.actions;
export default searchSlice.reducer;
