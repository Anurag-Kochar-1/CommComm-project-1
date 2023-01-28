import { collection, getDocs } from 'firebase/firestore'
import React from 'react'
import CommunityCard from '../../../components/pageWiseComponents/explore/CommunityCard/CommunityCard'
import ExploreTabs from '../../../components/pageWiseComponents/explore/ExploreTabs/ExploreTabs'
import { ICommunityData } from '../../../customTypesAndInterfaces/Community/CommunityInterfaces'
import { db } from '../../../firebaseConfig'

interface IProps {
  allCommunitiesArray: ICommunityData[]
}

const Index = ({ allCommunitiesArray }: IProps) => {
  return (
    <main className='w-full lg:w-[60%] h-[80vh] lg:h-[90vh] mt-[12vh] mb-[10vh] lg:mb-0 bg-gray-100 flex flex-col justify-start items-center overflow-x-hidden overflow-y-scroll scrollbar-hide'>
      <ExploreTabs />

      {/* <h1 onClick={() => console.log(allCommunitiesArray)}> LOG allCommunitiesArray </h1> */}

      <div className='w-full flex flex-col justify-start items-center my-14 space-y-5'>

        {allCommunitiesArray && (
          allCommunitiesArray.map((community: ICommunityData) => {
            return <CommunityCard communityData={community} key={community.communityID} />
          })
        )}

      </div>

    </main>
  )
}

export default Index



export const getServerSideProps = async () => {

  // fetching all communities
  const allCommunitiesArray: ICommunityData[] = []
  const communityCollectionRef = collection(db, "communities")
  const data = await getDocs(communityCollectionRef)

  data?.forEach((community) => {
    allCommunitiesArray.push(community?.data() as ICommunityData)
  })


  return {
    props: {
      allCommunitiesArray
    }
  };
}
