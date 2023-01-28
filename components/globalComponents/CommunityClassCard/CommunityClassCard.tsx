import React from 'react'
import { IClassData } from '../../../customTypesAndInterfaces/Class/classInterfaces'
import { IoMdCalendar } from "react-icons/io"
import { FiSettings } from "react-icons/fi"
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../../firebaseConfig'
import Link from 'next/link'
import CommunityClassOptionsDropdown from './CommunityClassOptionsDropdown/CommunityClassOptionsDropdown'

interface IProps {
    classDetails: IClassData
}

const CommunityClassCard = ({ classDetails }: IProps) => {
    const router = useRouter()
    const [user, loading] = useAuthState(auth)

    const joinClass =  () => {
        router.push(`${classDetails?.communityCourseClassLink}`)
    }

    

    return (
        // <div className='relative w-[95%] sm:w-[80%] md:w-[60%] lg:w-[70%] xl:w-[50%] h-72 sm:h-56 md:h-56 bg-white border-2 border-black rounded-md scrollbar-hide' onClick={() => console.log(classDetails)}>
        //     <div className='absolute bottom-2 right-2 w-full h-full bg-white border-2 border-black rounded-md scrollbar-hide'>
        //         <div className='absolute bottom-2 right-2 w-full h-full p-3 bg-white border-2 border-black rounded-md flex flex-col justify-start items-start space-y-3 overflow-x-hidden overflow-y-scroll scrollbar-hide'>

        //             {/* Timing Header and Options */}
        //             <div className='w-full flex justify-start items-center space-x-2'>
        //                 <IoMdCalendar className='text-xl text-BrutalPurple2' />
        //                 <p className='text-sm font-medium text-gray-800 flex-1'> {classDetails?.dateCreatedAt} {classDetails.communityCourseClassStartingTime} - {classDetails.communityCourseClassEndingTime} </p>
        //                 <CommunityClassOptionsDropdown classData={classDetails} />

        //             </div>

        //             {/* Community Class Name */}
        //             <h3 className='text-lg font-bold'> {classDetails?.communityCourseClassName} </h3>
        //             <p className='text-sm font-medium'> {classDetails?.communityCourseClassDescription} </p>

        //             {/* Line Divider */}
        //             <div className='w-full h-[1px] bg-black' />

        //             <div className='w-full flex justify-between items-center'>
        //                 <div className='flex justify-center items-center space-x-2'>
        //                     {classDetails?.communityLogo && <Image unoptimized src={classDetails?.communityLogo} alt="logo" className='w-7 h-7 rounded-full ' width={7} height={7} />}
        //                     <p className='text-sm font-normal text-black'> {classDetails?.communityName} </p>
        //                 </div>

        //                 <button
        //                     type='button'
        //                     className='outline-none border-none px-6 py-2 rounded-sm bg-BrutalPurple2 text-white font-medium text-sm'
        //                     onClick={joinClass}
        //                 >
        //                     <p> Join </p>
        //                 </button>

        //                 {/* <FiSettings /> */}
        //             </div>
        //         </div>
        //     </div>
        // </div>

        // h-72 sm:h-56 md:h-56

        <div className='w-[95%] sm:w-[80%] md:w-[60%] lg:w-[70%] xl:w-[50%]  bg-white border-2 border-black rounded-md scrollbar-hide my-10' onClick={() => console.log(classDetails)}>
            <div className='w-full h-full -mt-2 -ml-2 bg-white border-2 border-black rounded-md '>
                <div className='w-full h-full -mt-2 -ml-2 p-3 pb-12 bg-white border-2 border-black rounded-md flex flex-col justify-start items-start space-y-3 '>

                    {/* Timing Header and Options */}
                    <div className='w-full flex justify-start items-center space-x-2'>
                        <IoMdCalendar className='text-xl text-BrutalPurple2' />
                        <p className='text-sm font-medium text-gray-800 flex-1'> {classDetails?.dateCreatedAt} {classDetails.communityCourseClassStartingTime} - {classDetails.communityCourseClassEndingTime} </p>
                        { classDetails?.communityCourseClassCreatorID === user?.uid && <CommunityClassOptionsDropdown classData={classDetails} /> }

                    </div>

                    {/* Community Class Name */}
                    <h3 className='text-lg font-bold'> {classDetails?.communityCourseClassName} </h3>
                    <p className='text-sm font-medium'> {classDetails?.communityCourseClassDescription} </p>

                    {/* Line Divider */}
                    <div className='w-full h-[1px] bg-black' />

                    <div className='w-full flex justify-between items-center'>
                        <div className='flex justify-center items-center space-x-2'>
                            {classDetails?.communityLogo && <Image unoptimized src={classDetails?.communityLogo} alt="logo" className='w-7 h-7 rounded-full ' width={7} height={7} />}
                            <p className='text-sm font-normal text-black'> {classDetails?.communityName} </p>
                        </div>

                        <a
                            href={`${classDetails?.communityCourseClassLink}`}
                            target="_blank"
                            rel="noreferrer"
                            className='outline-none border-none px-6 py-2 rounded-sm bg-BrutalPurple2'
                        >
                            <span className='text-white font-medium text-sm'> Join </span>
                        </a>

                        {/* <FiSettings /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommunityClassCard