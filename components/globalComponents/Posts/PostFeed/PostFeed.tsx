import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'
import { IPost } from '../../../../customTypesAndInterfaces/Posts/postInterface'
import PostCard from '../PostCard/PostCard'

interface IProps {
  posts: IPost[]
  page: string
}

const PostFeed = ( {posts, page}:IProps ) => {
  const postData = useSelector((state: any) => state.postsData.currentCommunityPostsData)

  return (
    <div
      className='w-full space-y-10 flex flex-col justify-start items-center my-5'
    >

      {posts[0] && (
        posts?.map((postData: IPost) => {
          return <PostCard postData={postData} key={postData?.postID} page={page} />
        })
      )}


      {!posts[0] && (
        <div className={`w-[90%] h-96 sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] bg-white border-2 border-black flex flex-col justify-center items-center p-2 md:p-4 rounded-sm md:rounded-md my-2 space-y-3`} >
            <p className='text-3xl font-bold tet-black'> No Posts yet </p>
            <Link href={'/UploadPost'} className="text-blue-500 font-medium text-lg"> Create some </Link>
        </div>
      )}
    </div>
  )
}

export default PostFeed