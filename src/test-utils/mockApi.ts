import { vi } from "vitest";
import type { Item } from "../types/item";

type LoadDataResult = { items: Item[]; total: number };

type LoadDataFn = (
    searchTerm: string,
    page: number
) => Promise<LoadDataResult>;

export const loadDataMock = vi.fn<LoadDataFn>();

export const resetApiMocks = () => {
    loadDataMock.mockReset();
};
