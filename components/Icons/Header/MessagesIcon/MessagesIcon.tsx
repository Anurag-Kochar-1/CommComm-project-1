import React from 'react'
import {BiMessageSquare} from "react-icons/bi"

const MessagesIcon = () => {
  return (
    <button type='button' title='searchIcon' className='relative w-10 h-10 border-black bg-black border rounded-full flex justify-center items-center'> 
          <span className='w-10 h-10 rounded-full bg-BrutalBlue1 flex justify-center items-center absolute right-[1px] bottom-[1.5px] border border-black active:bottom-0 active:right-0'>
            <BiMessageSquare className='text-lg text-black'/>
          </span>
    </button>
  )
}

export default MessagesIcon