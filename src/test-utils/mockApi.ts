import { vi } from "vitest";
import type { Item } from "../types/item";

type LoadDataResult = { items: Item[]; total: number };

type LoadDataFn = (
    searchTerm: string,
    page: number
) => Promise<LoadDataResult>;

type LoadDetailsFn = (id: string) => Promise<Item>;

export const loadDataMock = vi.fn<LoadDataFn>();
export const loadDetailsMock = vi.fn<LoadDetailsFn>();

export const resetApiMocks = () => {
    loadDataMock.mockReset();
    loadDetailsMock.mockReset();
};
