import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ICommunityData } from '../../../../customTypesAndInterfaces/Community/CommunityInterfaces'

interface IProps {
    communityData: ICommunityData
}

const CommunityCard = ({ communityData }: IProps) => {
    return (
        <div className='w-full h-72 sm:w-[60%] md:w-[40%] xl:w-[30%] relative  bg-black flex flex-col justify-start items-center rounded-md' onClick={() => console.log(communityData)}>

            <Link
            href={`/community/${communityData.communityID}`}
            className="absolute sm:right-1 sm:bottom-1 w-full h-72 border bg-white border-black flex flex-col justify-start items-center rounded-md"
            >

                {/* Banner and Logo */}
                <div
                    className='w-full h-full flex justify-center items-end p-5 border-1 border-black rounded-md'
                    style={{
                        backgroundImage: 'url(' + `${communityData?.communityBanner || "https://designmodo.com/wp-content/uploads/2017/08/gradient-1.jpg"}` + ')',
                        backgroundSize: "cover",
                    }}>

                    {communityData.communityLogo !== null && (
                        <img src={communityData.communityLogo as string} width={16} height={16} alt="pfp" className='w-16 h-16  rounded-full object-contain aspect-square border-2 border-black' />
                    )}

                    {communityData.communityLogo === null && (
                        <div className='w-16 h-16  rounded-full bg-BrutalAqua1 aspect-square border-2 border-black' />
                    )}
                </div>


                {/* Details */}
                <div className='w-full flex flex-col justify-start items-center space-y-3  text-black py-3 rounded-md'>
                    <h3 className='font-InriaSans font-bold text-xl'> {communityData.communityName} </h3>

                    <div className='w-full flex justify-center items-center space-x-5 flex-wrap '>
                        <div className='relative w-32 h-7 bg-black border border-black flex justify-center items-center my-2 rounded-full'>
                            <div className={`absolute w-32 h-7 flex justify-center items-center right-[2px] bottom-[2px] border border-black bg-BrutalYellow1 hover:cursor-pointer rounded-full`} > <p className='font-BebasNeue text-base text-black'> {communityData?.communityCategory} </p> </div>
                        </div>

                        <div className='relative w-32 h-7 bg-black border border-black flex justify-center items-center my-2 rounded-full'>
                            <div className={`absolute w-32 h-7 flex justify-center items-center right-[2px] bottom-[2px] border border-black bg-BrutalOrange1 hover:cursor-pointer rounded-full `} > <p className='font-BebasNeue text-base text-black'> {communityData?.communitySubCategory} </p> </div>
                        </div>
                    </div>

                </div>

            </Link>


        </div>
    )
}

export default CommunityCard