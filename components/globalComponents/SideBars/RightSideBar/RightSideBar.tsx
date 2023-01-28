import React, { useEffect, useState } from 'react'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { auth, db } from '../../../../firebaseConfig'
import Link from 'next/link'
import Image from 'next/image'
import { ICommunityData } from '../../../../customTypesAndInterfaces/Community/CommunityInterfaces'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import SmallCommunityCard from '../../CommunityCards/SmallCommunityCard/SmallCommunityCard'
import { useDispatch, useSelector } from 'react-redux'
import { IUserData } from '../../../../customTypesAndInterfaces/User/userInterfaces'
import UserCard from '../../UserCard/UserCard'
import { clear, Console } from 'console'
import { setCurrentCommunityMembers } from '../../../../redux/slices/communityDataSlice'

const RightSideBar = () => {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const { id } = router.query

  const dispatch = useDispatch()

  const [leaderBoardUsersState, setLeaderBoardUsersState] = useState<IUserData[]>([])

  const trendingCommunitiesData: ICommunityData[] = useSelector((state: any) => state?.communityData?.trendingCommunities)
  const currentCommunityMembersData: IUserData[] = useSelector((state: any) => state?.communityData.currentCommunityMembers)

  const fetchLeaderBoardUsers = async () => {
    if (!leaderBoardUsersState[0]) {
      try {
        const usersCollectionRef = collection(db, 'users')
        const usersQuery = query(usersCollectionRef, orderBy("userCoins", "desc"), limit(5))
        const usersQueryData = await getDocs(usersQuery)

        const res: IUserData[] = usersQueryData?.docs?.map(doc => doc.data() as IUserData)
        setLeaderBoardUsersState(res)




      } catch (error) {
        console.log(error)
      }
    } else if (leaderBoardUsersState[0]) {
      console.log(`Leaderboard data already there`);
    }
  }

  const fetchCurrentCommunityMembersData = async () => {
    if (!currentCommunityMembersData[0] && id) {
      console.log(`fetchCurrentCommunityMembersData is running`)
      const userCollectionRef = collection(db, 'users')
      const currentCommunityMembersQuery = query(userCollectionRef, where("communitiesJoinedID", "array-contains", id))
      const currentCommunityMembersRes = await getDocs(currentCommunityMembersQuery)
      const currentCommunityMembersData = currentCommunityMembersRes?.docs?.map(doc => doc?.data())

      dispatch(setCurrentCommunityMembers(currentCommunityMembersData))
    } else if (currentCommunityMembersData[0]) {
      console.log(`CurrentCommunityMembersData Found`)
    }
  }

  useEffect(() => {

    fetchLeaderBoardUsers()
    fetchCurrentCommunityMembersData()
  }, [id])





  return (
    <div className='hidden lg:inline-flex w-[20%] h-[90vh] mt-[12vh] bg-white flex-col justify-start items-center'>
      <div className='w-[95%] h-full flex flex-col justify-start items-center bg-gray-100  overflow-x-hidden overscroll-y-scroll pt-10 pb-32  space-y-10 scrollbar-hide'>


        {/* <h1 onClick={() => console.log(router)} className="my-5"> log router </h1> */}
        {/* <h1 onClick={() => console.log(currentCommunityMembersData)} className="my-5"> log currentCommunityMembersData </h1> */}


        {/* Trending Communities */}
        {router.pathname !== "/register" && router.pathname !== "/login" && router.pathname !== "/createCommunity" && !router.query.id ? (
          <div className='w-[90%] flex flex-col justify-start items-center space-y-4 bg-[#FF5E5E] border-2 border-black py-10 rounded-sm' >
            <h3 className='font-BebasNeue px-2 text-center  lg:text-3xl xl:text-4xl text-black'> Trending Communities </h3>

            {trendingCommunitiesData[0] && (
              trendingCommunitiesData?.slice(0, 10)?.map((community: ICommunityData) => {
                return (
                  <SmallCommunityCard community={community} key={community?.communityID} />
                )
              })
            )}

          </div>
        ) : null}



        {/* Community Members list  */}
        {router.query.id && currentCommunityMembersData[0] ? (

          <div className='w-[90%]  flex flex-col justify-start items-center space-y-4 bg-BrutalGreen2 border-2 border-black py-10 rounded-sm' >
            <h3 className='font-BebasNeue px-2 text-center  lg:text-3xl xl:text-4xl text-black' onClick={() => console.log(currentCommunityMembersData)}> Members </h3>
            {currentCommunityMembersData && currentCommunityMembersData?.map((user) => {
              return <UserCard userData={user} key={user?.userID} />
            })}

            
          </div>

        ) : null}


        {/* Global Leaderboard */}
        {!router.query.id && leaderBoardUsersState && (
          <div className='w-[90%] flex flex-col justify-start items-center space-y-4 bg-BrutalBlue1 border-2 border-black py-10 rounded-sm' >
            <h3 className='font-BebasNeue px-2 text-center  lg:text-3xl xl:text-4xl text-black' onClick={() => console.log(leaderBoardUsersState)}> Global Leaderboard </h3>

            {leaderBoardUsersState[0] && (
              leaderBoardUsersState?.map((user: IUserData) => {
                return (
                  <UserCard userData={user} key={user?.userID} />
                )
              })
            )}

          </div>
        )}




      </div>
    </div>
  )
}

export default RightSideBar