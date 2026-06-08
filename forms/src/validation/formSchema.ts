import { z } from 'zod';
import { validateEmail } from '../utils/validateEmail';

const MAX_IMAGE_SIZE = 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/pjpeg'];

function normalizeImageInput(value: unknown): unknown {
    if (value instanceof FileList) {
        return value.item(0) ?? undefined;
    }

    if (value instanceof File) {
        return value.size > 0 ? value : undefined;
    }

    if (value === '' || value === null || value === undefined) {
        return undefined;
    }

    return value;
}

function isAllowedImageFile(file: File): boolean {
    if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return true;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension === 'png' || extension === 'jpg' || extension === 'jpeg';
}

export const createFormSchema = (countries: string[], passwordForConfirm = '') =>
    z
        .object({
            name: z
                .string()
                .trim()
                .min(1, 'Name is required')
                .refine(
                    (value) =>
                        value.charAt(0) === value.charAt(0).toUpperCase() &&
                        value.charAt(0) !== value.charAt(0).toLowerCase(),
                    'Name must start with an uppercase letter'
                ),
            age: z.coerce
                .number({
                    message: 'Age must be a number',
                })
                .int('Age must be a number')
                .nonnegative('Age cannot be negative'),
            email: z
                .string()
                .trim()
                .min(1, 'Email is required')
                .refine(validateEmail, 'Invalid email format'),
            gender: z.string().min(1, 'Gender is required'),
            termsAccepted: z.literal(true, {
                message: 'You must accept Terms and Conditions',
            }),
            password: z.string().min(1, 'Password is required'),
            confirmPassword: z
                .string()
                .min(1, 'Confirm password is required')
                .refine(
                    (confirmPassword) =>
                        !passwordForConfirm || passwordForConfirm === confirmPassword,
                    'Passwords must match'
                ),
            image: z.preprocess(
                normalizeImageInput,
                z
                    .instanceof(File, { message: 'Image is required' })
                    .refine(isAllowedImageFile, 'Image must be png or jpeg')
                    .refine(
                        (file) => file.size <= MAX_IMAGE_SIZE,
                        'Image size must be 1MB or less'
                    )
            ),
            country: z
                .string()
                .trim()
                .min(1, 'Country is required')
                .refine(
                    (value) => countries.includes(value),
                    'Country must be selected from the list'
                ),
        })
        .superRefine((data, ctx) => {
            if (passwordForConfirm) {
                return;
            }

            if (data.password !== data.confirmPassword) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'Passwords must match',
                    path: ['confirmPassword'],
                });
            }
        });

export type FormValues = z.infer<ReturnType<typeof createFormSchema>>;