import { describe, expect, it } from 'vitest';
import { validateEmail } from './validateEmail';

describe('validateEmail', () => {
    it('accepts valid email structure', () => {
        expect(validateEmail('anna@mail.com')).toBe(true);
    });

    it('rejects missing @', () => {
        expect(validateEmail('annamail.com')).toBe(false);
    });

    it('rejects empty local part', () => {
        expect(validateEmail('@mail.com')).toBe(false);
    });

    it('rejects domain without dot', () => {
        expect(validateEmail('anna@mail')).toBe(false);
    });

    it('rejects empty domain segment', () => {
        expect(validateEmail('anna@mail..com')).toBe(false);
    });
});
