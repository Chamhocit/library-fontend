import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface NameSate{
    userName: string|null;
}

const initialState :NameSate= {
    userName : null
}; 

export const nameSlice = createSlice({
    name: "authName",
    initialState,
    reducers: {
        setUserName: (state, action: PayloadAction<string> )=>{
            localStorage.setItem("userName", action.payload);
            state.userName = action.payload;
        },
        removeUsername: (state)=>{
            localStorage.clear();
            state.userName = null;
        }
    }

})

export const {setUserName, removeUsername} = nameSlice.actions;
export default nameSlice.reducer;
export const selectAuthName = (state: RootState) => state.authName;