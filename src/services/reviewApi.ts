
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api/reviews",
    }),
    endpoints: (builder)=>({
        getReviews: builder.query({
            query: (urlQuery:string)=>{
                return {
                    url: urlQuery,
                    method: "get",
                }
            }
        })
    }),
});

export const {useGetReviewsQuery} = reviewApi;