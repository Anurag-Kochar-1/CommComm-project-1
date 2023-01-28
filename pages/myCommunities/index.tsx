import { collection, getDocs, query, where } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import SmallCommunityCard from '../../components/globalComponents/CommunityCards/SmallCommunityCard/SmallCommunityCard'
import { ICommunityData } from '../../customTypesAndInterfaces/Community/CommunityInterfaces'
import { auth, db } from '../../firebaseConfig'

const Index = () => {
  const router = useRouter()
  const [user, loading] = useAuthState(auth)
  const communityCollectionRef = collection(db, "communities")
  const [userJoinedCommunitiesState, setUserJoinedCommunitiesState] = useState<any[] | []>([])

  const fetchUserJoinedAndOwnedCommunities = async () => {
    if (user && !loading) {
      const queryTheUser = query(communityCollectionRef, where("communityMembersID", "array-contains", auth?.currentUser?.uid))
      const queryData = await getDocs(queryTheUser)
      setUserJoinedCommunitiesState(queryData.docs.map((doc: any) => ({ ...doc.data(), id: doc.id })));
    } else if (!user && !loading) {
      router.push("/register")
    }

  }

  useEffect(() => {
    fetchUserJoinedAndOwnedCommunities()
  }, [loading])


  return (
    <main className='w-full lg:w-[70%] h-[80vh] lg:h-[90vh] mt-[10vh] mb-[10vh] lg:mb-0 bg-BgBrutalSkin1 flex flex-col justify-start items-center'>

      <div className='w-[100%] h-full flex flex-col justify-start items-center space-y-4 bg-BrutalOrange1 border-2 border-black py-10 rounded-sm' >
        <h3 className='font-BebasNeue px-2 text-center text-5xl text-black my-3' onClick={() => console.log(userJoinedCommunitiesState)}>  My Communities  </h3>

        {userJoinedCommunitiesState && (
          userJoinedCommunitiesState.slice(0, 10).map((community: ICommunityData) => {
            return (
              <SmallCommunityCard community={community} key={community?.communityID}/>
            )
          })
        )}


        {!userJoinedCommunitiesState[0] && (
          <div className='w-full h-full flex flex-col justify-start items-center py-3'>
            <p className='text-black font-InriaSans font-bold text-xl'> No communities joined {":("} </p>
          </div>
        )}
      </div>
    </main>
  )
}

export default Index