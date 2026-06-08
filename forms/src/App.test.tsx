import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Provider } from 'react-redux';
import App from './App';
import { createTestStore } from './test/testUtils';

function renderApp() {
    const store = createTestStore();

    return render(
        <Provider store={store}>
            <App />
        </Provider>
    );
}

describe('App', () => {
    it('opens and closes uncontrolled form modal', async () => {
        const user = userEvent.setup();
        renderApp();

        await user.click(screen.getByRole('button', { name: /open uncontrolled form/i }));

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Uncontrolled Form' })).toBeInTheDocument();

        await user.keyboard('{Escape}');

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('opens react hook form modal', async () => {
        const user = userEvent.setup();
        renderApp();

        await user.click(screen.getByRole('button', { name: /open react hook form/i }));

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'React Hook Form' })).toBeInTheDocument();
    });

    it('shows empty submissions list', () => {
        renderApp();

        expect(
            screen.getByText('No submissions yet. Submit a form to see cards here.')
        ).toBeInTheDocument();
    });
});
