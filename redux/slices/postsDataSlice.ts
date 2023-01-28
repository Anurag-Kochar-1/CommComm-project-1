import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    allPostsData: [],
    currentCommunityPostsData: [],
    trendingPosts: []

};


const postsDataSlice = createSlice({
    name: "postsData",
    initialState,
    reducers: {
        setCurrentCommunityPostsData : (state, action) => {
            state.currentCommunityPostsData = action.payload
        },

        setAllPostsData: (state, action) => {
            state.allPostsData = action.payload
        }
    }
})

export const {setCurrentCommunityPostsData, setAllPostsData} = postsDataSlice.actions
export default postsDataSlice.reducer