import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CountryAutocomplete } from './CountryAutocomplete';

describe('CountryAutocomplete', () => {
    it('renders input with datalist options and error', () => {
        render(
            <CountryAutocomplete
                id="country-field"
                countries={['Belarus', 'Poland']}
                error="Country is required"
            />
        );

        expect(screen.getByLabelText('Country')).toHaveAttribute('list', 'country-field-list');
        expect(screen.getByRole('alert')).toHaveTextContent('Country is required');

        const datalist = document.getElementById('country-field-list');
        expect(datalist?.querySelectorAll('option')).toHaveLength(2);
    });
});
