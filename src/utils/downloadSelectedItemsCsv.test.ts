import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { downloadSelectedItemsCsv } from "./downloadSelectedItemsCsv";
import type { Item } from "../types/item";

describe("downloadSelectedItemsCsv", () => {
    const items: Item[] = [
        { id: 1, name: "Alpha", description: "Desc A" },
        { id: 2, name: 'Beta, "quote"', description: "Line\nbreak" },
    ];

    let blobContent = "";
    let downloadLink: { href: string; download: string; click: ReturnType<typeof vi.fn> };
    const click = vi.fn();
    const createObjectURL = vi.fn(() => "blob:mock-url");
    const revokeObjectURL = vi.fn();
    const originalCreateElement = document.createElement.bind(document);

    beforeEach(() => {
        blobContent = "";
        click.mockClear();
        createObjectURL.mockClear();
        revokeObjectURL.mockClear();

        vi.stubGlobal("URL", {
            createObjectURL,
            revokeObjectURL,
        });

        vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
            if (tagName === "a") {
                downloadLink = { href: "", download: "", click };
                return downloadLink as unknown as HTMLAnchorElement;
            }
            return originalCreateElement(tagName);
        });

        class BlobMock {
            constructor(parts: BlobPart[]) {
                blobContent = parts.join("");
            }
        }

        vi.stubGlobal("Blob", BlobMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("does nothing when items array is empty", () => {
        downloadSelectedItemsCsv([], "http://localhost");

        expect(createObjectURL).not.toHaveBeenCalled();
        expect(click).not.toHaveBeenCalled();
    });

    it("downloads file with count in name", () => {
        downloadSelectedItemsCsv(items, "http://localhost");

        expect(downloadLink.download).toBe("2_items.csv");
    });

    it("builds csv with header and item fields", () => {
        downloadSelectedItemsCsv(items, "http://localhost");

        expect(blobContent).toContain("id,name,description,details_url");
        expect(blobContent).toContain("1,Alpha,Desc A");
        expect(blobContent).toContain("page=1&details=1");
        expect(blobContent).toContain("page=1&details=2");
    });

    it("escapes special characters in csv fields", () => {
        downloadSelectedItemsCsv(items, "http://localhost");

        expect(blobContent).toContain('"Beta, ""quote"""');
        expect(blobContent).toContain('"Line\nbreak"');
    });

    it("uses native download apis", () => {
        downloadSelectedItemsCsv(items, "http://localhost");

        expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
        expect(click).toHaveBeenCalledTimes(1);
        expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });
});
