import Image from 'next/image'
import React from 'react'
import { ICourse } from '../../../customTypesAndInterfaces/Course/courseInterfaces'
import { HiCalendarDays } from "react-icons/hi2"
import { AiFillYoutube } from 'react-icons/ai'
import { FiTarget } from 'react-icons/fi'
import { BsBook } from 'react-icons/bs'
import { useRouter } from 'next/router'

interface IProps {
    communityCourseData: ICourse
    courseNavTabs?: string
    setCourseNavTabs?: React.Dispatch<React.SetStateAction<string>>
}
// md:w-[60%] xl:w-[50%] 2xl:w-[45%]
const CommunityCourseCard = ({ communityCourseData, courseNavTabs, setCourseNavTabs }: IProps) => {

    const router = useRouter()

    return (
        <div className='w-[90%] sm:w-[70%] lg:w-[90%] h-auto lg:h-72 flex flex-col justify-start items-center border-2 border-black bg-black rounded-md hover:cursor-pointer'
            onClick={() => router.push(`/community/${communityCourseData?.communityID}/Courses`) }
        >

            <div className='w-full h-full flex flex-col lg:flex-row justify-start items-center border border-black bg-white rounded-md'>
                {/* Thumbnail */}
                <div className='w-full h-[70%] lg:h-full lg:w-[50%] xl:w-[45%] 2xl:w-[35%] aspect-video lg:p-2'>
                    {/* <Image
                        unoptimized
                        src={communityCourseData?.youtubeCourseThumbnail}
                        alt="thumbnail"
                        width={20}
                        height={20}
                        className={"h-full w-full aspect-video rounded-sm "}
                    /> */}

                    <img
                        src={communityCourseData?.youtubeCourseThumbnail}
                        alt="thumbnail"
                        className={"h-full w-full aspect-video rounded-sm "}
                    />
                </div>

                <div className='w-full h-full flex flex-col justify-start items-start space-y-1 py-5 px-2 rounded-md'>
                    {/* Title */}
                    <p className='text-black text-2xl font-Roboto font-bold py-2 text-left'> {communityCourseData?.courseName} </p>


                    <div className='w-full py-1 flex flex-col justify-start items-center space-y-2 '>
                        {/* ---- Tags ---- */}
                        <div className='w-full py-1 flex lg:flex-col flex-wrap lg:flex-nowrap justify-start items-center lg:items-start space-x-2 lg:space-x-0 lg:space-y-2'>
                            {/*  Days  */}
                            <div className='flex justify-center items-center space-x-2 bg-white p-1 hover:cursor-pointer'>
                                <span className='bg-BrutalOrange1 p-1 border border-black rounded-sm'>
                                    <HiCalendarDays />
                                </span>
                                <p className='text-black text-sm font-Roboto font-medium'> {communityCourseData?.courseDurationInDays} Days </p>
                            </div>

                            {/* Youtube */}
                            <div className='flex justify-start items-center space-x-2 bg-white p-1 hover:cursor-pointer'>
                                <span className='bg-BrutalRed1 p-1 border border-black rounded-sm '>
                                    <AiFillYoutube className='text-black' />
                                </span>
                                <p className='text-black text-sm font-Roboto font-medium'> {communityCourseData?.youtubeCourseChannelName} </p>
                            </div>

                            {/* Goal */}
                            <div className='hidden  lg:inline-flex justify-start items-center space-x-2 bg-white p-1 hover:cursor-pointer'>
                                <span className='bg-BrutalBlue1 p-1 border border-black rounded-sm '>
                                    <FiTarget className='text-black' />
                                </span>
                                <div className='flex justify-start items-center space-x-2'>
                                    <span className='text-black text-sm font-Roboto font-medium'> {"Goal : "} </span>
                                    <p className='text-blue-600 text-sm font-Roboto font-medium' onClick={() => {
                                        if (setCourseNavTabs) {
                                            setCourseNavTabs("details")
                                        } else {
                                            router.push(`/community/${communityCourseData?.communityID}/Courses`)
                                        }
                                    }}> {"Read Goals"} </p>
                                </div>
                            </div>

                            {/* Prerequisites */}
                            <div className='hidden  lg:inline-flex justify-start items-center space-x-2 bg-white p-1 hover:cursor-pointer'>
                                <span className='bg-BrutalYellow1 p-1 border border-black rounded-sm '>
                                    <BsBook className='text-black' />
                                </span>
                                <div className='flex justify-start items-center space-x-2'>
                                    <span className='text-black text-sm font-Roboto font-medium'> {"Prerequisites : "} </span>
                                    <p className='text-blue-600 text-sm font-Roboto font-medium' onClick={() => {
                                        if (setCourseNavTabs) {
                                            setCourseNavTabs("details")
                                        } else {
                                            router.push(`/community/${communityCourseData?.communityID}/Courses`)
                                        }
                                    }}> {"Read Prerequisites"} </p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    )
}

export default CommunityCourseCard