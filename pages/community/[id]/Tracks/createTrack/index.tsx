import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import CommunityLayout from '../../../../../components/layouts/Community/CommunityLayout'
import { setIsBottomBarVisible } from "../../../../../redux/slices/bottomBarSlice"
import { sourceOfLearningOptions } from "../../../../../constants/createTrackPage/sourceOfLearningOptions"
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../../../../firebaseConfig'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { ITrackData } from '../../../../../customTypesAndInterfaces/Tracks/tracksInterface'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { ICommunityData } from '../../../../../customTypesAndInterfaces/Community/CommunityInterfaces'



const Index = () => {
    const [user, loading, error] = useAuthState(auth)
    const router = useRouter()
    const { id } = router.query
    const dispatch = useDispatch()


    // States
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [trackNameInputValue, setTrackNameInputValue] = useState<string>("")
    const [trackGoalInputValue, setTrackGoalInputValue] = useState<string>("")
    const [trackDurationInputValue, setTrackDurationInputValue] = useState<number | string>("Duration in days")
    const [sourceOfLearningDropdownValue, setSourceOfLearningDropdownValue] = useState<string>("")
    const [sourceOfLearningDropdownLink, setSourceOfLearningDropdownLink] = useState<string>("")
    const [trackPrerequisitesInputValue, setTrackPrerequisitesInputValue] = useState<string>("")
    const [trackOptionalDescription, setTrackOptionalDescription] = useState<string>("")


    // Redux states
    const communityData: ICommunityData = useSelector((state: any) => state?.communityData?.currentCommunityData[0])
    const communityOwnerID = communityData?.communityOwnerID

    const createTrack = async () => {
        if (trackNameInputValue.length >= 10 && trackNameInputValue.length <= 50) {
            if (trackDurationInputValue < 90) {
                if (communityOwnerID === user?.uid) {
                    if (user && !loading && trackNameInputValue && trackGoalInputValue && trackDurationInputValue && sourceOfLearningDropdownValue && sourceOfLearningDropdownLink && trackPrerequisitesInputValue) {
                        try {
                            setIsLoading(true)

                            const communityTracksSubCollectionRef = collection(db, `communities/${id}/communityTracks`)
                            const addingTrack = await addDoc(communityTracksSubCollectionRef, {
                                trackID: "",
                                communityID: id,
                                trackName: trackNameInputValue,
                                trackGoal: trackGoalInputValue,
                                trackDurationInDays: trackDurationInputValue,
                                trackSourceOfLearning: sourceOfLearningDropdownValue,
                                trackSourceOfLearningLink: sourceOfLearningDropdownLink,
                                trackPrerequisites: trackPrerequisitesInputValue,
                                trackDescription: trackOptionalDescription || "",
                                trackCreatorID: user.uid
                            })

                            // ---- adding ID ----
                            const trackRef = doc(db, "communities", id as string, "communityTracks", addingTrack?.id)
                            await updateDoc(trackRef, {
                                trackID: addingTrack.id
                            })


                            // -------- creating Tracks paths ---------
                            const data = await getDoc(trackRef)
                            const pathsNumbers: number = data.data()?.trackDurationInDays
                            const communityPathsSubCollectionRef = collection(db, "communities", id as string, "trackPaths")

                            for (let i = 1; i <= pathsNumbers; i++) {
                                // adding path
                                if (i === 1) {
                                    const addingPath = await addDoc(communityPathsSubCollectionRef, {
                                        pathID: "",
                                        trackID: addingTrack.id,
                                        pathCreatorID: user?.uid,
                                        communityID: id,
                                        pathNumber: i,
                                        isUnlocked: true,
                                        isCompleted: false,

                                        coinsClaimedByUsers: [],
                                        isPathClassCreated: false

                                    })

                                    // adding ID manually
                                    await updateDoc(addingPath, {
                                        pathID: addingPath.id
                                    })
                                } else {
                                    const addingPath = await addDoc(communityPathsSubCollectionRef, {
                                        pathID: "",
                                        pathCreatorID: user?.uid,
                                        communityID: id,
                                        trackID: addingTrack.id,
                                        pathNumber: i,
                                        isUnlocked: false,
                                        isCompleted: false,

                                        coinsClaimedByUsers: [],
                                        isPathClassCreated: false

                                    })

                                    // adding ID manually
                                    await updateDoc(addingPath, {
                                        pathID: addingPath.id
                                    })
                                }

                            }


                            setTimeout(() => {
                                setIsLoading(false)
                            }, pathsNumbers > 30 ? 3500 : 4500);


                            // resetting states
                            setTrackNameInputValue("")
                            setTrackDurationInputValue("Duration in days")

                            router.push(`/community/${id}/Tracks`)
                        } catch (error) {
                            alert(error)
                            setIsLoading(false)
                        }
                    } else {
                        alert("Fill the required Fields")
                    }
                } else if (communityOwnerID !== user?.uid) {
                    router.push('/')
                }
            } else if (trackDurationInputValue > 90 || trackDurationInputValue === 1) {
                alert("Track duration should be less than 90 days and more than 1 days")
            }
        } else {
            alert("Track Name should not be more than 50 characters and less than 10 characters")
        }
    }




    useEffect(() => {
        if (!user && !loading) {
            router.push("/")
        } else if (communityOwnerID !== user?.uid && user && !loading) {
            router.push("/")
        }
    }, [loading])

    return (
        <>
            {!isLoading && (
                <CommunityLayout>
                    <main className='w-full h-[90vh] mb-[10vh] lg:mb-0 fixed lg:static inset-0 flex flex-col justify-start items-center bg-white lg:pt-12 lg:pb-36'>

                        <div className='w-full h-full xl:w-[70%] 2xl:w-[50%] flex flex-col justify-start items-start pt-10 pb-5 px-5 space-y-5 overflow-x-hidden overflow-y-scroll scrollbar-hide bg-white border-2 border-black'>

                            {/* ---- LOGO ---- */}
                            <Link href={'/'} className='flex justify-center items-center space-x-3'>
                                <div className='w-6 h-6 rounded-full bg-BrutalPurple2 border-2 border-BrutalRed1 ' />
                                <span className='font-semibold'> CommComm </span>
                            </Link>

                            {/* ---- Heading and info ----- */}
                            <h2 className='text-3xl font-bold' onClick={() => {
                                console.log(`User UID -> ${user?.uid}`);
                                console.log(`communityOwnerID -> ${communityOwnerID}`);
                            }}> Create a Track  </h2>
                            <p className='font-medium text-sm text-gray-900'>
                                Setup a learning track for your community members to learn together and grow together at ZERO cost
                            </p>

                            {/* ---- Details ----- */}
                            <div className='w-full h-full flex flex-col justify-start items-center py-10 space-y-5 '>

                                {pageNumber === 1 && (
                                    <div className='w-full h-full flex flex-col justify-between items-start py-3 space-y-5'>
                                        <div className='w-full h-full flex flex-col justify-start items-start space-y-5'>
                                            {/* Name */}
                                            <div className={`w-[90%] h-10 relative ${trackNameInputValue.length > 50 ? "bg-red-600" : "bg-black"} flex justify-start items-center`} onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                                                <input
                                                    value={trackNameInputValue}
                                                    onChange={(e) => setTrackNameInputValue(e.target.value)}
                                                    required
                                                    type="text"
                                                    placeholder='Track name'
                                                    className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'

                                                />
                                            </div>

                                            {/* Goal */}
                                            <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                                                <input
                                                    value={trackGoalInputValue}
                                                    onChange={(e) => setTrackGoalInputValue(e.target.value)}
                                                    required
                                                    type="text"
                                                    placeholder='Goal of track'
                                                    className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'

                                                />
                                            </div>

                                            {/* Duration */}
                                            <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                                                <input
                                                    value={trackDurationInputValue}
                                                    min={1}
                                                    onChange={(e) => {
                                                        if (parseInt(e?.target?.value) !== 0 || parseInt(e?.target?.value) >= 1) {
                                                            setTrackDurationInputValue(parseInt(e.target.value))
                                                        }
                                                    }}
                                                    required
                                                    type="number"
                                                    placeholder='Duration in days'
                                                    className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'
                                                />
                                            </div>
                                        </div>

                                        {/* Next Btn */}
                                        <div className='w-full flex justify-end items-center p-5'>
                                            <button
                                                onClick={() => {
                                                    setPageNumber(2)
                                                }}
                                                type='button'
                                                title='next'
                                                className='w-20 md:w-32 h-10 relative flex justify-center items-center bg-black rounded-sm border-2 border-black'>
                                                <span className='w-20 md:w-32 h-10 absolute bottom-[2px] right-[2px] bg-BrutalBlue1  flex justify-center items-center rounded-sm border-2 border-black active:right-0 active:bottom-0 '>
                                                    <p className='text-xs md:text-sm font-medium'> Next  </p>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                )}


                                {pageNumber === 2 && (
                                    <div className='w-full h-full flex flex-col justify-between items-start py-3 space-y-5'>
                                        <div className='w-full h-full flex flex-col justify-start items-start space-y-5'>

                                            {/* Source of Learning - Dropdwon */}
                                            <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                                                <div className='w-full h-10 relative bg-black flex justify-start items-center '>
                                                    <select
                                                        title='choose'
                                                        className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'
                                                        value={sourceOfLearningDropdownValue}
                                                        onChange={(e) => {
                                                            setSourceOfLearningDropdownValue(e.target.value)
                                                        }}
                                                    >

                                                        {sourceOfLearningOptions && sourceOfLearningOptions?.map((learningOption) => {
                                                            return <option
                                                                key={learningOption.id}
                                                                value={learningOption.value}
                                                                className='bg-white px-2 py-3 text-black text-base'
                                                            > {learningOption.label}
                                                            </option>
                                                        })}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Source of Learning - Link */}
                                            <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                                                <input
                                                    value={sourceOfLearningDropdownLink}
                                                    onChange={(e) => setSourceOfLearningDropdownLink(e.target.value)}
                                                    required
                                                    type="text"
                                                    placeholder='Source of Learning - Link'
                                                    className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'

                                                />

                                            </div>




                                            {/* Who can Join this track? */}
                                            <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                                                <input
                                                    value={trackPrerequisitesInputValue}
                                                    onChange={(e) => setTrackPrerequisitesInputValue(e.target.value)}
                                                    required
                                                    type="text"
                                                    placeholder='Who can Join this track?'
                                                    className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'

                                                />
                                            </div>

                                            {/* Description */}
                                            <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                                                <input
                                                    type="text"
                                                    value={trackOptionalDescription}
                                                    onChange={(e) => setTrackOptionalDescription(e.target.value)}
                                                    placeholder='Description (optional)'
                                                    className='w-full h-full absolute right-1 bottom-1 outline-none focus:ring-0 p-2 placeholder:px-2 border-2 border-black'

                                                />
                                            </div>
                                        </div>

                                        {/* Btns */}
                                        <div className='w-full flex justify-between items-center p-5'>
                                            <button
                                                onClick={() => {
                                                    setPageNumber(1)
                                                }}
                                                type='button'
                                                title='back'
                                                className='w-20 md:w-32 h-10 relative flex justify-center items-center bg-black rounded-sm border-2 border-black'>
                                                <span className='w-20 md:w-32 h-10 absolute bottom-[2px] right-[2px] bg-BrutalRed1  flex justify-center items-center rounded-sm border-2 border-black active:right-0 active:bottom-0 '>
                                                    <p className='text-xs md:text-sm font-medium'> Back  </p>
                                                </span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    // console.log(`trackNameInputValue => ${trackNameInputValue}`)
                                                    // console.log(`trackGoalInputValue => ${trackGoalInputValue}`)
                                                    // console.log(`trackDurationInputValue => ${trackDurationInputValue}`)

                                                    // console.log(`sourceOfLearningDropdownValue => ${sourceOfLearningDropdownValue}`)
                                                    // console.log(`sourceOfLearningDropdownLink => ${sourceOfLearningDropdownLink}`)
                                                    // console.log(`trackPrerequisitesInputValue => ${trackPrerequisitesInputValue}`);
                                                    // console.log(`trackOptionalDescription => ${trackOptionalDescription}`)
                                                    // console.log(communityOwnerID);

                                                    createTrack()
                                                }}
                                                type='button'
                                                title='Create'
                                                className='w-20 md:w-32 h-10 relative flex justify-center items-center bg-black rounded-sm border-2 border-black'>
                                                <span className='w-20 md:w-32 h-10 absolute bottom-[2px] right-[2px] bg-BrutalBlue1  flex justify-center items-center rounded-sm border-2 border-black active:right-0 active:bottom-0 '>
                                                    <p className='text-xs md:text-sm font-medium'> Create  </p>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>


                        </div>


                    </main>
                </CommunityLayout>
            )}

            {isLoading && (
                <div className='z-40 w-[100%] h-[100vh] fixed inset-0 flex flex-col justify-center items-center bg-white space-y-5'>
                    <p className='text-4xl font-bold text-black'> Creating... </p>
                    <AiOutlineLoading3Quarters className="w-10 h-10 text-black animate-spin" />
                </div>
            )}
        </>
    )
}

export default Index


