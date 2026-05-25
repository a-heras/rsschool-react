import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../store/searchSlice';

export function createTestStore() {
    return configureStore({
        reducer: {
            search: searchReducer,
        },
    });
}
