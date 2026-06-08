import { render, screen, act } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import countriesReducer from '../../store/countriesSlice';
import submissionsReducer, { addSubmission } from '../../store/submissionsSlice';
import type { FormSubmission } from '../../types/form';
import { SubmissionsList } from './SubmissionsList';

const submission: FormSubmission = {
    id: '1',
    formType: 'uncontrolled',
    name: 'Anna',
    age: 25,
    email: 'anna@mail.com',
    gender: 'female',
    termsAccepted: true,
    imageBase64: 'data:image/png;base64,abc',
    country: 'Belarus',
    submittedAt: '2026-06-08T10:00:00.000Z',
};

function renderList(preloadedSubmission?: FormSubmission) {
    const store = configureStore({
        reducer: {
            countries: countriesReducer,
            submissions: submissionsReducer,
        },
    });

    if (preloadedSubmission) {
        store.dispatch(addSubmission(preloadedSubmission));
    }

    const view = render(
        <Provider store={store}>
            <SubmissionsList />
        </Provider>
    );

    return { store, ...view };
}

describe('SubmissionsList', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('shows empty state', () => {
        renderList();

        expect(
            screen.getByText('No submissions yet. Submit a form to see cards here.')
        ).toBeInTheDocument();
    });

    it('renders submission cards', () => {
        renderList(submission);

        expect(screen.getByRole('region', { name: 'Submitted forms' })).toBeInTheDocument();
        expect(screen.getByText('Anna')).toBeInTheDocument();
    });

    it('clears latest highlight after timeout', () => {
        vi.useFakeTimers();
        const { store } = renderList(submission);

        expect(store.getState().submissions.latestId).toBe('1');

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(store.getState().submissions.latestId).toBeNull();
    });
});
