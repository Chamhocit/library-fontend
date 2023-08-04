import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";


export const bookApi = createApi({
    reducerPath: "bookApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api/books",
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