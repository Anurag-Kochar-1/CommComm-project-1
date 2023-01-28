import React, { useState, useEffect } from 'react'
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import CommunityLayout from '../../../../../components/layouts/Community/CommunityLayout'
import { IPathsData } from '../../../../../customTypesAndInterfaces/Tracks/pathsInterface'
import { ITrackData } from '../../../../../customTypesAndInterfaces/Tracks/tracksInterface'
import { auth, db } from '../../../../../firebaseConfig'
import { setIsBottomBarVisible } from '../../../../../redux/slices/bottomBarSlice'
import { classStartingTimeOptions } from "../../../../../constants/createClassPage/classStartingTimeOptions"
import { classEndingTimeOptions } from "../../../../../constants/createClassPage/classEndingTimeOptions"
import { useAuthState } from 'react-firebase-hooks/auth'
import { ICommunityData } from '../../../../../customTypesAndInterfaces/Community/CommunityInterfaces'

import logoTwo from "../../../../../public/images/logos/logoTwo.png"
import Image from 'next/image'
import { ICourse } from '../../../../../customTypesAndInterfaces/Course/courseInterfaces'

interface IProps {
    pathToCreateClassForData: any
    communityCourseData: ICourse[]
}




const Index = ({ pathToCreateClassForData, communityCourseData }: IProps) => {
    const [user, loading] = useAuthState(auth)
    const dispatch = useDispatch()
    const router = useRouter()
    const { id } = router.query

    // ---- States ----
    const [isCreating, setIsCreating] = useState<boolean>(false)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [classNameInputValue, setClassNameInputValue] = useState<string>("")
    const [classLinkInputValue, setClassLinkInputValue] = useState<string>("")
    const [classStartingTimeDropdownValue, setClassStartingTimeDropdownValue] = useState<string>("")
    const [classEndingTimeDropdownValue, setClassEndingTimeDropdownValue] = useState<string>("")

    const today = new Date();

    const communityData: ICommunityData = useSelector((state: any) => state?.communityData?.currentCommunityData[0])

    const createClass = async () => {
        if (classNameInputValue && classStartingTimeDropdownValue && classEndingTimeDropdownValue && classLinkInputValue && communityData.communityOwnerID === user?.uid) {
            if (classStartingTimeDropdownValue !== "Class Starting Time" && classEndingTimeDropdownValue !== "Class Ending Time") {
                try {
                    setIsCreating(true)

                    const communityCourseClassesSubCollectionRef = collection(db, `communityCourses/${pathToCreateClassForData[0]?.courseID}/courseClasses`)

                    const addingClass = await addDoc(communityCourseClassesSubCollectionRef, {
                        classID: "",
                        courseID: pathToCreateClassForData[0]?.courseID ,
                        communityCourseClassName: classNameInputValue,
                        communityCourseClassLink: classLinkInputValue,
                        communityCourseClassDescription: `This class is for Path number ${pathToCreateClassForData[0].pathNumber}, which is a part of ${"tracksData[0]?.trackName"} track of ${communityData?.communityName} community `,
                        communityCourseClassStartingTime: classStartingTimeDropdownValue,
                        communityCourseClassEndingTime: classEndingTimeDropdownValue,
                        dateCreatedAt: today.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) as string,
                        communityCourseClassCreatorID: user?.uid,
                        communityID: communityData?.communityID,
                        communityName: communityData?.communityName,
                        communityLogo: communityData?.communityLogo,
                        pathNumber: pathToCreateClassForData[0].pathNumber,
                        pathID: pathToCreateClassForData[0].pathID,
                        isClassStarted: false,
                        isClassEnded: false,


                    })

                    // adding class ID
                    const classRef = doc(db, `communityCourses/${pathToCreateClassForData[0]?.courseID}/courseClasses/${addingClass?.id}`)
                    await updateDoc(classRef, {
                        classID: addingClass?.id
                    })


                    // updaing path doc -> isPathClassCreated to true 
                    const pathSubCollectionRef = collection(db, `communityCourses/${pathToCreateClassForData[0]?.courseID}/coursePaths`)  
                    const pathQuery = query(pathSubCollectionRef, where("pathNumber", "==", pathToCreateClassForData[0].pathNumber))
                    const pathQueryData = await getDocs(pathQuery)

                    const pathQueryRes:IPathsData[] = pathQueryData?.docs?.map(doc => doc?.data() as IPathsData)
                    console.log(`pathQueryRespathQueryRespathQueryRespathQueryRespathQueryRes`);
                    console.log(pathQueryRes)
                    
                    const pathRef = doc(db, `communityCourses/${pathToCreateClassForData[0]?.courseID}/coursePaths/${pathQueryRes[0]?.pathID}`)  
                    await updateDoc(pathRef, {
                        isPathClassCreated: true
                    })




                    
                    // resetting states
                    setClassNameInputValue("")
                    setClassStartingTimeDropdownValue("")
                    setClassEndingTimeDropdownValue("")
                    setClassLinkInputValue("")
                    setIsCreating(false)
                    

                    
                    // Redirecting
                    router.push(`/community/${id}/Classes`)
                    
                } catch (error) {
                    alert(error)
                    setIsCreating(false)
                }
            } else if (classStartingTimeDropdownValue === "Class Starting Time" || classEndingTimeDropdownValue === "Class Ending Time") {
                alert("Fill Timing Details")
            }
        } else {
            alert("Fill all input fields")
        }
    }


    useEffect(() => {
        if (!user && !loading) {
            router.push(`/community/${id}/Classes`)
        } else if (user && !loading && communityData?.communityOwnerID !== user?.uid) {
            router.push(`/community/${id}/Classes`)
        }
    }, [loading])

    return (
        <>
            {!isCreating && (
                <CommunityLayout>
                    <main className='w-full h-[90vh] mb-[10vh] lg:mb-0 fixed lg:static inset-0 flex flex-col justify-start items-center bg-white lg:pt-12 lg:pb-36'>
                        <div className='w-full h-full xl:w-[70%] 2xl:w-[50%] flex flex-col justify-start items-start pt-10 pb-5 px-5 space-y-5 overflow-x-hidden overflow-y-scroll scrollbar-hide bg-white border-2 border-black'>

                            {/* ---- LOGO ---- */}
                            <Link href={'/'} className='flex justify-center items-center space-x-3'>
                                <Image src={logoTwo as any} alt="logo" className='w-6 h-6 rounded-full' width={6} height={6} unoptimized quality={100} />   
                                <span className='font-semibold'> CommComm </span>
                            </Link>

                            {/* ---- Heading and info ----- */}
                            <h2 className='text-3xl font-bold' onClick={() => {
                                console.log(pathToCreateClassForData)
                            }}> Create a Class for <span className='text-BrutalBlue1'> Path Number {pathToCreateClassForData[0]?.pathNumber} </span>  </h2>
                            <p className='font-medium text-sm text-gray-900'>
                                A free class for a specific path number for your own community members to learn together
                            </p>


                            {pageNumber === 1 && (
                                <div className='w-full h-full flex flex-col justify-between items-start py-3 space-y-5'>
                                    <div className='w-full h-full flex flex-col justify-start items-start space-y-5'>
                                        {/* Class Name */}
                                        <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                                            <input
                                                value={classNameInputValue}
                                                onChange={(e) => setClassNameInputValue(e.target.value)}
                                                required
                                                type="text"
                                                placeholder='Class name'
                                                className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'

                                            />
                                        </div>

                                        {/* Class Link */}
                                        <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                                            <input
                                                value={classLinkInputValue}
                                                onChange={(e) => setClassLinkInputValue(e.target.value)}
                                                required
                                                type="text"
                                                placeholder='Google Meet or Zoom link'
                                                className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'

                                            />
                                        </div>


                                        {/* Class Starting Time Dropdown*/}
                                        <div className='w-[90%] h-10 relative bg-black flex justify-start items-center '>
                                            <select
                                                title='Starting Time'
                                                className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'
                                                value={classStartingTimeDropdownValue}
                                                onChange={(e) => {
                                                    setClassStartingTimeDropdownValue(e.target.value)
                                                }}
                                            >
                                                {classStartingTimeOptions && classStartingTimeOptions?.map((timeOption) => {
                                                    return (
                                                        <option
                                                            key={timeOption.id}
                                                            value={timeOption.value}
                                                            className='bg-white px-2 py-3 text-black text-base'
                                                        > {timeOption.label} </option>
                                                    )
                                                })}

                                            </select>
                                        </div>

                                        {/* Class Ending Time Dropdown*/}
                                        <div className='w-[90%] h-10 relative bg-black flex justify-start items-center '>
                                            <select
                                                title='Starting Time'
                                                className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'
                                                value={classEndingTimeDropdownValue}
                                                onChange={(e) => {
                                                    setClassEndingTimeDropdownValue(e.target.value)
                                                }}
                                            >
                                                {classEndingTimeOptions && classEndingTimeOptions?.map((timeOption) => {
                                                    return (
                                                        <option
                                                            key={timeOption?.id}
                                                            value={timeOption?.value}
                                                            className='bg-white px-2 py-3 text-black text-base'
                                                        > {timeOption?.label} </option>
                                                    )
                                                })}

                                            </select>
                                        </div>


                                    </div>



                                    {/* Next Btn */}
                                    <div className='w-full flex justify-end items-center p-5'>
                                        <button
                                            onClick={() => {
                                                createClass()
                                            }}
                                            type='button'
                                            title='next'
                                            className='w-20 md:w-32 h-10 relative flex justify-center items-center bg-black rounded-sm border-2 border-black'>
                                            <span className='w-20 md:w-32 h-10 absolute bottom-[2px] right-[2px] bg-BrutalBlue1  flex justify-center items-center rounded-sm border-2 border-black active:right-0 active:bottom-0 '>
                                                <p className='text-xs md:text-sm font-medium'> Create  </p>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </main>
                </CommunityLayout>
            )}

            {isCreating && (
                <div className='z-40 w-[100%] h-[100vh] fixed inset-0 flex flex-col justify-center items-center bg-BrutalBlue1 space-y-5'>
                    <p className='text-4xl font-bold text-black'> Creating Class... </p>
                    <AiOutlineLoading3Quarters className="w-10 h-10 text-black animate-spin" />
                </div>
            )}
        </>
    )
}

export default Index


export const getServerSideProps = async ({ params }: any) => {
    const { id } = params

    // // fetching trackPaths Details
    // const communityTrackPathsSubCollectionRef = collection(db, 'communities', id, 'trackPaths')
    // const res = await getDocs(communityTrackPathsSubCollectionRef)
    // const data: IPathsData[] = res?.docs?.map(doc => doc.data() as IPathsData)

    // // filtering based on latest !path.isCompleted && path.isUnlocked
    // const pathNumberToBuildFor = data.filter((path) => {
    //     if (!path.isCompleted && path.isUnlocked) {
    //         return path
    //     } else {
    //         return
    //     }
    // })


    // // fetching tracks Details 
    // const communityTracksSubCollectionRef = collection(db, "communities", id as string, "communityTracks")
    // const trackDataRes = await getDocs(communityTracksSubCollectionRef)
    // const tracksData: ITrackData[] = trackDataRes?.docs?.map(doc => doc.data() as ITrackData)





    // Fetching community course
    const communityCoursesCollectionRef = collection(db, "communityCourses")
    const communityCourseQuery = query(communityCoursesCollectionRef, where("communityID", "==", id))
    const communityCourseQueryRes = await getDocs(communityCourseQuery)
    const communityCourseData:ICourse[] = communityCourseQueryRes?.docs?.map(doc => doc.data() as ICourse)

    // Fetching coursePaths
    const coursePathsCollectionRef = collection(db, "communityCourses", communityCourseData[0]?.courseID, "coursePaths")
    const coursePathsRes = await getDocs(coursePathsCollectionRef)
    const coursePathsData: IPathsData[] = coursePathsRes?.docs?.map(doc => doc.data() as IPathsData)

    const pathToCreateClassForData = coursePathsData.filter((path) => {
        if (!path.isCompleted && path.isUnlocked) {
            return path
        } else {
            return
        }
    })







    return {
        props: { pathToCreateClassForData, communityCourseData }
    }
}