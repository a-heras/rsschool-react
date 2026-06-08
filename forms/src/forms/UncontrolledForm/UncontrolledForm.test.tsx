import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { createValidImageFile, renderWithStore } from '../../test/testUtils';
import { UncontrolledForm } from './UncontrolledForm';

function uploadImage(file: File) {
    const input = screen.getByLabelText(/^image$/i);

    fireEvent.change(input, { target: { files: [file] } });
}

describe('UncontrolledForm', () => {
    it('shows validation errors on submit', async () => {
        const user = userEvent.setup();
        renderWithStore(<UncontrolledForm onSuccess={() => undefined} />);

        await user.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(screen.getByText('Name is required')).toBeInTheDocument();
        });
    });

    it('shows password strength and selected image name', async () => {
        const user = userEvent.setup();
        const { container } = renderWithStore(
            <UncontrolledForm onSuccess={() => undefined} />
        );

        await user.type(screen.getByLabelText(/^password$/i), 'Abc123!');
        uploadImage(createValidImageFile('avatar.jpg'));

        expect(container.querySelectorAll('.password-strength .ok')).toHaveLength(4);
        expect(screen.getByText('Selected: avatar.jpg')).toBeInTheDocument();
    });

    it('does not allow typing non-digit characters in age', async () => {
        const user = userEvent.setup();
        renderWithStore(<UncontrolledForm onSuccess={() => undefined} />);

        await user.type(screen.getByLabelText(/^age$/i), 'e');
        await user.type(screen.getByLabelText(/^age$/i), '30x');

        expect(screen.getByLabelText(/^age$/i)).toHaveValue('30');
    });

    it('shows image validation error when file is missing on submit', async () => {
        const user = userEvent.setup();
        renderWithStore(<UncontrolledForm onSuccess={() => undefined} />);

        await user.type(screen.getByLabelText(/^name$/i), 'Anna');
        await user.type(screen.getByLabelText(/^age$/i), '25');
        await user.type(screen.getByLabelText(/^email$/i), 'anna@mail.com');
        await user.selectOptions(screen.getByLabelText(/^gender$/i), 'female');
        await user.type(screen.getByLabelText(/^password$/i), 'Abc123!');
        await user.type(screen.getByLabelText(/confirm password/i), 'Abc123!');
        await user.type(screen.getByLabelText(/^country$/i), 'Belarus');
        await user.click(screen.getByLabelText(/terms and conditions/i));
        await user.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(screen.getByText('Image is required')).toBeInTheDocument();
        });
    });
});
