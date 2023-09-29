import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";


export const bookApi = createApi({
    reducerPath: "bookApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://localhost:8443/api/books",
    }),
    endpoints: (builder)=>({
        getbooks: builder.query({
            query: (urlQuery:string)=>{
                return {
                    url: urlQuery,
                    method: "get",
                }
            }
        })
    }),
});

export const { useGetbooksQuery } = bookApi;