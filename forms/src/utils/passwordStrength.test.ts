import { describe, expect, it } from 'vitest';
import { getPasswordStrength } from './passwordStrength';

describe('getPasswordStrength', () => {
    it('detects all strength requirements', () => {
        expect(getPasswordStrength('Abc123!')).toEqual({
            hasNumber: true,
            hasUppercase: true,
            hasLowercase: true,
            hasSpecialChar: true,
        });
    });

    it('returns false flags for empty password', () => {
        expect(getPasswordStrength('')).toEqual({
            hasNumber: false,
            hasUppercase: false,
            hasLowercase: false,
            hasSpecialChar: false,
        });
    });
});
