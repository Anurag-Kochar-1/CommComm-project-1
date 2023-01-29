import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    email: "demo89@gmail.com",
    userName: "DemoUser",
    passWord: "xxxyyyzzz",
    isDemoUserAuthenticated: false
}

const DemoUserSlice = createSlice({
    name: "DemoUserSlice",
    initialState,
    reducers: {
        signInDemoUser: (state, action) => {
            if(state.email === action.payload && state.passWord === action.payload) {
                state.isDemoUserAuthenticated = true
            }
        }
    }
})

export const {signInDemoUser} = DemoUserSlice.actions
export default DemoUserSlice.reducer