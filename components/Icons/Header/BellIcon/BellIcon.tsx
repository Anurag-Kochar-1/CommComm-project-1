import React from 'react'
import {BiBell} from "react-icons/bi"
import { useDispatch } from 'react-redux'
import { setIsNotificationModalOpen } from '../../../../redux/slices/modalSlice'

const BellIcon = () => {
  const dispatch = useDispatch()

  const openModal = () => {
    dispatch(setIsNotificationModalOpen(true))
  }
  
  return (
    <button type='button' title='searchIcon' className='relative w-10 h-10 border-black bg-black border rounded-full flex justify-center items-center' onClick={openModal}> 
          <span className='w-10 h-10 rounded-full bg-BrutalYellow1 flex justify-center items-center absolute right-[1px] bottom-[1.5px] border border-black active:bottom-0 active:right-0'>
            <BiBell className='text-lg text-black'/>
          </span>
      </button>
  )
}

export default BellIcon