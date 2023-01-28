import {useState} from "react"
import Image from 'next/image'
// import { Inter } from '@next/font/google'
import { useRouter } from 'next/router'
import { auth, db } from '../firebaseConfig'
import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { IPost } from '../customTypesAndInterfaces/Posts/postInterface'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAllPostsData } from '../redux/slices/postsDataSlice'
import PostFeed from '../components/globalComponents/Posts/PostFeed/PostFeed'
import PostCard from '../components/globalComponents/Posts/PostCard/PostCard'
import { useAuthState } from 'react-firebase-hooks/auth'
import { setCurrentUserData } from '../redux/slices/userSlice'
import { IUserData } from '../customTypesAndInterfaces/User/userInterfaces'
import { ICourse } from '../customTypesAndInterfaces/Course/courseInterfaces'
import CommunityCourseCard from '../components/globalComponents/CommunityCourseCard/CommunityCourseCard'
import AliceCarousel from 'react-alice-carousel'
// import { Bebas_Neue } from '@next/font/google'

// const inter = Inter({ subsets: ['latin'] })

interface IProps {
  allPostsArray: IPost[]
  popularCommunityCoursesData: ICourse[]
}

export default function Home({ allPostsArray, popularCommunityCoursesData }: IProps) {
  const router = useRouter()
  const [user, loading] = useAuthState(auth)
  const dispatch = useDispatch()

  const currentUserData: IUserData = useSelector((state: any) => state.user.currentUserData)

  const [userJoinedCoursesState, setUserJoinedCoursesState] = useState <ICourse[]> ([])

  const getUpcomingClasses = async () => {
    if(currentUserData) {
      try {
        const communityCourseQuery = query(collection(db, "communityCourses"))
        const communityCourseQueryRes = await getDocs(communityCourseQuery)
        const allCommunityCoursesData = communityCourseQueryRes?.docs?.map(doc => doc.data())

        const userJoinedCommunityCourses = allCommunityCoursesData.filter((course) => {
          if(currentUserData?.communitiesJoinedID?.includes(course.communityID)) {
            // setUserJoinedCoursesState( ...userJoinedCoursesState,  course )
          }
        })


        console.log(userJoinedCommunityCourses)
        console.log(`ssssssssss`)

      } catch (error) {
        console.error(error)
      }
    }
  }





  useEffect(() => {
    dispatch(setAllPostsData([allPostsArray]))



  }, [allPostsArray])


  // useEffect(() => {
  //   getUpcomingClasses()
  // },[loading, currentUserData])


  // useEffect(() => {
  //   if (communityCourseData[0]) {
  //     const classCollectionRef = collection(db, "communityCourses", communityCourseData[0]?.courseID, "courseClasses")
  //     const classesQuery = query(classCollectionRef, where("isClassEnded", "==", false))

  //     const unSubRealTimeClassesDataOnSnapShotListener = onSnapshot(classesQuery, (snapshot) => {
  //       setcommunityCourseClassesData(snapshot?.docs?.map(doc => doc.data() as IClassData))
  //     })

  //   }
  // }, [])





  const items = popularCommunityCoursesData?.map((course) => {
    return (
      <div className='w-full flex justify-center items-center' key={course?.courseID}>
        <CommunityCourseCard communityCourseData={course} />
      </div>
    )
  })

  const responsive = {
    0: {
      items: 1,
    },
    1280: {
      items: 1,
    }
  };




  return (
    <main className='w-full lg:w-[60%] h-[80vh] lg:h-[90vh] mt-[12vh] mb-[10vh] lg:mb-0 bg-gray-100 flex flex-col justify-start items-center overflow-x-hidden overflow-y-scroll pt-5 pb-20 scrollbar-hide'>

      {/* <h1 className='text-4xl text-blue-500 font-bold mt-[7vh]' onClick={() => console.log(auth?.currentUser)}> LOG USER</h1> */}
      {/* <h1 className='font-bold text-xl my-5' onClick={() => console.log(currentUserData)}> LOG currentUserData </h1> */}
      {/* <h1 className='text-5xl my-2 text-black font-light'> HELLO  </h1> */}
      {/* <h1 onClick={() => console.log(userJoinedCoursesState)} className='text-5xl my-2 text-black font-Roboto font-light'> log userJoinedCoursesState </h1> */}



      {/* ---- Popular Courses ---- */}
      {true ? (
        <div className='w-full bg-white border-2 border-black rounded-md flex flex-col justify-start items-center'>
          <div className='w-full h-12 md:h-16 bg-[#7E4BDE] rounded-tr-sm rounded-tl-sm flex justify-between items-center px-3'>
            {/* Dots */}
            <div className='flex justify-self-start items-center space-x-1 md:space-x-2'>
              <div className='w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#DE5D53] border border-black hover:cursor-pointer' />
              <div className='w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#68C6BA] border border-black hover:cursor-pointer' />
              <div className='w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#F5A860] border border-black hover:cursor-pointer' />
            </div>
            <p className=' text-black text-xl md:text-3xl font-Roboto font-bold'> Popular Courses </p>

            <span></span>
          </div>

          <div className='w-full flex flex-col justify-start items-start mb-5 scrollbar-hide py-5'>
            <div className='w-full flex justify-center items-center'>

            </div>

            <AliceCarousel
              infinite
              autoPlayInterval={2000}
              animationDuration={2500}
              disableButtonsControls
              disableDotsControls
              responsive={responsive}
              items={items}
              autoPlay
            />
          </div>
        </div>
      ) : null}


      {/* ---- All Posts - for signed out user ---- */}
      {true && (
        <PostFeed posts={allPostsArray} page={"homePage"} />

      )}




    </main>
  )
}


export const getServerSideProps = async () => {

  // fetching all posts 
  const postCollectionRef = collection(db, "posts")
  const data = await getDocs(postCollectionRef)
  const allPostsArray: IPost[] = JSON.parse(JSON.stringify(data?.docs?.map(doc => doc.data() as IPost)))


  // fetching popular communitiy courses
  const communityCoursesCollectionRef = collection(db, "communityCourses")
  const coursesQuery = query(communityCoursesCollectionRef, where("isCommunityCoursePopular", "==", true))
  const coursesQueryRes = await getDocs(coursesQuery)
  const popularCommunityCoursesData: ICourse[] = coursesQueryRes?.docs?.map(doc => doc.data() as ICourse)









  return {
    props: {
      allPostsArray,
      popularCommunityCoursesData

    }
  };
}

