import type { ClipboardEvent, KeyboardEvent } from 'react';

const NAVIGATION_KEYS = new Set([
    'Backspace',
    'Delete',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
]);

export function toAgeFieldValue(sanitized: string): number | undefined {
    if (sanitized === '') {
        return undefined;
    }

    return Number(sanitized);
}

export function sanitizeAgeDigits(value: string): string {
    let result = '';

    for (let index = 0; index < value.length; index += 1) {
        const code = value.charCodeAt(index);

        if (code >= 48 && code <= 57) {
            result += value[index];
        }
    }

    return result;
}

export function handleAgeKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
    }

    if (NAVIGATION_KEYS.has(event.key)) {
        return;
    }

    if (event.key.length === 1 && event.key >= '0' && event.key <= '9') {
        return;
    }

    event.preventDefault();
}

export function handleAgePaste(event: ClipboardEvent<HTMLInputElement>): void {
    event.preventDefault();

    const digits = sanitizeAgeDigits(event.clipboardData.getData('text'));

    if (!digits) {
        return;
    }

    const input = event.currentTarget;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    input.setRangeText(digits, start, end, 'end');
    input.dispatchEvent(new Event('input', { bubbles: true }));
}
