import { vi } from "vitest";
import type { Item } from "../types/item";

type LoadDataFn = (searchTerm: string) => Promise<Item[]>;

export const loadDataMock = vi.fn<LoadDataFn>();

export const resetApiMocks = () => {
  loadDataMock.mockReset();
};