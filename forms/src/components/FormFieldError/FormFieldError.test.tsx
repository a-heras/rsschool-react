import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormFieldError } from './FormFieldError';

describe('FormFieldError', () => {
    it('renders placeholder without message', () => {
        const { container } = render(<FormFieldError />);

        expect(container.querySelector('.form-field-error')).toHaveAttribute(
            'aria-hidden',
            'true'
        );
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('renders alert with message', () => {
        render(<FormFieldError message="Required field" />);

        expect(screen.getByRole('alert')).toHaveTextContent('Required field');
    });
});
