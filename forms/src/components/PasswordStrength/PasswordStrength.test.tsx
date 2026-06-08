import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PasswordStrength } from './PasswordStrength';

describe('PasswordStrength', () => {
    it('marks satisfied rules as ok', () => {
        const { container } = render(<PasswordStrength password="Abc123!" />);

        expect(container.querySelectorAll('.password-strength .ok')).toHaveLength(4);
        expect(screen.getByText('1 number')).toBeInTheDocument();
    });

    it('shows no ok classes for weak password', () => {
        const { container } = render(<PasswordStrength password="" />);

        expect(container.querySelectorAll('.password-strength .ok')).toHaveLength(0);
    });
});
