import { describe, expect, it } from 'vitest';
import { createFormSchema } from '../validation/formSchema';

const schema = createFormSchema(['Belarus']);

const base = {
    name: 'Anna',
    email: 'a@b.com',
    gender: 'male',
    termsAccepted: true,
    password: 'Abc123!',
    confirmPassword: 'Abc123!',
    country: 'Belarus',
    image: new File(['x'], 'a.png', { type: 'image/png' }),
};

describe('age validation', () => {
    it('rejects letter e in age', () => {
        const result = schema.safeParse({ ...base, age: 'e' });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(
                result.error.issues.some((issue) => issue.path.includes('age'))
            ).toBe(true);
        }
    });

    it('rejects non-digit characters in age', () => {
        const result = schema.safeParse({ ...base, age: '2e5' });

        expect(result.success).toBe(false);
    });

    it('accepts valid numeric age', () => {
        const result = schema.safeParse({ ...base, age: '25' });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.age).toBe(25);
        }
    });
});
