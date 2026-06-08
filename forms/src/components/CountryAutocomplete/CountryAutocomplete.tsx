import { FormFieldError } from '../FormFieldError/FormFieldError';

type CountryAutocompleteProps = {
    id: string;
    countries: string[];
    error?: string;
};

export function CountryAutocomplete({
    id,
    countries,
    error,
}: CountryAutocompleteProps) {
    const listId = `${id}-list`;

    return (
        <div className="form-field">
            <label htmlFor={id}>Country</label>
            <input
                id={id}
                name="country"
                list={listId}
                autoComplete="off"
            />
            <datalist id={listId}>
                {countries.map((country) => (
                    <option key={country} value={country} />
                ))}
            </datalist>
            <FormFieldError message={error} />
        </div>
    );
}