import React from 'react'
import { RxCross2 } from "react-icons/rx"
import { useDispatch } from "react-redux"
import { setIsCreateOptionsModalOpen } from "../../../../redux/slices/modalSlice"

const CrossIcon = () => {
    const dispatch = useDispatch()
    return (
        <button
            onClick={() => {
                dispatch(setIsCreateOptionsModalOpen(false))
            }}
            type='button'
            title='home'
            className='w-8 h-8 bg-black outline-none flex justify-center items-center rounded-md relative ' >

            <div className='w-8 h-8 bg-BrutalRed1 flex justify-center items-center rounded-md absolute bottom-1 right-1 border-2 border-black active:bottom-0 active:right-0' >

                <RxCross2 className='text-sm' />
            </div>
        </button>
    )
}

export default CrossIcon