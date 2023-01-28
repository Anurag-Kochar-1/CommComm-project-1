
import React, { useEffect } from 'react'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { useRouter } from 'next/router'
import CommunityLayout from '../../../components/layouts/Community/CommunityLayout'
import NavTabs from '../../../components/pageWiseComponents/community/NavTabs/NavTabs'
import TopSection from '../../../components/pageWiseComponents/community/TopSection/TopSection'
import { db } from '../../../firebaseConfig'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentCommunityData, setCurrentCommunityMembers } from "../../../redux/slices/communityDataSlice"
import PostFeed from '../../../components/globalComponents/Posts/PostFeed/PostFeed'
import { setCurrentCommunityPostsData } from '../../../redux/slices/postsDataSlice'
import { IPost } from '../../../customTypesAndInterfaces/Posts/postInterface'
import { ICommunityData } from '../../../customTypesAndInterfaces/Community/CommunityInterfaces'
import { IUserData } from '../../../customTypesAndInterfaces/User/userInterfaces'


interface IProps {
  communityData: ICommunityData
  currentCommunityPosts: IPost[]
  currentCommunityMembersData: IUserData[]
}

const Index = ({ communityData, currentCommunityPosts, currentCommunityMembersData }: IProps) => {
  const router = useRouter()
  const { id } = router.query
  const dispatch = useDispatch()

  // const currentCommunityMembersDataRedux: IUserData[] = useSelector((state: any) => state.communityData.currentCommunityMembersData)




  useEffect(() => {
    // dispatch(setCurrentCommunityData([communityData]))
    // dispatch(setCurrentCommunityPostsData(currentCommunityPosts))

    // dispatching current Community Members list
    dispatch(setCurrentCommunityMembers( currentCommunityMembersData ))

  }, [id])

  return (
    <CommunityLayout>
      <main className='w-full bg-gray-100 flex flex-col justify-start items-center pt-0 pb-36'>


        {/* Community Posts Header */}
        <div className='w-full h-16 bg-black flex justify-start items-center space-x-2 px-4'>
          <span className='text-2xl'> 🔥 </span>
          <p className='text-2xl text-white font-Roboto font-bold'> {communityData?.communityName}'s  Posts </p>
        </div>


        <PostFeed posts={currentCommunityPosts} page={"communityPostsPage"} />


      </main>
    </CommunityLayout>
  )
}

export default Index




export const getServerSideProps = async ({ params }: any) => {
  const { id }: string | any = params

  // fetching community Details
  const communityRef = doc(db, "communities", id as string)
  const res = await getDoc(communityRef)
  const communityData = res.data()


  // fetching community posts 
  const postCollectionRef = collection(db, "posts")
  const allPostsData = await getDocs(postCollectionRef)



  // const allCommunityPosts:IPost[] = allPostsData?.docs?.map(doc => doc.data() as IPost).filter(doc => doc?.postCreateAtCommunityID === id)
  const currentCommunityPosts: IPost[] = JSON.parse(JSON.stringify(allPostsData?.docs?.map(doc => doc.data() as IPost).filter(doc => doc?.postCreateAtCommunityID === id)))


  // Fetching members list
  const userCollectionRef = collection(db, 'users') 
  const currentCommunityMembersQuery = query( userCollectionRef, where("communitiesJoinedID", "array-contains", id) )
  const currentCommunityMembersRes = await getDocs(currentCommunityMembersQuery)
  
  const currentCommunityMembersData = currentCommunityMembersRes?.docs?.map(doc => doc?.data())





  return {
    props: {
      communityData,
      currentCommunityPosts,
      currentCommunityMembersData
    }
  };
}


