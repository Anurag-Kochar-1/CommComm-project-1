import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    currentUserData: {},
    allUsersData: [],
    
    userJoinedCommunities: []
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentUserData: (state, action) => {
            state.currentUserData = action.payload
        },
        setAllUsersData: (state, action) => {
            state.allUsersData = action.payload
        },

        setUserJoinedCommunities: (state, action) => {
            state.userJoinedCommunities = action.payload
        }
    }
})


export const {setCurrentUserData, setAllUsersData, setUserJoinedCommunities} = userSlice.actions

export default userSlice.reducer