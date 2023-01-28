import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSelector } from 'react-redux'
import CommunityClassCard from '../../../../components/globalComponents/CommunityClassCard/CommunityClassCard'
import CommunityLayout from '../../../../components/layouts/Community/CommunityLayout'
import { IClassData } from '../../../../customTypesAndInterfaces/Class/classInterfaces'
import { ICourse } from '../../../../customTypesAndInterfaces/Course/courseInterfaces'
import { IPathsData } from '../../../../customTypesAndInterfaces/Tracks/pathsInterface'
import { ITrackData } from '../../../../customTypesAndInterfaces/Tracks/tracksInterface'
import { IUserData } from '../../../../customTypesAndInterfaces/User/userInterfaces'
import { auth, db } from '../../../../firebaseConfig'

interface IProps {
  communityCourseData: ICourse[]
}

const Index = ({ communityCourseData }: IProps) => {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const { id } = router.query

  const currentUserData: IUserData = useSelector((state: any) => state?.user?.currentUserData)

  const [communityCourseClassesData, setcommunityCourseClassesData] = useState<IClassData[]>([])

  useEffect(() => {
    if (communityCourseData[0]) {
      const classCollectionRef = collection(db, "communityCourses", communityCourseData[0]?.courseID, "courseClasses")
      const classesQuery = query(classCollectionRef, where("isClassEnded", "==", false))

      const unSubRealTimeClassesDataOnSnapShotListener = onSnapshot(classesQuery, (snapshot) => {
        setcommunityCourseClassesData(snapshot?.docs?.map(doc => doc.data() as IClassData))
      })

    }
  }, [])


  // useEffect(() => {
  //   const communityMessagesRefAndQuery = query(collection(db, "communities", id as string, "communityMessages"), orderBy("messageCreatedAtTime", "asc"))
  //   const unSubRealTimeMessagesOnSnapShotListener = onSnapshot(communityMessagesRefAndQuery, (snapshot) => {
  //     setRealTimeMessagesState(snapshot.docs.map(doc => doc.data()))
  //   })
  // }, [])

  return (
    <CommunityLayout>
      <main className='w-full h-full flex flex-col justify-start items-center bg-white pt-12 pb-36'>

        {/* NO Course */}
        {!communityCourseData[0] && (
          <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] h-72 border-2 border-black flex flex-col justify-start items-center rounded-md bg-white">
            <div className="w-full h-full -mt-2 -ml-3 flex flex-col justify-center items-center border-2 border-black rounded-md bg-white">
              <div className="w-full h-full -mt-3 -ml-4 flex flex-col justify-start items-center border-2 border-black bg-white rounded-md text-center space-y-2">

                <div className='w-full h-12 bg-[#7E4BDE] rounded-tr-sm rounded-tl-sm flex justify-start items-center space-x-2 px-2'>
                  <div className='w-4 h-4 rounded-full bg-[#DE5D53] border border-black hover:cursor-pointer' />
                  <div className='w-4 h-4 rounded-full bg-[#68C6BA] border border-black hover:cursor-pointer' />
                  <div className='w-4 h-4 rounded-full bg-[#F5A860] border border-black hover:cursor-pointer' />
                </div>

                <div className='w-full h-full flex flex-col justify-center items-center'>
                  <span className=" text-[#F2A048] text-5xl font-Roboto font-bold"> No Course  </span>
                  {currentUserData?.communitiesOwnedID?.includes(id as string) && (
                    <Link href={`/community/${id}/Courses/createCourse`} className="text-[#7E4BDE] text-xl font-Roboto font-bold my-2"> Create course  </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Course and Classes Found !!! */}
        {communityCourseData[0] && communityCourseClassesData[0] ? (
          <div className='w-full flex flex-col justify-start items-center space-y-3 px-2 sm:px-0'>
            {communityCourseClassesData?.map((communityClass: IClassData) => (
              <CommunityClassCard classDetails={communityClass} key={communityClass?.classID} />
            ))}
          </div>
        ) : null}




        {/* Course But No Classes */}
        {communityCourseData[0] && !communityCourseClassesData[0] ? (
          <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] h-72 border-2 border-black flex flex-col justify-start items-center rounded-md bg-white">
            <div className="w-full h-full -mt-2 -ml-3 flex flex-col justify-center items-center border-2 border-black rounded-md bg-white">
              <div className="w-full h-full -mt-3 -ml-4 flex flex-col justify-start items-center border-2 border-black bg-white rounded-md text-center space-y-2">

                <div className='w-full h-12 bg-[#7E4BDE] rounded-tr-sm rounded-tl-sm flex justify-start items-center space-x-2 px-2'>
                  <div className='w-4 h-4 rounded-full bg-[#DE5D53] border border-black hover:cursor-pointer' />
                  <div className='w-4 h-4 rounded-full bg-[#68C6BA] border border-black hover:cursor-pointer' />
                  <div className='w-4 h-4 rounded-full bg-[#F5A860] border border-black hover:cursor-pointer' />
                </div>

                <div className='w-full h-full flex flex-col justify-center items-center'>
                  <span className=" text-[#F2A048] text-5xl font-Roboto font-bold"> No Class  </span>
                  {communityCourseData[0]?.courseCreatorID === user?.uid && (
                    <Link href={`/community/${id}/Classes/createClass`} className="text-[#7E4BDE] text-xl font-Roboto font-bold my-2"> Create class  </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}



      </main>
    </CommunityLayout>
  )
}

export default Index




export const getServerSideProps = async ({ params }: any) => {
  const { id } = params

  // Fetching community course
  const communityCoursesCollectionRef = collection(db, "communityCourses")
  const communityCourseQuery = query(communityCoursesCollectionRef, where("communityID", "==", id))
  const communityCourseQueryRes = await getDocs(communityCourseQuery)
  const communityCourseData: ICourse[] = communityCourseQueryRes?.docs?.map(doc => doc.data() as ICourse)


  
  // -------- Fetching classes --------
  let communityCourseClassesData: IClassData[] = []
  // if (communityCourseData[0]) {
  //   const classCollectionRef = collection(db, "communityCourses", communityCourseData[0]?.courseID, "courseClasses")
  //   const classRes = await getDocs(classCollectionRef)
  //   const data: IClassData[] = classRes?.docs?.map(doc => doc.data() as IClassData)
  //   communityCourseClassesData = data
  // }



  return {
    props: { communityCourseData }
  }
}