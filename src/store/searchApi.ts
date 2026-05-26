import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { loadData, loadDetails } from '../api/api';
import { CACHE_TTL_SECONDS } from '../config/cache';
import type { Item } from '../types/item';

export type ItemsQueryArg = {
    term: string;
    page: number;
};

export type ItemsQueryResult = {
    items: Item[];
    total: number;
};

function toQueryError(message: string): { error: FetchBaseQueryError } {
    return {
        error: {
            status: 'CUSTOM_ERROR',
            error: message,
        },
    };
}

export const searchApi = createApi({
    reducerPath: 'searchApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    tagTypes: ['Items', 'Item'],
    keepUnusedDataFor: CACHE_TTL_SECONDS,
    endpoints: (builder) => ({
        getItems: builder.query<ItemsQueryResult, ItemsQueryArg>({
            async queryFn({ term, page }) {
                try {
                    const data = await loadData(term, page);
                    return { data };
                } catch {
                    return toQueryError('Failed to load data. Please try again.');
                }
            },
            providesTags: (_result, _error, { term, page }) => [
                { type: 'Items', id: 'LIST' },
                { type: 'Items', id: `${term}-${page}` },
            ],
        }),
        getItemDetails: builder.query<Item, string>({
            async queryFn(id) {
                try {
                    const data = await loadDetails(id);
                    return { data };
                } catch {
                    return toQueryError(
                        'Failed to load details. Please try again.'
                    );
                }
            },
            providesTags: (_result, _error, id) => [{ type: 'Item', id }],
        }),
    }),
});

export const { useGetItemsQuery, useGetItemDetailsQuery } = searchApi;