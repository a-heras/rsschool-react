import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormFieldError } from '../../components/FormFieldError/FormFieldError';
import { PasswordStrength } from '../../components/PasswordStrength/PasswordStrength';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCountries } from '../../store/countriesSlice';
import { addSubmission } from '../../store/submissionsSlice';
import type { FormSubmission } from '../../types/form';
import {
    handleAgeKeyDown,
    handleAgePaste,
    sanitizeAgeDigits,
    toAgeFieldValue,
} from '../../utils/ageInput';
import { fileToBase64 } from '../../utils/imageToBase64';
import {
    createFormSchema,
    type FormFieldValues,
    type FormValues,
} from '../../validation/formSchema';
import '../shared/form.css';

type ReactHookFormProps = {
    onSuccess: () => void;
};

export function ReactHookForm({ onSuccess }: ReactHookFormProps) {
    const dispatch = useAppDispatch();
    const countries = useAppSelector(selectCountries);

    const [fileInputKey, setFileInputKey] = useState(0);

    const createResolver = useCallback(
        (password: string): Resolver<FormFieldValues, unknown, FormValues> =>
            zodResolver(createFormSchema(countries, password)) as Resolver<
                FormFieldValues,
                unknown,
                FormValues
            >,
        [countries]
    );

    const resolver = useCallback<Resolver<FormFieldValues, unknown, FormValues>>(
        async (values, context, options) =>
            createResolver(String(values.password ?? ''))(values, context, options),
        [createResolver]
    );

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        trigger,
        control,
        formState: { errors, isValid },
    } = useForm<FormFieldValues, unknown, FormValues>({
        resolver,
        mode: 'onChange',
        defaultValues: {
            name: '',
            age: undefined,
            email: '',
            gender: '',
            termsAccepted: undefined,
            password: '',
            confirmPassword: '',
            country: '',
            image: undefined,
        },
    });

    const ageRegister = register('age', {
        onChange: (event) => {
            const sanitized = sanitizeAgeDigits(event.target.value);

            if (sanitized !== event.target.value) {
                setValue('age', toAgeFieldValue(sanitized), {
                    shouldValidate: true,
                    shouldDirty: true,
                });
            }
        },
    });

    const [passwordValue = '', confirmPasswordValue = '', selectedImage] = useWatch({
        control,
        name: ['password', 'confirmPassword', 'image'],
    });

    useEffect(() => {
        if (!confirmPasswordValue) {
            return;
        }

        void trigger('confirmPassword');
    }, [passwordValue, confirmPasswordValue, trigger]);

    const onSubmit = async (data: FormValues) => {
        const imageBase64 = await fileToBase64(data.image);

        const submission: FormSubmission = {
            id: crypto.randomUUID(),
            formType: 'react-hook-form',
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
        reset();
        setFileInputKey((key) => key + 1);
        onSuccess();
    };

    return (
        <form className="profile-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-field">
                <label htmlFor="rhf-name">Name</label>
                <input id="rhf-name" type="text" {...register('name')} />
                <FormFieldError message={errors.name?.message} />
            </div>

            <div className="form-field">
                <label htmlFor="rhf-age">Age</label>
                <input
                    id="rhf-age"
                    type="text"
                    inputMode="numeric"
                    {...ageRegister}
                    onKeyDown={handleAgeKeyDown}
                    onPaste={handleAgePaste}
                />
                <FormFieldError message={errors.age?.message} />
            </div>

            <div className="form-field">
                <label htmlFor="rhf-email">Email</label>
                <input id="rhf-email" type="email" {...register('email')} />
                <FormFieldError message={errors.email?.message} />
            </div>

            <div className="form-field">
                <label htmlFor="rhf-gender">Gender</label>
                <select id="rhf-gender" {...register('gender')}>
                    <option value="" disabled>
                        Select gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <FormFieldError message={errors.gender?.message} />
            </div>

            <div className="form-field">
                <label htmlFor="rhf-password">Password</label>
                <input id="rhf-password" type="password" {...register('password')} />
                <PasswordStrength password={passwordValue} />
                <FormFieldError message={errors.password?.message} />
            </div>

            <div className="form-field">
                <label htmlFor="rhf-confirm-password">Confirm password</label>
                <input
                    id="rhf-confirm-password"
                    type="password"
                    {...register('confirmPassword')}
                />
                <FormFieldError message={errors.confirmPassword?.message} />
            </div>

            <div className="form-field">
                <label htmlFor="rhf-image">Image</label>
                <input
                    key={fileInputKey}
                    id="rhf-image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,.png,.jpg,.jpeg"
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;

                        setValue('image', file, {
                            shouldValidate: true,
                            shouldDirty: true,
                        });
                    }}
                />
                {selectedImage instanceof File ? (
                    <p className="form-field__file-name">Selected: {selectedImage.name}</p>
                ) : null}
                <FormFieldError message={errors.image?.message} />
            </div>

            <div className="form-field">
                <label htmlFor="rhf-country">Country</label>
                <input id="rhf-country" list="rhf-country-list" {...register('country')} />
                <datalist id="rhf-country-list">
                    {countries.map((country) => (
                        <option key={country} value={country} />
                    ))}
                </datalist>
                <FormFieldError message={errors.country?.message} />
            </div>

            <div className="form-field form-field--checkbox">
                <input
                    id="rhf-terms"
                    type="checkbox"
                    {...register('termsAccepted', {
                        setValueAs: (value) => value === true,
                    })}
                />
                <label htmlFor="rhf-terms">I accept Terms and Conditions</label>
                <FormFieldError message={errors.termsAccepted?.message} />
            </div>

            <button
                type="submit"
                className="profile-form__submit"
                disabled={!isValid}
            >
                Submit
            </button>
        </form>
    );
}