import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../store/searchSlice';
import { searchApi } from '../store/searchApi';

export function createTestStore() {
    return configureStore({
        reducer: {
            search: searchReducer,
            [searchApi.reducerPath]: searchApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(searchApi.middleware),
    });
}
