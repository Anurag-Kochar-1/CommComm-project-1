import React from 'react'
import { useRouter } from 'next/router'
import { GrFormAdd } from "react-icons/gr"
import { useDispatch, useSelector } from "react-redux"
import { setIsCreateOptionsModalOpen } from "../../../../redux/slices/modalSlice"


const PlusIcon = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const isCreateOptionsModalOpen = useSelector((state: any) => state?.modal?.isCreateOptionsModalOpen)

    return (
            <button
            onClick={() => {
                dispatch(setIsCreateOptionsModalOpen(true))    
            }}
             type='button' 
             title='home' 
             className={isCreateOptionsModalOpen || router.pathname === "/createCommunity" || router.pathname === "/uploadPost" ? (
                'w-10 h-10 bg-black outline-none flex justify-center items-center rounded-md relative '
            ) : (
                'w-10 h-10 bg-white  outline-none flex justify-center items-center rounded-md'
            )} >
                <div className={isCreateOptionsModalOpen || router.pathname === "/createCommunity" || router.pathname === "/uploadPost" ? (
                    'w-10 h-10 bg-BrutalYellow1 flex justify-center items-center rounded-md absolute bottom-1 right-1 border-2 border-black active:bottom-0 active:right-0'
                ) : (
                    'w-10 h-10 bg-white flex justify-center items-center rounded-md'
                )}>
                    <GrFormAdd className='text-2xl' />
                </div>
            </button>
    )
}

export default PlusIcon