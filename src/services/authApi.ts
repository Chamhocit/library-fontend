import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { type } from "os";
import Role from "../models/Role";

export const authApi=createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl:"https://localhost:8443/api/auth",
    }),
    endpoints: (builder)=>({
        loginUser: builder.mutation({
            query: (body:{email: string; password: string})=>{
                return{
                    url: "/authenticate",
                    method: "post",
                    body,
                }
            }
        }),
        logoutUser: builder.mutation({
            query: (token: string)=>{
                return{
                    url: "/logout",
                    method: "post",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            }
        }),
        RegisterUser: builder.mutation({
            query: (body:{name: string, phone:string, email: string,  password: string, roles: Role[]})=>{
                return{
                    url: "/register",
                    method: "post",
                    body,
                }
            }
        }),
    })
});

export const {useLoginUserMutation, useLogoutUserMutation, useRegisterUserMutation} = authApi;
