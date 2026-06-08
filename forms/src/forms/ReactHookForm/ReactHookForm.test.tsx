import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
    createValidImageFile,
    renderWithStore,
} from '../../test/testUtils';
import { ReactHookForm } from './ReactHookForm';

function renderForm() {
    return renderWithStore(<ReactHookForm onSuccess={() => undefined} />);
}

async function fillValidFormExceptConfirm(
    user: ReturnType<typeof userEvent.setup>,
    confirmPassword: string
) {
    await user.type(screen.getByLabelText(/^name$/i), 'Anna');
    await user.type(screen.getByLabelText(/^age$/i), '25');
    await user.type(screen.getByLabelText(/^email$/i), 'anna@mail.com');
    await user.selectOptions(screen.getByLabelText(/^gender$/i), 'female');
    await user.type(screen.getByLabelText(/^password$/i), 'Abc123!');
    await user.type(screen.getByLabelText(/confirm password/i), confirmPassword);
    await user.upload(screen.getByLabelText(/^image$/i), createValidImageFile());
    await user.type(screen.getByLabelText(/^country$/i), 'Belarus');
    await user.click(screen.getByLabelText(/terms and conditions/i));
}

describe('ReactHookForm age validation', () => {
    it('does not allow typing non-digit characters in age', async () => {
        const user = userEvent.setup();
        renderForm();

        await user.type(screen.getByLabelText(/^age$/i), 'e');
        await user.type(screen.getByLabelText(/^age$/i), '25a');

        expect(screen.getByLabelText(/^age$/i)).toHaveValue('25');
    });
});

describe('ReactHookForm confirm password', () => {
    it('shows mismatch error before other fields are filled', async () => {
        const user = userEvent.setup();
        renderForm();

        await user.type(screen.getByLabelText(/^password$/i), 'Abc123!');
        await user.type(screen.getByLabelText(/confirm password/i), 'A');

        await waitFor(() => {
            expect(screen.getByText('Passwords must match')).toBeInTheDocument();
        });
    });

    it('shows mismatch error until passwords match', async () => {
        const user = userEvent.setup();
        renderForm();

        await fillValidFormExceptConfirm(user, 'A');

        await waitFor(() => {
            expect(screen.getByText('Passwords must match')).toBeInTheDocument();
        });

        await user.clear(screen.getByLabelText(/confirm password/i));
        await user.type(screen.getByLabelText(/confirm password/i), 'Abc123!');

        await waitFor(() => {
            expect(screen.queryByText('Passwords must match')).not.toBeInTheDocument();
            expect(screen.queryByText('Confirm password is required')).not.toBeInTheDocument();
        });
    });

    it('submits valid form and stores submission', async () => {
        const user = userEvent.setup();
        const onSuccess = vi.fn();

        vi.spyOn(crypto, 'randomUUID').mockReturnValue(
            '11111111-1111-1111-1111-111111111111'
        );

        const { store } = renderWithStore(<ReactHookForm onSuccess={onSuccess} />);

        await fillValidFormExceptConfirm(user, 'Abc123!');

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
        });

        await user.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledTimes(1);
            expect(store.getState().submissions.items).toHaveLength(1);
            expect(store.getState().submissions.items[0]).toMatchObject({
                id: '11111111-1111-1111-1111-111111111111',
                formType: 'react-hook-form',
                name: 'Anna',
            });
        });
    });
});
