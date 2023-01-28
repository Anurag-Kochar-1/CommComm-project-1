import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { MdExplore } from "react-icons/md"

const ExploreIcon = () => {

    const router = useRouter()

    return (
        <Link href={"/explore"}>

            {/* <button type='button' title='home' className={router?.pathname === "/" ? (
                'w-10 h-10 bg-[#FF9C6F] outline-none flex justify-center items-center rounded-md border border-black border-b-2 border-r-2 border-b-black border-r-black'
            ) : (
                'w-10 h-10 bg-white flex justify-center items-center' 
            )} > */}

            <button type='button' title='home' className={router?.pathname === "/explore" ? (
                'w-10 h-10 bg-black outline-none flex justify-center items-center rounded-md relative '
            ) : (
                'w-10 h-10 bg-white  outline-none flex justify-center items-center rounded-md'
            )} >
                <div className={router?.pathname === "/explore" ? (
                    'w-10 h-10 bg-BrutalGreen1 flex justify-center items-center rounded-md absolute bottom-1 right-1 border-2 border-black active:bottom-0 active:right-0'
                ) : (
                    'w-10 h-10 bg-white flex justify-center items-center rounded-md'
                )}>
                    <MdExplore className='text-2xl' />
                </div>
            </button>
        </Link>
    )
}

export default ExploreIcon