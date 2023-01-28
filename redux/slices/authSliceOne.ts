import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isAuthenticated: false,
    status: "IDLE",


}

const authSliceOne = createSlice({
    name: "authSliceOne",
    initialState,
    reducers : {
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload
        },
        setStatus: (state, action) => {
            state.status = action.payload
        },
        
    }
})