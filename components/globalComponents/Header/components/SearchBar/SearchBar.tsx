import React from 'react'
import {BiSearch} from "react-icons/bi"

const SearchBar = () => {
    return (
        <div className='hidden md:inline-flex w-[50%] h-[5vh] bg-black justify-center items-center border-2 border-black rounded-sm hover:cursor-pointer'>

            <div className='w-full h-full bg-white rounded-sm flex justify-between items-center px-4'>
                <BiSearch className='text-lg lg:text-xl text-black mr-1 hover:cursor-pointer'/>
                <input
                    type="text"
                    placeholder='Search...'
                    className='w-full h-full bg-white outline-none focus:ring-0 px-2 placeholder:text-BrutalBlack1 text-BrutalBlack1'
                />
            </div>
        </div>
    )
}

export default SearchBar