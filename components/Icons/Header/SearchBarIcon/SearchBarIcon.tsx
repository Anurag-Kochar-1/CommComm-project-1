import React from 'react'
import {BiSearch} from "react-icons/bi"

const SearchBarIcon = () => {
  return (
    <>
      <button type='button' title='searchIcon' className='md:hidden relative w-10 h-10 border-black bg-black border rounded-full flex justify-center items-center'> 
          <span className='w-10 h-10 rounded-full bg-BrutalPurple1 flex justify-center items-center absolute right-[1px] bottom-[1.5px] border border-black active:bottom-0 active:right-0 hover:bottom-0 hover:right-0'>
            <BiSearch className='text-lg text-black hover:cursor-auto'/>
          </span>
      </button>
    </>
  )
}

export default SearchBarIcon