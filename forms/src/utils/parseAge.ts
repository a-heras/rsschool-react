export function normalizeAgeInput(value: unknown): unknown {
    if (value === '' || value === null || value === undefined) {
        return undefined;
    }

    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : Number.NaN;
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();

        if (trimmed === '') {
            return undefined;
        }

        for (let index = 0; index < trimmed.length; index += 1) {
            const code = trimmed.charCodeAt(index);

            if (code < 48 || code > 57) {
                return Number.NaN;
            }
        }

        return Number(trimmed);
    }

    return value;
}
