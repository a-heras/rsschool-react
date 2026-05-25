import type { Item } from "../types/item";

function escapeCsvField(value: string): string {
    if (/[",\n\r]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

function buildDetailsUrl(origin: string, itemId: number): string {
    const params = new URLSearchParams({ page: "1", details: String(itemId) });
    return `${origin}/?${params.toString()}`;
}

function buildCsv(items: Item[], origin: string): string {
    const header = ["id", "name", "description", "details_url"];
    const rows = items.map((item) => [
        String(item.id),
        escapeCsvField(item.name),
        escapeCsvField(item.description),
        escapeCsvField(buildDetailsUrl(origin, item.id)),
    ]);

    return [header.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

export function downloadSelectedItemsCsv(items: Item[], origin: string): void {
    if (items.length === 0) return;

    const csv = buildCsv(items, origin);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${items.length}_items.csv`;
    link.click();

    URL.revokeObjectURL(url);
}
