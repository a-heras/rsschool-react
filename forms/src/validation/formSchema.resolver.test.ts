import { describe, expect, it } from 'vitest';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFormSchema } from './formSchema';

const schema = createFormSchema(['Belarus']);
const resolver = zodResolver(schema);

const values = {
    name: 'Anna',
    age: 25,
    email: 'a@b.com',
    gender: 'male',
    termsAccepted: true as const,
    password: 'Abc123!',
    confirmPassword: 'x',
    country: 'Belarus',
    image: new File(['x'], 'a.png', { type: 'image/png' }),
};

describe('zodResolver confirmPassword', () => {
    it('returns confirmPassword error for mismatch', async () => {
        const result = await resolver(values, undefined, {
            fields: {},
            shouldUseNativeValidation: false,
        });

        expect(result.errors.confirmPassword?.message).toBe('Passwords must match');
    });
});
