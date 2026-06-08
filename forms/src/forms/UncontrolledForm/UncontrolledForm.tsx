import { useRef, useState, type FormEvent } from 'react';
import { FormFieldError } from '../../components/FormFieldError/FormFieldError';
import { PasswordStrength } from '../../components/PasswordStrength/PasswordStrength';
import { CountryAutocomplete } from '../../components/CountryAutocomplete/CountryAutocomplete';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCountries } from '../../store/countriesSlice';
import { addSubmission } from '../../store/submissionsSlice';
import type { FormSubmission } from '../../types/form';
import { fileToBase64 } from '../../utils/imageToBase64';
import { createFormSchema } from '../../validation/formSchema';
import '../shared/form.css';

type UncontrolledFormProps = {
    onSuccess: () => void;
};

export function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [passwordHint, setPasswordHint] = useState('');
    const [imageFileName, setImageFileName] = useState('');

    const dispatch = useAppDispatch();
    const countries = useAppSelector(selectCountries);
    const schema = createFormSchema(countries);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({});

        const formData = new FormData(event.currentTarget);

        const rawData = {
            name: String(formData.get('name') ?? ''),
            age: formData.get('age'),
            email: String(formData.get('email') ?? ''),
            gender: String(formData.get('gender') ?? ''),
            termsAccepted: formData.get('termsAccepted') === 'on',
            password: String(formData.get('password') ?? ''),
            confirmPassword: String(formData.get('confirmPassword') ?? ''),
            image: formData.get('image'),
            country: String(formData.get('country') ?? ''),
        };

        const result = schema.safeParse(rawData);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0];

                if (typeof field === 'string' && !fieldErrors[field]) {
                    fieldErrors[field] = issue.message;
                }
            });

            setErrors(fieldErrors);
            return;
        }

        const data = result.data;
        const imageBase64 = await fileToBase64(data.image);

        const submission: FormSubmission = {
            id: crypto.randomUUID(),
            formType: 'uncontrolled',
            name: data.name,
            age: data.age,
            email: data.email,
            gender: data.gender,
            termsAccepted: data.termsAccepted,
            imageBase64,
            country: data.country,
            submittedAt: new Date().toISOString(),
        };

        dispatch(addSubmission(submission));
        formRef.current?.reset();
        setPasswordHint('');
        setImageFileName('');
        onSuccess();
    };

    return (
        <form
            ref={formRef}
            className="profile-form"
            onSubmit={handleSubmit}
            noValidate
        >
            <div className="form-field">
                <label htmlFor="uncontrolled-name">Name</label>
                <input id="uncontrolled-name" name="name" type="text" />
                <FormFieldError message={errors.name} />
            </div>

            <div className="form-field">
                <label htmlFor="uncontrolled-age">Age</label>
                <input id="uncontrolled-age" name="age" type="number" min="0" />
                <FormFieldError message={errors.age} />
            </div>

            <div className="form-field">
                <label htmlFor="uncontrolled-email">Email</label>
                <input id="uncontrolled-email" name="email" type="email" />
                <FormFieldError message={errors.email} />
            </div>

            <div className="form-field">
                <label htmlFor="uncontrolled-gender">Gender</label>
                <select id="uncontrolled-gender" name="gender" defaultValue="">
                    <option value="" disabled>
                        Select gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <FormFieldError message={errors.gender} />
            </div>

            <div className="form-field">
                <label htmlFor="uncontrolled-password">Password</label>
                <input
                    id="uncontrolled-password"
                    name="password"
                    type="password"
                    onChange={(event) => setPasswordHint(event.target.value)}
                />
                <PasswordStrength password={passwordHint} />
                <FormFieldError message={errors.password} />
            </div>

            <div className="form-field">
                <label htmlFor="uncontrolled-confirm-password">Confirm password</label>
                <input
                    id="uncontrolled-confirm-password"
                    name="confirmPassword"
                    type="password"
                />
                <FormFieldError message={errors.confirmPassword} />
            </div>

            <div className="form-field">
                <label htmlFor="uncontrolled-image">Image</label>
                <input
                    id="uncontrolled-image"
                    name="image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,.png,.jpg,.jpeg"
                    onChange={(event) => {
                        setImageFileName(event.target.files?.[0]?.name ?? '');
                    }}
                />
                {imageFileName ? (
                    <p className="form-field__file-name">Selected: {imageFileName}</p>
                ) : null}
                <FormFieldError message={errors.image} />
            </div>

            <CountryAutocomplete
                id="uncontrolled-country"
                countries={countries}
                error={errors.country}
            />

            <div className="form-field form-field--checkbox">
                <input id="uncontrolled-terms" name="termsAccepted" type="checkbox" />
                <label htmlFor="uncontrolled-terms">I accept Terms and Conditions</label>
                <FormFieldError message={errors.termsAccepted} />
            </div>

            <button type="submit" className="profile-form__submit">
                Submit
            </button>
        </form>
    );
}