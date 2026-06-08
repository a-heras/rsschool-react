import { describe, expect, it } from 'vitest';
import { createFormSchema } from './formSchema';

const schema = createFormSchema(['Belarus']);

const base = {
    name: 'Anna',
    age: 25,
    email: 'a@b.com',
    gender: 'male',
    termsAccepted: true,
    password: 'Abc123!',
    country: 'Belarus',
    image: new File(['x'], 'a.png', { type: 'image/png' }),
};

describe('formSchema confirmPassword', () => {
    it('requires confirm password', () => {
        const result = schema.safeParse({ ...base, confirmPassword: '' });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(
                result.error.issues.some(
                    (issue) =>
                        issue.path.includes('confirmPassword') &&
                        issue.message === 'Confirm password is required'
                )
            ).toBe(true);
        }
    });

    it('rejects mismatched passwords when other fields are empty', () => {
        const result = createFormSchema(['Belarus'], 'Abc123!').safeParse({
            name: '',
            age: undefined,
            email: '',
            gender: '',
            termsAccepted: undefined,
            password: 'Abc123!',
            confirmPassword: 'A',
            country: '',
            image: undefined,
        });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(
                result.error.issues.some(
                    (i) =>
                        i.path.includes('confirmPassword') &&
                        i.message === 'Passwords must match'
                )
            ).toBe(true);
        }
    });

    it('rejects invalid image type and oversized file', () => {
        const invalidType = schema.safeParse({
            ...base,
            confirmPassword: 'Abc123!',
            image: new File(['x'], 'photo.gif', { type: 'image/gif' }),
        });

        expect(invalidType.success).toBe(false);

        const oversized = schema.safeParse({
            ...base,
            confirmPassword: 'Abc123!',
            image: new File([new Uint8Array(1024 * 1024 + 1)], 'big.png', {
                type: 'image/png',
            }),
        });

        expect(oversized.success).toBe(false);
    });

    it('accepts jpeg by extension when mime type is missing', () => {
        const result = schema.safeParse({
            ...base,
            confirmPassword: 'Abc123!',
            image: new File(['x'], 'photo.jpg', { type: '' }),
        });

        expect(result.success).toBe(true);
    });

    it('rejects mismatched passwords', () => {
        const result = schema.safeParse({ ...base, confirmPassword: 'x' });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(
                result.error.issues.some(
                    (i) =>
                        i.path.includes('confirmPassword') &&
                        i.message === 'Passwords must match'
                )
            ).toBe(true);
        }
    });
});
