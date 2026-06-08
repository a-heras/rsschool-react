import { configureStore } from '@reduxjs/toolkit';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { ReactElement } from 'react';
import countriesReducer from '../store/countriesSlice';
import submissionsReducer from '../store/submissionsSlice';

export function createTestStore() {
    return configureStore({
        reducer: {
            countries: countriesReducer,
            submissions: submissionsReducer,
        },
    });
}

export function renderWithStore(ui: ReactElement, options?: RenderOptions) {
    const store = createTestStore();

    return {
        store,
        ...render(<Provider store={store}>{ui}</Provider>, options),
    };
}

export function createValidImageFile(name = 'photo.png') {
    return new File(['image-content'], name, { type: 'image/png' });
}
