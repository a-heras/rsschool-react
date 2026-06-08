import { describe, expect, it, vi } from 'vitest';
import {
    handleAgeKeyDown,
    handleAgePaste,
    sanitizeAgeDigits,
} from './ageInput';

describe('sanitizeAgeDigits', () => {
    it('keeps only digits', () => {
        expect(sanitizeAgeDigits('25e')).toBe('25');
        expect(sanitizeAgeDigits('a1b2')).toBe('12');
    });
});

describe('handleAgeKeyDown', () => {
    it('prevents non-digit keys', () => {
        const preventDefault = vi.fn();

        handleAgeKeyDown({
            key: 'e',
            ctrlKey: false,
            metaKey: false,
            altKey: false,
            preventDefault,
        } as unknown as React.KeyboardEvent<HTMLInputElement>);

        expect(preventDefault).toHaveBeenCalledTimes(1);
    });

    it('allows digit keys', () => {
        const preventDefault = vi.fn();

        handleAgeKeyDown({
            key: '5',
            ctrlKey: false,
            metaKey: false,
            altKey: false,
            preventDefault,
        } as unknown as React.KeyboardEvent<HTMLInputElement>);

        expect(preventDefault).not.toHaveBeenCalled();
    });
});

describe('handleAgePaste', () => {
    it('inserts only digits from clipboard', () => {
        const input = document.createElement('input');
        input.value = '12';
        input.setSelectionRange(2, 2);

        const setRangeText = vi.fn();
        input.setRangeText = setRangeText;

        const dispatchEvent = vi.spyOn(input, 'dispatchEvent');

        handleAgePaste({
            preventDefault: vi.fn(),
            clipboardData: {
                getData: () => '3e4',
            },
            currentTarget: input,
        } as unknown as React.ClipboardEvent<HTMLInputElement>);

        expect(setRangeText).toHaveBeenCalledWith('34', 2, 2, 'end');
        expect(dispatchEvent).toHaveBeenCalled();
    });
});
