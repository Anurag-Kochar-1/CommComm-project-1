import Link from 'next/link'
import React from 'react'

const ExploreTabs = () => {
  return (
    <div className='w-full flex justify-center items-center py-4 space-x-2 sm:space-x-3 md:space-x-5 lg:space-x-10 flex-wrap sticky top-0 z-50 bg-gray-200 '>
        <Link 
        href={'/explore'}
        className="w-16 h-10 relative bg-black border border-black flex justify-center items-center rounded-lg my-2"
        >
          <div className='absolute w-16 h-10 right-1 bottom-1 bg-BrutalAqua1 border-4 border-black flex justify-center items-center rounded-lg active:right-0 active:bottom-0'>
            <p className='font-BebasNeue text-black text-xl '> Posts </p>
          </div>
        </Link>

        <Link 
        href={'/explore/communities'}
        className="w-28 h-10 relative bg-black border border-black flex justify-center items-center rounded-lg my-2"
        >
          <div className='absolute w-28 h-10 right-1 bottom-1 bg-BrutalAqua1 border-4 border-black flex justify-center items-center rounded-lg active:right-0 active:bottom-0'>
            <p className='font-BebasNeue text-black text-xl '> Communities </p>
          </div>
        </Link>

        <Link 
        href={'/explore/courses'}
        className="w-20 h-10 relative bg-black border border-black flex justify-center items-center rounded-lg my-2"
        >
          <div className='absolute w-20 h-10 right-1 bottom-1 bg-BrutalAqua1 border-4 border-black flex justify-center items-center rounded-lg active:right-0 active:bottom-0'>
            <p className='font-BebasNeue text-black text-xl '> Courses </p>
          </div>
        </Link>

      </div>
  )
}

export default ExploreTabs