import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signOut } from 'firebase/auth'
import { auth, db } from '../../firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import { IUserData } from '../../customTypesAndInterfaces/User/userInterfaces'
import { UserProfileBanners } from "../../constants/User/UserProfileBanners"
import { UserProfileDisplayPictures} from "../../constants/User/UserProfileDisplayPictures"
import Image from 'next/image'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { IPost } from '../../customTypesAndInterfaces/Posts/postInterface'
import PostFeed from '../../components/globalComponents/Posts/PostFeed/PostFeed'

interface IProps {
  profileDetails: IUserData
  userCreatedPosts: IPost[]
}

const Index = ({ profileDetails, userCreatedPosts }: IProps) => {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  // const currentUserData: IUserData = useSelector((state: any) => state.user.currentUserData)

  



  useEffect(() => {
    if (!user && !loading) {
      router.push(`/register`)
    }

  }, [user])

  return (
    <main className='w-full lg:w-[60%] h-[80vh] lg:h-[90vh] mt-[12vh] mb-[10vh] lg:mb-0 bg-purple-50 shadow-lg shadow-gray-300 flex flex-col justify-start items-center overflow-x-hidden overflow-y-scroll pb-20 scrollbar-hide'>
      {/* <h1 className='text-4xl text-red-500 font-bold mt-[7vh] my-3' onClick={() => { 
        signOut(auth)
        router.push("/")
        }}> Sign out </h1> */}

      {/* ----  Banner and Display Picture ----  */}
      <div className='w-full flex flex-col items-center justify-start mb-12'>
        <div
          onClick={() => console.log(profileDetails)}
          className='w-full h-[25vh] bg-white flex justify-center items-end'
          style={{
            backgroundImage: 'url(' + `${ UserProfileBanners[`${Math.floor(Math.random() * 2) }`]  }` + ')',
            backgroundSize: "cover",
          }}
          draggable="false"
        >

          {/* ----  Display Picture ----  */}
          <div className='w-28 h-28 -mb-5 border-2 border-black bg-black rounded-md'>
            <Image
              unoptimized
              src={profileDetails?.userDisplayPicture as string ||  UserProfileDisplayPictures[`${Math.floor(Math.random() * 4) }`]}
              alt="dp"
              width={12}
              height={12}
              className="w-full h-full -mt-1 -ml-1 border-2 border-black rounded-md" />
          </div>

        </div>
      </div>

      {/* ---- Name and Email ---- */}
      <div className='w-full flex flex-col items-center justify-start space-y-1'>
        <p className='text-2xl text-black font-Roboto font-black'> {profileDetails?.userName} </p>
        <p className='text-base text-black font-Roboto font-normal'> {profileDetails?.userEmail} </p>
      </div>

      {/* ---- Profile Stats ---- */}
      <div className='w-full flex flex-wrap items-center justify-center space-x-2 md:space-x-5 mt-5 mb-10'>
        {/*  Coins Button */}
        <div className='w-[90%] sm:w-[40%] md:w-48 h-20 border-2 border-black bg-black flex flex-col items-center justify-center rounded-md my-2'>
          <button
            type='button'
            title='communitiesJoined'
            className='w-full h-full -mt-1 -ml-1 border-2 border-black bg-BrutalOrange1 flex flex-col items-center justify-center text-center space-y-1 rounded-md'
          >
            <span className='text-2xl text-black font-Roboto font-black'> {profileDetails?.userCoins} </span>
            <span className='text-sm text-gray-800 font-Roboto font-normal'> Coins </span>
          </button>
        </div>

        {/*  Communities Joined Button */}
        <div className='w-[90%] sm:w-[40%] md:w-48 h-20 border-2 border-black bg-black flex flex-col items-center justify-center rounded-md my-2'>
          <button
            type='button'
            title='communitiesJoined'
            className='w-full h-full -mt-1 -ml-1 border-2 border-black bg-white flex flex-col items-center justify-center text-center space-y-1 rounded-md'
          >
            <span className='text-2xl text-black font-Roboto font-black'> {profileDetails?.communitiesJoinedID?.length} </span>
            <span className='text-sm text-gray-800 font-Roboto font-normal'> Communities Joined </span>
          </button>
        </div>

        {/*  Communities Onwned Button */}
        <div className='w-[90%] sm:w-[40%] md:w-48 h-20 border-2 border-black bg-black flex flex-col items-center justify-center rounded-md my-2'>
          <button
            type='button'
            title='communitiesJoined'
            className='w-full h-full -mt-1 -ml-1 border-2 border-black bg-white flex flex-col items-center justify-center text-center space-y-1 rounded-md'
          >
            <span className='text-2xl text-black font-Roboto font-black'> {profileDetails?.communitiesOwnedID?.length} </span>
            <span className='text-sm text-gray-800 font-Roboto font-normal'> Communities Owned </span>
          </button>
        </div>

        {/*  Posts Created Button */}
        <div className='w-[90%] sm:w-[40%] md:w-48 h-20 border-2 border-black bg-black flex flex-col items-center justify-center rounded-md my-2' onClick={() => console.log(userCreatedPosts)}>
          <button
            type='button'
            title='communitiesJoined'
            className='w-full h-full -mt-1 -ml-1 border-2 border-black bg-white flex flex-col items-center justify-center text-center space-y-1 rounded-md'
          >
            <span className='text-2xl text-black font-Roboto font-black'> {profileDetails?.createdPostsID?.length} </span>
            <span className='text-sm text-gray-800 font-Roboto font-normal'> Posts Created </span>
          </button>
        </div>



      </div>


      <div className='w-full bg-black flex justify-start items-center py-7 px-5 md:px-10'>
        <h3 className='text-lg md:text-2xl text-white font-Roboto font-bold'> {profileDetails?.userName}'s activities </h3>
      </div>


      {!userCreatedPosts[0] && (
        <span className='text-xl text-black font-Roboto font-medium my-20'> This user has created ZERO Posts </span>
      )}


      {userCreatedPosts[0] && (
        <PostFeed posts={userCreatedPosts} page={"profilePage"} />
      )}



    </main>
  )
}

export default Index


export const getServerSideProps = async ({ params }: any) => {
  const { profileID } = params

  const profileRef = doc(db, 'users', profileID as string)
  const res = await getDoc(profileRef)
  const profileDetails: IUserData = res.data() as IUserData


  const postsCollectionRef = collection(db, "posts")
  const userCreatedPostsQuery = query(postsCollectionRef, where("postCreatorID", "==", profileID))
  const userCreatedPostsQueryData = await getDocs(userCreatedPostsQuery)

  const userCreatedPosts: IPost[] = JSON.parse(JSON.stringify(userCreatedPostsQueryData?.docs?.map(doc => doc.data() as IPost)))


  return {
    props: {
      profileDetails,
      userCreatedPosts
    }
  }
}