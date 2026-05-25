import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loadData } from "../api/api";
import type { Item } from "../types/item";

type SearchState = {
    items: Item[];
    total: number;
    loading: boolean;
    error: string | null;
    searchTerm: string;
};

const initialState: SearchState = {
    items: [],
    total: 0,
    loading: false,
    error: null,
    searchTerm: "",
};

export const fetchItems = createAsyncThunk(
    "search/fetchItems",
    async ({ term, page }: { term: string; page: number }) => {
        return loadData(term, page);
    }
);

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
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
            state.error = "Failed to load data. Please try again.";
        });
    },
});

export const { setSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;