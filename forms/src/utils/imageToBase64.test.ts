import { afterEach, describe, expect, it, vi } from 'vitest';
import { fileToBase64 } from './imageToBase64';

type MockReader = {
    result: string | ArrayBuffer | null;
    onload: (() => void) | null;
    onerror: (() => void) | null;
    readAsDataURL: ReturnType<typeof vi.fn>;
};

function mockFileReader(implementation: (reader: MockReader, file: File) => void) {
    class MockFileReader implements MockReader {
        result: string | ArrayBuffer | null = null;
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        readAsDataURL = vi.fn((file: File): void => {
            implementation(this, file);
        });
    }

    vi.stubGlobal('FileReader', MockFileReader);
}

describe('fileToBase64', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('converts file to base64 data url', async () => {
        mockFileReader((reader) => {
            reader.result = 'data:image/png;base64,dGVzdA==';
            reader.onload?.();
        });

        const file = new File(['x'], 'photo.png', { type: 'image/png' });
        await expect(fileToBase64(file)).resolves.toBe('data:image/png;base64,dGVzdA==');
    });

    it('rejects when result is not a string', async () => {
        mockFileReader((reader) => {
            reader.result = new ArrayBuffer(8);
            reader.onload?.();
        });

        const file = new File(['x'], 'photo.png', { type: 'image/png' });
        await expect(fileToBase64(file)).rejects.toThrow('Failed to convert image to base64');
    });

    it('rejects when reading fails', async () => {
        mockFileReader((reader) => {
            reader.onerror?.();
        });

        const file = new File(['x'], 'photo.png', { type: 'image/png' });
        await expect(fileToBase64(file)).rejects.toThrow('Failed to read image file');
    });
});
