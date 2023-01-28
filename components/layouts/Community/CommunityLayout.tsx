import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ICommunityData } from '../../../customTypesAndInterfaces/Community/CommunityInterfaces'
import { db } from '../../../firebaseConfig'
import { setCurrentCommunityData } from '../../../redux/slices/communityDataSlice'
import NavTabs from '../../pageWiseComponents/community/NavTabs/NavTabs'
import TopSection from '../../pageWiseComponents/community/TopSection/TopSection'

interface IProps {
    children: React.ReactNode
}

const CommunityLayout = ({children}: IProps) => {
    // console.log(`---------------- CommunityLayout is running`)

    const router = useRouter()
    const { id } = router.query
    const dispatch = useDispatch()

    // Redux States
    const communityData:ICommunityData = useSelector((state: any) => state.communityData.currentCommunityData[0])

    const fetchCommunityDetails = async () => {
        if (communityData?.communityID !== id || !communityData) {
            console.log(`  communityDataRedux NOT FOUND !!! `);
            if (id) {
                const communityRef = doc(db, "communities", id as string)
                const res = await getDoc(communityRef)

                // dispatching reducer
                dispatch(setCurrentCommunityData([res.data()]))
            }
        } else if (communityData) {
            console.log(`communityDataRedux FOUND !!! `);
        }
    }

    useEffect(() => {
      fetchCommunityDetails()
  }, [id])



  return (
    <div className='bg-white w-full lg:w-[60%] h-[80vh] lg:h-[90vh] mt-[12vh] mb-[10vh] lg:mb-0 flex flex-col justify-start items-center overflow-x-hidden overflow-y-scroll scrollbar-hide'>

        <TopSection />
        {children}

    </div>
  )
}

export default CommunityLayout