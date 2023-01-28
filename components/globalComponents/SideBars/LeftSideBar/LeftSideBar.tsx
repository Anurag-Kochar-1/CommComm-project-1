import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthState } from 'react-firebase-hooks/auth'
import { ICommunityData } from '../../../../customTypesAndInterfaces/Community/CommunityInterfaces'
import { auth, db } from '../../../../firebaseConfig'
import demo from "../../../../public/images/bg/demo.jpg"
import userDPdemo from "../../../../public/images/bg/userDPdemo.jpg"

import coinIcon from "../../../../public/images/icons/coinIcon.svg"
import { AiOutlineLogout } from 'react-icons/ai'
import { signOut } from 'firebase/auth'
import { IUserData } from '../../../../customTypesAndInterfaces/User/userInterfaces'
import { useSelector } from 'react-redux'
import SmallCommunityCard from '../../CommunityCards/SmallCommunityCard/SmallCommunityCard'
import { useRouter } from 'next/router'

const LeftSideBar = () => {
  // console.log(`------- Left Side Bar -------`);
  const router = useRouter()
  const [user, loading] = useAuthState(auth)
  const communityCollectionRef = collection(db, "communities")


  // --- Redux States ---
  const currentUserData: IUserData = useSelector((state: any) => state.user.currentUserData)
  const userJoinedCommunitiesData: ICommunityData[] = useSelector((state: any) => state?.user?.userJoinedCommunities)
  const suggestedCommunitiesData: ICommunityData[] = useSelector((state: any) => state?.communityData?.suggestedCommunities)


  return (
    <div className='hidden lg:inline-flex w-[20%] h-[90vh] mt-[12vh] bg-white flex-col justify-start items-center '>

      <div className='w-[95%] h-full flex flex-col justify-start items-center bg-gray-100 overflow-x-hidden overscroll-y-scroll pt-10 pb-40 space-y-10 scrollbar-hide'>

        {/* ------- Tabs ------- */}
        <div className='w-full flex flex-col justify-start items-center space-y-5'>
          <Link href={"/"}
            onClick={() => console.log(1)}
            className='relative w-[85%] h-14 bg-black border border-black flex justify-center items-center'
          >
            <span className='absolute w-full h-14 right-1 bottom-1 border-2 border-black bg-BrutalRed1 text-black font-BebasNeue text-2xl active:right-0 active:bottom-0 flex justify-center items-center'>
              Home
            </span>
          </Link>

          <Link href={"/explore"}
            className='relative w-[85%] h-14 bg-black border border-black flex justify-center items-center'
          >
            <span className='absolute w-full h-14 right-1 bottom-1 border-2 border-black bg-BrutalBlue1 text-black font-BebasNeue text-2xl active:right-0 active:bottom-0 flex justify-center items-center'>
              Explore
            </span>
          </Link>
        </div>

        {/* <h1 className='text-xl my-10' onClick={() => console.log(userJoinedCommunitiesData)}> LOG REDEX - userJoinedCommunitiesData </h1>
        <h1 className='text-xl my-10' onClick={() => console.log(suggestedCommunitiesData)}> LOG REDEX - suggestedCommunitiesData </h1> */}


        {/* ---- Suggested Communityies || My communities ---- */}

        <div className='w-[90%] flex flex-col justify-start items-center space-y-3 bg-BrutalPurple1 border-2 border-black py-10 rounded-sm' onClick={() => console.log(suggestedCommunitiesData)}>

          <h3 className='font-BebasNeue px-2 text-center lg:text-3xl xl:text-4xl text-black'>
            {user && !loading && currentUserData?.communitiesJoinedID?.length !== 0 ? "My Communities" : "Suggested Communities"}
          </h3>


          {/* My communities */}
          {currentUserData?.communitiesJoinedID?.length !== 0 && (
            userJoinedCommunitiesData.slice(0, 10).map((community: ICommunityData) => {
              return (
                <SmallCommunityCard community={community} key={community.communityID}/>
                )
              })
              )}

            
          {/* Suggested communities */}
          {currentUserData?.communitiesJoinedID?.length == 0 || !user ?   (
            suggestedCommunitiesData.slice(0, 10).map((community: ICommunityData) => {
              return (
                <SmallCommunityCard community={community} key={community.communityID}/>
              )
            })
          ): null }

        </div>



        {/* ---- Skeleton ---- */}
        {/* {!userJoinedCommunitiesData[0] || !suggestedCommunitiesData[0] ? (
          <div className='w-full h-full bg-BrutalOrange1 animate-pulse'>
          </div>
        ): null} */}




        {/* ------- Profile Card  -------*/}
        {user?.uid && (
          <div className='w-[20%] fixed bottom-0 left-0  flex flex-col justify-end items-center'>
            <div className='w-[95%] bg-gray-200 flex justify-start items-center px-2 py-4 space-x-3'>
              {user?.photoURL ? (
                <Image src={user?.photoURL} alt="dp" width={12} height={12} className='w-12 h-12 rounded-full hover:cursor-pointer' onClick={() => router.push(`/profile/${user?.uid}`)}/>
              ) :
                <Image src={userDPdemo as any} alt="dp" width={12} height={12} className='w-12 h-12 rounded-full hover:cursor-pointer' onClick={() => router.push(`/profile/${user?.uid}`)}/>
              }

              <div className='w-full flex flex-col justify-start items-start space-y-1'>
                <p className='font-InriaSans text-sm font-semibold hover:cursor-pointer' onClick={() => router.push(`/profile/${user?.uid}`)}> {user?.displayName} </p>
                <div className='w-full flex justify-start items-center space-x-2'>
                  <Image unoptimized src={coinIcon as string} alt="icon" width={5} height={5} className="w-5 h-5 rounded-full" onClick={() => router.push(`/profile/${user?.uid}`)} />
                  <span className='font-InriaSans font-semibold text-black text-sm'> {currentUserData?.userCoins} </span>
                </div>
              </div>

              <AiOutlineLogout className='w-8 h-8 mx-3 text-black hover:cursor-pointer' onClick={() => signOut(auth)} />

            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default LeftSideBar