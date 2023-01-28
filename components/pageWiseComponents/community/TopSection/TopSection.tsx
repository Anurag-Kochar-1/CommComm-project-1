import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDispatch, useSelector } from 'react-redux'
import { ICommunityData } from '../../../../customTypesAndInterfaces/Community/CommunityInterfaces'
import { auth, db } from '../../../../firebaseConfig'
// import demoLogo from "../../../../public/images/bg/demo.jpg"
import NavTabs from '../NavTabs/NavTabs'
import TagBox from '../TagBox/TagBox'
import { setCurrentCommunityData } from "../../../../redux/slices/communityDataSlice"
import SettingsIcon from '../../../Icons/SettingsIcon/SettingsIcon'
import { IUserData } from '../../../../customTypesAndInterfaces/User/userInterfaces'
import JoinCommunityButton from '../../../Icons/JoinCommunityButton/JoinCommunityButton'


const TopSection = () => {

    const [user, loading] = useAuthState(auth)
    const router = useRouter()
    const { id } = router.query


    const communityData: ICommunityData = useSelector((state: any) => state.communityData.currentCommunityData[0])
    const currentUserData: IUserData = useSelector((state: any) => state.user.currentUserData)

    return (
        <div className='w-full flex flex-col items-center justify-start bg-gray-100'>
            {/* ---- Banner ----  */}
            <div
                onClick={() => console.log(communityData)}
                className='w-full bg-white h-[25vh] lg:h-[20vh] flex justify-start items-end'
                style={{
                    backgroundImage: 'url(' + `${communityData?.communityBanner || "https://designmodo.com/wp-content/uploads/2017/08/gradient-1.jpg"}` + ')',
                    backgroundSize: "cover",
                }}
                draggable="false"
            >

                <div className='relative w-16 h-16 lg:w-20 lg:h-20 border-1 border-black mx-3 -my-5 lg:mx-5 bg-black rounded-sm'>
                    {/* {communityData} */}

                    {communityData?.communityLogo ? (
                            <Image unoptimized src={communityData?.communityLogo} width={15} height={15} alt="logo" className='absolute right-[4px] bottom-[4px] border border-black w-16 h-16 lg:w-20 lg:h-20 aspect-square rounded-sm' onClick={() => console.log(communityData)} draggable="false" />
                    ) : (
                        <div className='absolute right-[4px] bottom-[4px] border bg-BrutalPurple2 border-black w-16 h-16 lg:w-20 lg:h-20 aspect-square rounded-sm' />
                    )}
                </div>
            </div>


            {/* ---- Details ----  */}
            <section className='w-full pt-3 flex flex-col justify-between items-center space-y-1 py-4 px-3 lg:px-5'>

                {/* Name, join button and Settings button */}
                <div className='w-full flex justify-between items-center pt-5'>
                    <h2 className='text-3xl lg:text-3xl font-bold font-BebasNeue  text-black' onClick={() => console.log(currentUserData)}> {communityData?.communityName} </h2>

                    {/* Buttons */}
                    <div className='flex  justify-center items-center space-x-3 '>
                        <JoinCommunityButton />
                        <SettingsIcon />
                    </div>

                </div>

                {/* total Members and online members */}
                <div className='w-full flex justify-start items-center space-x-2'>
                    <p className='text-black text-sm font-light font-InriaSans'> {communityData?.communityMembersID?.length} members </p>
                    <p className='text-black text-sm font-light font-InriaSans'> {communityData?.communityMembersID?.length} online </p>
                </div>

                {/* Community Description */}
                <div className='w-full flex justify-start items-center space-x-2'>
                    {communityData?.communityDescription?.length > 130 && <p className='text-black font-normal font-InriaSans text-sm'> {communityData?.communityDescription.slice(0, 130)}..... <Link href={`/community/${id}/About`} className='text-blue-700 opacity-70 font-normal text-sm hover:cursor-pointer'> read more </Link> </p>}

                    {communityData?.communityDescription?.length <= 130 && <p className='text-black font-normal font-InriaSans text-sm'> {communityData?.communityDescription} </p>}
                </div>



                {/* Tags */}
                <div className='w-full flex justify-start items-center space-x-5 flex-wrap '>
                    <TagBox tagName={communityData?.communityCategory?.toUpperCase()} tagColor="bg-BrutalBlue1" />
                    <TagBox tagName={communityData?.communitySubCategory?.toUpperCase()} tagColor="bg-BrutalPurple1" />
                </div>



            </section>


            <NavTabs />




        </div>
    )
}

export default TopSection