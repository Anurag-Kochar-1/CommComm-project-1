import { collection, getDocs } from 'firebase/firestore'
import Link from 'next/link'
import React from 'react'
import PostCard from '../../components/globalComponents/Posts/PostCard/PostCard'
import ExploreTabs from '../../components/pageWiseComponents/explore/ExploreTabs/ExploreTabs'
import { IPost } from '../../customTypesAndInterfaces/Posts/postInterface'
import { auth, db } from '../../firebaseConfig'

interface IProps {
  allPostsArray: IPost[]
}

const Index = ({ allPostsArray }: IProps) => {
  return (
    <main className='w-full lg:w-[60%] h-[80vh] lg:h-[90vh] mt-[12vh] mb-[10vh] lg:mb-0 bg-gray-100 flex flex-col justify-start items-center overflow-x-hidden overflow-y-scroll scrollbar-hide'>

      <ExploreTabs />

      <div className='w-full flex flex-col justify-start items-center my-14 space-y-5'>
          {allPostsArray && (
            allPostsArray.map((postData: IPost) => {
              return <PostCard postData={postData} key={postData?.postID} page={"explorePostsPage"} />
            })
          )}
      </div>


    </main>
  )
}

export default Index



export const getServerSideProps = async () => {

  // fetching all posts 
  const postCollectionRef = collection(db, "posts")
  const data = await getDocs(postCollectionRef)

  

  const allPostsArray:IPost[] = JSON.parse(JSON.stringify( data?.docs?.map(doc => doc.data() as IPost)))

  allPostsArray.sort(function (a, b) {
        if (a.upvotedByUserID.length < b.upvotedByUserID.length) { return 1 }
        if (a.upvotedByUserID.length > b.upvotedByUserID.length) { return -1 }
        return 0
      })



  return {
    props: {
      allPostsArray,
    }
  };
}

