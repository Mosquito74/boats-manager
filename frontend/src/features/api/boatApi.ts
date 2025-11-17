import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {Boat} from "./Boat.ts";

export const boatApi = createApi({
    reducerPath: 'boatApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Boat'],
    endpoints: (builder) => ({
        getBoats: builder.query<Boat[], void>({
            query: () => 'boats',
            providesTags: (result = []) => [
                ...result.map(({ id }) => ({ type: 'Boat' as const, id: String(id) })),
                { type: 'Boat', id: 'LIST' },
            ],
        }),
        getBoatById: builder.query<Boat, string>({
            query: (id) => `boats/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Boat', id }],
        }),
        createBoat: builder.mutation<Boat, Omit<Boat, 'id'>>({
            query: (boat) => ({
                url: 'boats',
                method: 'POST',
                body: boat,
            }),
            invalidatesTags: [{ type: 'Boat', id: 'LIST' }],
        }),
        deleteBoat: builder.mutation<void, number>({
            query: (id) => ({
                url: `boats/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Boat', id: 'LIST' }],
        }),
        updateBoat: builder.mutation<Boat, { id: number; boat: Partial<Boat> }>({
            query: ({ id, boat }) => ({
                url: `boats/${id}`,
                method: 'PUT',
                body: boat,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Boat', id: String(id) },
                { type: 'Boat', id: 'LIST' }
            ],
        }),
    }),
});

export const { 
    useGetBoatsQuery, 
    useGetBoatByIdQuery,
    useCreateBoatMutation,
    useDeleteBoatMutation,
    useUpdateBoatMutation
} = boatApi;