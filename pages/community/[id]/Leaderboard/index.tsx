import React, {useState, useEffect} from 'react'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { useRouter } from 'next/router'
import CommunityLayout from '../../../../components/layouts/Community/CommunityLayout'
import { IUserData } from '../../../../customTypesAndInterfaces/User/userInterfaces'
import { db } from '../../../../firebaseConfig'
import UserCard from '../../../../components/globalComponents/UserCard/UserCard'

const Index = () => {
  const router = useRouter()
  const {id} = router.query

  const [communityUsersLeaderboardState, setCommunityUsersLeaderboardState] = useState<IUserData[]>([])


  const fetchCommunityUsersLeaderboard = async () => {
    const usersCollectionRef = collection(db, 'users')
    const usersQuery = query(usersCollectionRef,  orderBy("userCoins", "desc"), limit(5))
    const usersQueryData = await getDocs(usersQuery)
    const communityUserLeaderboarData:IUserData[] = usersQueryData?.docs?.map(doc => doc.data() as IUserData).filter(user => user?.communitiesJoinedID?.includes(id as string))

    setCommunityUsersLeaderboardState(communityUserLeaderboarData)
  }

  useEffect(() => {
    fetchCommunityUsersLeaderboard()
  },[id])

  return (
    <CommunityLayout>
      <main className='w-full h-full flex flex-col justify-start items-center bg-white pt-12 pb-36'>
      <div className='w-[90%] flex flex-col justify-start items-center space-y-4 bg-BrutalBlue1 border-2 border-black py-10 rounded-sm' >
            <h3 className='font-BebasNeue px-2 text-center text-3xl lg:text-3xl xl:text-4xl text-black' onClick={() => console.log(communityUsersLeaderboardState)}> Community Leaderboard </h3>

            {communityUsersLeaderboardState[0] && (
              communityUsersLeaderboardState?.map((user: IUserData) => {
                return (
                  <UserCard userData={user} key={user?.userID} />
                )
              })
            )}

          </div>
      </main>
    </CommunityLayout>
  )
}

export default Index


// export const getServerSideProps = async ({params}: any) => {
//   const {id} = params

  


//   return {
//     props: {communityUserLeaderboarData}
//   }
// }