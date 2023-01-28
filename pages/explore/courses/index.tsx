import { collection, getDocs } from 'firebase/firestore'
import React from 'react'
import CommunityCourseCard from '../../../components/globalComponents/CommunityCourseCard/CommunityCourseCard'
import ExploreTabs from '../../../components/pageWiseComponents/explore/ExploreTabs/ExploreTabs'
import { ICourse } from '../../../customTypesAndInterfaces/Course/courseInterfaces'
import { db } from '../../../firebaseConfig'

interface IProps {
  allCommunityCoursesData: ICourse[]
}

const Index = ({ allCommunityCoursesData }: IProps) => {
  return (
    <main className='w-full lg:w-[60%] h-[80vh] lg:h-[90vh] mt-[12vh] mb-[10vh] lg:mb-0 bg-white flex flex-col justify-start items-center scrollbar-hide'>
      <ExploreTabs />


      {allCommunityCoursesData[0] && (
        <div className='w-full h-auto bg-white flex flex-col justify-start items-center overflow-x-hidden overflow-y-scroll py-10 scrollbar-hide space-y-2'>
          {allCommunityCoursesData?.map((communityCourse) => {
            return(
                 <CommunityCourseCard communityCourseData={communityCourse} key={communityCourse?.courseID} />
            )
          })}
        </div>
      )}


    </main>
  )
}

export default Index


export const getServerSideProps = async () => {

  // fetching all community courses
  const communityCoursesCollectionRef = collection(db, "communityCourses")
  const res = await getDocs(communityCoursesCollectionRef)
  const allCommunityCoursesData: ICourse[] = res?.docs?.map(doc => doc.data() as ICourse)

  return {
    props: { allCommunityCoursesData }
  }
}
