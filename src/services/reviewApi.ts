
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://localhost:8443/api/reviews",
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