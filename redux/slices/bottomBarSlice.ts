import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    isBottomBarVisible: true
}

const bottomBarSlice = createSlice({
    name: "bottomBar",
    initialState,
    reducers: {
        setIsBottomBarVisible: (state, action) => {
            state.isBottomBarVisible = action.payload
        }
    }
})


export const {setIsBottomBarVisible} = bottomBarSlice.actions
export default bottomBarSlice.reducer