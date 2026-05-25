import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage component', () => {
    it('renders provided error message', () => {
        render(<ErrorMessage message="Something went wrong" />);
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('renders different messages correctly', () => {
        render(<ErrorMessage message="Network error" />);
        expect(screen.getByText('Network error')).toBeInTheDocument();
    });
});
