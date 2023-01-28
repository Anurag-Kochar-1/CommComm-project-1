import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    isCreateOptionsModalOpen: false,
    isNotificationModalOpen: false,
    isCoinCreditedModalOpen: false  
    
}

const modalSlice =  createSlice({
    name: "modal",
    initialState,
    reducers: {
        setIsCreateOptionsModalOpen : (state, action) => {
            state.isCreateOptionsModalOpen = action.payload
        },
        setIsNotificationModalOpen : (state, action) => {
            state.isNotificationModalOpen = action.payload
        },
        setIsCoinCreditedModalOpen : (state, action) => {
            state.isCoinCreditedModalOpen = action.payload
        }
    }
})

export const {setIsCreateOptionsModalOpen, setIsNotificationModalOpen, setIsCoinCreditedModalOpen} = modalSlice.actions
export default modalSlice.reducer