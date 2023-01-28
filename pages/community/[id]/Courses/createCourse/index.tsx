import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDispatch, useSelector } from 'react-redux'
import CommunityLayout from '../../../../../components/layouts/Community/CommunityLayout'
import { sourceOfLearningOptions } from '../../../../../constants/createTrackPage/sourceOfLearningOptions'
import { ICommunityData } from '../../../../../customTypesAndInterfaces/Community/CommunityInterfaces'
import { auth, db } from '../../../../../firebaseConfig'
import { setIsBottomBarVisible } from '../../../../../redux/slices/bottomBarSlice'
import logoTwo from "../../../../../public/images/logos/logoTwo.png"
import Image from 'next/image'
import axios from 'axios'
import { addDoc, arrayUnion, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'



const Index = () => {
    const [user, loading, error] = useAuthState(auth)
    const router = useRouter()
    const { id } = router.query
    const dispatch = useDispatch()


    // States course Course
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [courseNameInputValue, setCourseNameInputValue] = useState<string>("")
    const [courseGoalInputValue, setCourseGoalInputValue] = useState<string>("")
    const [courseDurationInputValue, setCourseDurationInputValue] = useState<number | string>("Duration in days")
    const [sourceOfLearningDropdownValue, setSourceOfLearningDropdownValue] = useState<string>("")
    const [sourceOfLearningDropdownLinkID, setSourceOfLearningDropdownLinkID] = useState<string>("")
    const [coursePrerequisitesInputValue, setCoursePrerequisitesInputValue] = useState<string>("")
    const [courseOptionalDescription, setCourseOptionalDescription] = useState<string>("")

    const [youtubeCourseThumbnail, setYoutubeCourseThumbnail] = useState<string>("")
    const [youtubeCourseChannelName, setYoutubeCourseChannelName] = useState<string>("")
    const [youtubeCourseChannelID, setYoutubeCourseChannelID] = useState<string>("")
    const [youtubeCourseChannelLogo, setYoutubeCourseChannelLogo] = useState<string>("")
    // const [youtubeCourseTitle, setYoutubeCourseTitle] = useState<string>("")
    const [youtubeVideoID, setYoutubeVideoID] = useState<string>("")
    const [youtubePlaylistID, setYoutubePlaylistID] = useState<string>("")



    // Redux States
    const communityData: ICommunityData = useSelector((state: any) => state?.communityData?.currentCommunityData[0])
    const communityOwnerID = communityData?.communityOwnerID



    const fetchYouTubeVideoDetails = async () => {
        if (sourceOfLearningDropdownLinkID) {
            try {
                console.log(`Fetching Video details`)
                setIsLoading(true)
                const res = await axios.get(`https://www.googleapis.com/youtube/v3/search/?key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&part=snippet&q=${sourceOfLearningDropdownLinkID}`)

                console.log(res);

                setYoutubeCourseChannelID(res?.data?.items[0]?.snippet?.channelId)
                setYoutubeCourseThumbnail(res?.data?.items[0]?.snippet?.thumbnails?.high?.url)
                setYoutubeCourseChannelName(res?.data?.items[0]?.snippet?.channelTitle)
                setYoutubeVideoID(res?.data?.items[0]?.id?.videoId || "")

                setTimeout(() => {
                    createCourseFromVideo(res?.data?.items[0]?.snippet?.channelId, res?.data?.items[0]?.snippet?.thumbnails?.high?.url, res?.data?.items[0]?.snippet?.channelTitle, res?.data?.items[0]?.id?.videoId)
                }, 2500);



            } catch (error) {
                alert("Invalid Video ID")
                console.error(error)
                setIsLoading(false)
            }
        } else {
            alert("Enter Video ID")
            setIsLoading(false)
        }
    }

    const fetchYouTubePlaylistDetails = async () => {
        if (sourceOfLearningDropdownLinkID) {
            try {
                console.log(`Fetching playlist details`)
                setIsLoading(true)
                const res = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=25&playlistId=${sourceOfLearningDropdownLinkID}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`)

                console.log(res);

                setYoutubeCourseChannelID(res?.data?.items[0]?.snippet?.channelId)
                setYoutubeCourseThumbnail(res?.data?.items[0]?.snippet?.thumbnails?.high?.url)
                setYoutubeCourseChannelName(res?.data?.items[0]?.snippet?.channelTitle)
                setYoutubePlaylistID(res?.data?.items[0]?.snippet?.playlistId || "")


                setTimeout(() => {
                    createCourseFromPlaylist(res?.data?.items[0]?.snippet?.channelId, res?.data?.items[0]?.snippet?.thumbnails?.high?.url, res?.data?.items[0]?.snippet?.channelTitle, res?.data?.items[0]?.snippet?.playlistId)
                }, 2500);

            } catch (error) {
                alert("Invalid Playlist ID")
                console.error(error)
                setIsLoading(false)

            }
        } else {
            alert("Enter Valid Playlist ID")
        }
    }

    const createCourse = async () => {
        if (courseNameInputValue.length >= 10 && courseNameInputValue.length <= 50) {
            if (courseDurationInputValue < 91) {
                if (communityOwnerID === user?.uid) {
                    if (user && !loading && courseNameInputValue && courseGoalInputValue && courseDurationInputValue && sourceOfLearningDropdownValue && sourceOfLearningDropdownLinkID && coursePrerequisitesInputValue) {
                        try {
                            setIsLoading(true)
                            console.log(` createCourse is running`);

                            const communityCoursesCollectionRef = collection(db, "communityCourses")
                            const addingCourse = addDoc(communityCoursesCollectionRef, {
                                courseID: "",
                                communityID: communityData?.communityID,
                                courseName: courseNameInputValue,
                                courseGoal: courseGoalInputValue,
                                courseDurationInDays: courseDurationInputValue,
                                courseSourceOfLearning: sourceOfLearningDropdownValue,
                                courseSourceOfLearningLinkID: sourceOfLearningDropdownLinkID,
                                coursePrerequisites: coursePrerequisitesInputValue,
                                courseDescription: courseOptionalDescription,
                                courseCreatorID: user?.uid,

                                youtubeCourseThumbnail: youtubeCourseThumbnail,
                                youtubeCourseChannelName: youtubeCourseChannelName,
                                youtubeCourseChannelID: youtubeCourseChannelID,
                                youtubeCourseChannelLogo:  youtubeCourseChannelLogo,
                                youtubeVideoID: youtubeVideoID,
                                youtubePlaylistID: youtubePlaylistID,
                            })

                            // ---- adding ID ----
                            const communityCourseRef = doc(db, "communityCourses", (await addingCourse).id)
                            await updateDoc(communityCourseRef, {
                                courseID: (await addingCourse).id
                            })

                            // Adding course Id to community
                            const communityRef = doc(db, "communities", id as string)
                            await updateDoc(communityRef, {
                                communityCoursesID: arrayUnion((await addingCourse).id)
                            })


                            // -------- creating Community Course paths ---------
                            // const data = await getDoc(communityCourseRef)
                            // const pathsNumbers: number = data.data()?.trackDurationInDays
                            // const communityPathsSubCollectionRef = collection(db, "communities", id as string, "trackPaths")

                            const coursePathsSubCollectionRef = collection(db, 'communityCourses', (await addingCourse).id, "coursePaths")

                            for (let i = 1; i <= courseDurationInputValue; i++) {
                                // adding path
                                if (i === 1) {
                                    const addingPath = await addDoc(coursePathsSubCollectionRef, {
                                        pathID: "",
                                        courseID: (await addingCourse).id,
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
                                    const addingPath = await addDoc(coursePathsSubCollectionRef, {
                                        courseID: (await addingCourse).id,
                                        pathID: "",
                                        pathCreatorID: user?.uid,
                                        communityID: id,
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
                            }, courseDurationInputValue > 30 ? 3500 : 4500);

                            // router.push(`/community/${id}/Courses`)

                        } catch (error) {
                            setIsLoading(false)
                        }
                    }
                }
            } else if (courseDurationInputValue > 91) {
                alert("Course duration should be less than 90 days and more than 1 days")
            }
        } else {
            alert("Course Name should not be more than 50 characters and less than 10 characters")
        }
    }

    const createCourseFromPlaylist = async ( channelId: string, thumbnail: string, channelName: string, playlistId: string ) => {
        if (courseNameInputValue.length >= 10 && courseNameInputValue.length <= 50) {
            if (courseDurationInputValue < 91) {
                if (communityOwnerID === user?.uid) {
                    if (user && !loading && courseNameInputValue && courseGoalInputValue && courseDurationInputValue && sourceOfLearningDropdownValue && sourceOfLearningDropdownLinkID && coursePrerequisitesInputValue) {
                        try {
                            setIsLoading(true)
                            console.log(` createCourseFromPlaylist is running`);

                            const communityCoursesCollectionRef = collection(db, "communityCourses")
                            const addingCourse = addDoc(communityCoursesCollectionRef, {
                                courseID: "",
                                communityID: communityData?.communityID,
                                courseName: courseNameInputValue,
                                courseGoal: courseGoalInputValue,
                                courseDurationInDays: courseDurationInputValue,
                                courseSourceOfLearning: sourceOfLearningDropdownValue,
                                courseSourceOfLearningLinkID: sourceOfLearningDropdownLinkID,
                                coursePrerequisites: coursePrerequisitesInputValue,
                                courseDescription: courseOptionalDescription,
                                courseCreatorID: user?.uid,

                                youtubeCourseThumbnail: thumbnail,
                                youtubeCourseChannelName: channelName,
                                youtubeCourseChannelID: channelId,
                                youtubeCourseChannelLogo:  youtubeCourseChannelLogo,
                                youtubeVideoID: "",
                                youtubePlaylistID: playlistId,


                                isCommunityCourseTrending: false,
                                isCommunityCoursePopular: false,
                            })

                            // ---- adding ID ----
                            const communityCourseRef = doc(db, "communityCourses", (await addingCourse).id)
                            await updateDoc(communityCourseRef, {
                                courseID: (await addingCourse).id
                            })

                            // Adding course Id to community
                            const communityRef = doc(db, "communities", id as string)
                            await updateDoc(communityRef, {
                                communityCoursesID: arrayUnion((await addingCourse).id)
                            })


                            // -------- creating Community Course paths ---------
                            // const data = await getDoc(communityCourseRef)
                            // const pathsNumbers: number = data.data()?.trackDurationInDays
                            // const communityPathsSubCollectionRef = collection(db, "communities", id as string, "trackPaths")

                            const coursePathsSubCollectionRef = collection(db, 'communityCourses', (await addingCourse).id, "coursePaths")

                            for (let i = 1; i <= courseDurationInputValue; i++) {
                                // adding path
                                if (i === 1) {
                                    const addingPath = await addDoc(coursePathsSubCollectionRef, {
                                        pathID: "",
                                        courseID: (await addingCourse).id,
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
                                    const addingPath = await addDoc(coursePathsSubCollectionRef, {
                                        courseID: (await addingCourse).id,
                                        pathID: "",
                                        pathCreatorID: user?.uid,
                                        communityID: id,
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
                            }, courseDurationInputValue > 30 ? 3500 : 4500);

                            // router.push(`/community/${id}/Courses`)

                        } catch (error) {
                            setIsLoading(false)
                        }
                    }
                }
            } else if (courseDurationInputValue > 91) {
                alert("Course duration should be less than 90 days and more than 1 days")
            }
        } else {
            alert("Course Name should not be more than 50 characters and less than 10 characters")
        }
    }

    const createCourseFromVideo = async ( channelId: string, thumbnail: string, channelName: string, videoID: string ) => {
        if (courseNameInputValue.length >= 10 && courseNameInputValue.length <= 50) {
            if (courseDurationInputValue < 91) {
                if (communityOwnerID === user?.uid) {
                    if (user && !loading && courseNameInputValue && courseGoalInputValue && courseDurationInputValue && sourceOfLearningDropdownValue && sourceOfLearningDropdownLinkID && coursePrerequisitesInputValue) {
                        try {
                            setIsLoading(true)
                            console.log(` createCourseFromVideo is running`);

                            const communityCoursesCollectionRef = collection(db, "communityCourses")
                            const addingCourse = addDoc(communityCoursesCollectionRef, {
                                courseID: "",
                                communityID: communityData?.communityID,
                                courseName: courseNameInputValue,
                                courseGoal: courseGoalInputValue,
                                courseDurationInDays: courseDurationInputValue,
                                courseSourceOfLearning: sourceOfLearningDropdownValue,
                                courseSourceOfLearningLinkID: sourceOfLearningDropdownLinkID,
                                coursePrerequisites: coursePrerequisitesInputValue,
                                courseDescription: courseOptionalDescription,
                                courseCreatorID: user?.uid,

                                youtubeCourseThumbnail: thumbnail,
                                youtubeCourseChannelName: channelName,
                                youtubeCourseChannelID: channelId,
                                youtubeCourseChannelLogo:  youtubeCourseChannelLogo,
                                youtubeVideoID: videoID,
                                youtubePlaylistID: "",

                                isCommunityCourseTrending: false,
                                isCommunityCoursePopular: false,
                            })

                            // ---- adding ID ----
                            const communityCourseRef = doc(db, "communityCourses", (await addingCourse).id)
                            await updateDoc(communityCourseRef, {
                                courseID: (await addingCourse).id
                            })

                            // Adding course Id to community
                            const communityRef = doc(db, "communities", id as string)
                            await updateDoc(communityRef, {
                                communityCoursesID: arrayUnion((await addingCourse).id)
                            })


                            // -------- creating Community Course paths ---------
                            // const data = await getDoc(communityCourseRef)
                            // const pathsNumbers: number = data.data()?.trackDurationInDays
                            // const communityPathsSubCollectionRef = collection(db, "communities", id as string, "trackPaths")

                            const coursePathsSubCollectionRef = collection(db, 'communityCourses', (await addingCourse).id, "coursePaths")

                            for (let i = 1; i <= courseDurationInputValue; i++) {
                                // adding path
                                if (i === 1) {
                                    const addingPath = await addDoc(coursePathsSubCollectionRef, {
                                        pathID: "",
                                        courseID: (await addingCourse).id,
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
                                    const addingPath = await addDoc(coursePathsSubCollectionRef, {
                                        courseID: (await addingCourse).id,
                                        pathID: "",
                                        pathCreatorID: user?.uid,
                                        communityID: id,
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
                            }, courseDurationInputValue > 30 ? 3500 : 4500);

                            // router.push(`/community/${id}/Courses`)

                        } catch (error) {
                            setIsLoading(false)
                        }
                    }
                }
            } else if (courseDurationInputValue > 91) {
                alert("Course duration should be less than 90 days and more than 1 days")
            }
        } else {
            alert("Course Name should not be more than 50 characters and less than 10 characters")
        }
    }

    useEffect(() => {
        if(communityData?.communityOwnerID !== user?.uid) {
            router.push(`/community/${id}/Courses`)
        }
    },[id])


    return (
        <>
            {!isLoading && (
                <CommunityLayout>
                    <main className='w-full h-[90vh] mb-[10vh] lg:mb-0 fixed lg:static inset-0 flex flex-col justify-start items-center bg-gray-100 lg:pt-12 lg:pb-36'>
                        <div className='w-full h-full xl:w-[70%] 2xl:w-[50%] flex flex-col justify-start items-start pt-10 pb-5 px-5 space-y-5 overflow-x-hidden overflow-y-scroll scrollbar-hide bg-white border-2 border-black'>

                            {/* ---- LOGO ---- */}
                            <Link href={'/'} className='flex justify-center items-center space-x-3'>
                                <Image src={logoTwo as any} alt="logo" className='w-6 h-6 rounded-full' width={6} height={6} unoptimized quality={100} />
                                <span className='font-semibold'> CommComm </span>
                            </Link>

                            {/* ---- Heading and info ----- */}
                            <h2 className='text-3xl font-bold' onClick={() => {
                                // console.log(`User UID -> ${user?.uid}`);
                                // console.log(`communityOwnerID -> ${communityOwnerID}`);
                                console.log(`youtubeCourseThumbnail => ${youtubeCourseThumbnail}`);
                                console.log(`youtubeCourseChannelName => ${youtubeCourseChannelName}`)
                                console.log(`youtubeCourseChannelID => ${youtubeCourseChannelID}`);
                                console.log(`youtubeCourseChannelLogo => ${youtubeCourseChannelLogo}`)
                                // console.log(`youtubeCourseTitle => ${youtubeCourseTitle}`);
                                console.log(`youtubeVideoID => ${youtubeVideoID}`)
                                console.log(`youtubePlaylistID => ${youtubePlaylistID}`);


                            }}> Create a Course  </h2>
                            <p className='font-medium text-sm text-gray-900'>
                                Setup a course for your community members to learn together and grow together at ZERO cost
                            </p>

                            {/* ---- Details ----- */}
                            <div className='w-full h-full flex flex-col justify-start items-center py-10 space-y-5 '>

                                {pageNumber === 1 && (
                                    <div className='w-full h-full flex flex-col justify-between items-start py-3 space-y-5'>
                                        <div className='w-full h-full flex flex-col justify-start items-start space-y-5'>
                                            {/* Name */}
                                            <div className={`w-[90%] h-10 relative ${courseGoalInputValue.length > 50 ? "bg-red-600" : "bg-black"} flex justify-start items-center`} onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                                                <input
                                                    value={courseNameInputValue}
                                                    onChange={(e) => setCourseNameInputValue(e.target.value)}
                                                    required
                                                    type="text"
                                                    placeholder='Course name'
                                                    className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'

                                                />
                                            </div>

                                            {/* Goal */}
                                            <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                                                <input
                                                    value={courseGoalInputValue}
                                                    onChange={(e) => setCourseGoalInputValue(e.target.value)}
                                                    required
                                                    type="text"
                                                    placeholder='Goal of the Course'
                                                    className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'

                                                />
                                            </div>

                                            {/* Duration */}
                                            <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                                                <input
                                                    value={courseDurationInputValue}
                                                    min={1}
                                                    onChange={(e) => {
                                                        if (parseInt(e?.target?.value) !== 0 || parseInt(e?.target?.value) >= 1) {
                                                            setCourseDurationInputValue(parseInt(e.target.value))
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
                                            <div className='w-full flex flex-col items-start justify-center space-y-1'>
                                                <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                                                    <input
                                                        value={sourceOfLearningDropdownLinkID}
                                                        onChange={(e) => setSourceOfLearningDropdownLinkID(e.target.value)}
                                                        required
                                                        type="text"
                                                        placeholder='Source of Learning - ID'
                                                        className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'

                                                    />
                                                </div>

                                                {sourceOfLearningDropdownValue === "youtube-playlist" && (
                                                    <span className='text-red-600 text-sm font-Roboto font-normal underline hover:cursor-pointer'> How to get playlist ID ? </span>
                                                )}

                                                {sourceOfLearningDropdownValue === "youtube-video" && (
                                                    <span className='text-red-600 text-sm font-Roboto font-normal underline hover:cursor-pointer'> How to get Video ID ? </span>
                                                )}
                                            </div>

                                            {/* Who can Join this track? */}
                                            <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                                                <input
                                                    value={coursePrerequisitesInputValue}
                                                    onChange={(e) => setCoursePrerequisitesInputValue(e.target.value)}
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
                                                    value={courseOptionalDescription}
                                                    onChange={(e) => setCourseOptionalDescription(e.target.value)}
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
                                                    // console.log(`courseNameInputValue => ${courseNameInputValue}`)
                                                    // console.log(`courseGoalInputValue => ${courseGoalInputValue}`)
                                                    // console.log(`courseDurationInputValue => ${courseDurationInputValue}`)

                                                    // console.log(`sourceOfLearningDropdownValue => ${sourceOfLearningDropdownValue}`)
                                                    // console.log(`sourceOfLearningDropdownLink => ${sourceOfLearningDropdownLinkID}`)
                                                    // console.log(`coursePrerequisitesInputValue => ${coursePrerequisitesInputValue}`);
                                                    // console.log(`courseOptionalDescription => ${courseOptionalDescription}`)
                                                    // console.log(communityOwnerID);

                                                    // createCourse()
                                                    // fetchYouTubeVideoDetails()

                                                    if (sourceOfLearningDropdownValue === "youtube-playlist") {
                                                        fetchYouTubePlaylistDetails()
                                                    } else if (sourceOfLearningDropdownValue === "youtube-video") {
                                                        fetchYouTubeVideoDetails()
                                                    }


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