import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    allCommunitiesData: [],

    currentCommunityData: [],
    currentCommunityMembers: [],

    communityPosts: [],
    communitySettings: [],
    communityEvents: [],
    communityTextChannels: [],

    suggestedCommunities: [],
    trendingCommunities: [],

    communityTracksData: [],
    communityTrackPathsData: [],

    communityCoursesData: [],
    communityCoursePathsData: []


};

const communityDataSlice = createSlice({
    name: "communityData",
    initialState,
    reducers: {
        setCurrentCommunityData: (state, action) => {
            state.currentCommunityData = action.payload
        },


        setSuggestedCommunities: (state, action) => {
            state.suggestedCommunities = action.payload
        },

        setTrendingCommunities: (state, action) => {
            state.trendingCommunities = action.payload
        },

        setCommunityTracksData: (state, action) => {
            state.communityTracksData = action.payload
        },

        setCommunityTrackPathsData: (state, action) => {
            state.communityTrackPathsData = action.payload
        },


        setCommunityCoursesData: (state, action) => {
            state.communityCoursesData = action.payload
        },
        setCommunityCoursePathsData: (state, action) => {
            state.communityCoursePathsData = action.payload
        },

        setCurrentCommunityMembers: (state, action) => {
            state.currentCommunityMembers = action.payload
        }






    }
})


export const { setCurrentCommunityData, 
    setSuggestedCommunities, 
    setTrendingCommunities,
    setCommunityTracksData,
    setCommunityTrackPathsData,
    setCommunityCoursesData,
    setCommunityCoursePathsData,
    setCurrentCommunityMembers

} = communityDataSlice.actions

export default communityDataSlice.reducer