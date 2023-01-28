import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { ICommunityData } from '../../../../customTypesAndInterfaces/Community/CommunityInterfaces'
import { IPost } from '../../../../customTypesAndInterfaces/Posts/postInterface'
import { auth, db } from '../../../../firebaseConfig'
import { AiOutlineLike, AiTwotoneLike, AiOutlineShareAlt } from "react-icons/ai"
import { MdOutlineModeComment } from "react-icons/md"
import Link from 'next/link'
import { useRouter } from 'next/router'
import { JoinCommunity } from '../../../../utils/Community/JoinCommunity'
import { LeaveCommunity } from '../../../../utils/Community/LeaveCommunity'
import Image from 'next/image'

import TimeAgo from 'react-timeago'
import PostCardDropdown from '../../Modals/PostCardDropdown/PostCardDropdown'
import { toast } from 'react-toastify'
import { IUserData } from '../../../../customTypesAndInterfaces/User/userInterfaces'
import { useSelector } from 'react-redux'

interface IProps {
    postData: IPost
    page: string
}

const PostCard = ({ postData, page }: IProps) => {
    const router = useRouter()
    const [user, loading] = useAuthState(auth)

    // States 
    const [communityDetails, setCommunityDetails] = useState<ICommunityData[]>([])
    const [isPostLiked, setIsPostLiked] = useState<Boolean>(false)
    const [isUserJoinedInCommunity, setIsUserJoinedInCommunity] = useState<boolean>(false)
    const [isUserMember, setIsUserMember] = useState<boolean>(false)
    const [isJoinedBtnClicked, setIsJoinedBtnClicked] = useState<boolean>(false)
    const [postLikeCount, setPostLikeCount] = useState<number>(postData.upvotedByUserID.length)

    const currentUserData: IUserData = useSelector((state: any) => state?.user?.currentUserData)


    const copiedToastSuccess = () => toast('✅ Copied to clipboard', {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    const copyPostCommunityURLtoClipboard = () => {
        navigator.clipboard.writeText(`https://th3-project.vercel.app/community/${postData?.postCreateAtCommunityID}`)
        copiedToastSuccess()
    }

    function convertDate(time: any) {
        let dateInMillis = time * 1000
        let date = new Date(dateInMillis)
        let myDate = date.toDateString()
        let myTime = date.toLocaleTimeString()
        myDate = myDate.replaceAll('/', '-')
        // return myDate + " " + myTime 
        return date
    }


    const postCreadedAt = convertDate(postData?.createdAt?.seconds)



    const fetchCommunityDetails = async () => {
        const communityRef = doc(db, "communities", postData?.postCreateAtCommunityID as string)
        const res = await getDoc(communityRef)
        const data = res.data()
        setCommunityDetails([data as ICommunityData])
    }


    const unLikePost = async () => {
        if (!user && !loading) {
            router.push("/register")
        } else if (user && !loading) {
            try {
                setIsPostLiked(false)
                setPostLikeCount(postLikeCount - 1)

                const userRef = doc(db, "users", user?.uid as string)
                const postRef = doc(db, "posts", postData.postID)

                // Updating Post
                await updateDoc(postRef, {
                    upvotedByUserID: arrayRemove(user?.uid)
                })


                // Updating User
                await updateDoc(userRef, {
                    likedPostsID: arrayRemove(postData.postID)
                })
            } catch (error) {
                console.log(error);
            }
        }
    }

    const likePost = async () => {
        if (!user && !loading) {
            router.push("/register")
        } else if (user && !loading) {
            try {
                setIsPostLiked(true)
                setPostLikeCount(postLikeCount + 1)


                const userRef = doc(db, "users", user?.uid as string)
                const postRef = doc(db, "posts", postData.postID)

                // Updating Post
                await updateDoc(postRef, {
                    upvotedByUserID: arrayUnion(user?.uid)
                })


                // Updating User
                await updateDoc(userRef, {
                    likedPostsID: arrayUnion(postData.postID)
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    const checkIsUserJoinedInCommunity1 = () => {
        if (user && !loading) {
            if (postData.postCreatorID === user?.uid) {
                setIsUserJoinedInCommunity(true)
            } else {
                setIsUserJoinedInCommunity(false)
            }
        } else if (!user && !loading) {
            setIsUserJoinedInCommunity(false)
        }
    }



    const checkIsPostLikedByUser = () => {
        // if (user?.uid && !loading) {
        //     postData.upvotedByUserID.map((user2: any) => {
        //         if (user2 == user.uid) {
        //             setIsPostLiked(true)
        //         } else {
        //             setIsPostLiked(false)
        //         }
        //     })
        // } else {
        //     setIsPostLiked(false)
        // }

        if(currentUserData) {
            if(currentUserData?.likedPostsID?.includes(postData?.postID)) {
                setIsPostLiked(true)
            }
        }

        
    }

    useEffect(() => {
        fetchCommunityDetails()
        checkIsPostLikedByUser()


        if (postData.postCreatorID === user?.uid) {
            setIsUserJoinedInCommunity(true)
        }


    }, [loading])


    useEffect(() => {
        if (communityDetails[0] && user?.uid && !loading) {
            if (communityDetails[0]?.communityMembersID.includes(user.uid)) {
                setIsUserJoinedInCommunity(true)
            } else {
                setIsUserJoinedInCommunity(false)
            }
        }

    }, [communityDetails, loading])

    return (
        <div className={`"w-full sm:w-[70%]  md:w-[60%] lg:w-[80%] xl:w-[60%] 2xl:w-[50%] bg-white border md:border-2 border-black flex flex-col justify-start items-center p-2 md:p-4 rounded-sm md:rounded-md my-2 `} onClick={() => {
            console.log(postCreadedAt)
        }}>

            {/* Header */}
            <div className='w-full flex justify-between items-center space-x-2 py-2'>

                {/* For Community Post Page */}
                {page === "communityPostsPage" && (
                    <div className='w-full h-full flex flex-row items-center justify-start space-x-1 '>
                        <p className='text-xs sm:text-sm font-Roboto font-light text-black'> posted by {postData?.postCreatorName} </p>
                        <span> • </span>
                        <TimeAgo date={postCreadedAt} className="text-xs sm:text-sm font-Roboto font-light text-black" />
                    </div>
                )}

                {/* For Home Page OR profilePage */}
                {page === "homePage" || page === "explorePostsPage" || page === "profilePage" ? (
                    <div className='w-full h-full flex flex-col sm:flex-row items-start justify-start sm:items-center space-x-1'>

                        <div className='h-12 flex justify-start items-center space-x-2 hover:cursor-pointer' onClick={() => router.push(`/community/${postData?.postCreateAtCommunityID}`)}>
                            <Image src={communityDetails[0]?.communityLogo as string}
                                alt="logo"
                                width={12}
                                height={12}
                                className="w-12 h-12 aspect-square rounded-sm border border-black" onClick={() => console.log(communityDetails)} draggable="false"
                                unoptimized
                            />

                            <div className='w-full flex flex-col justify-start items-start space-y-1'>
                                <span className='text-sm sm:text-base font-Roboto font-medium text-black'> {communityDetails[0]?.communityName} </span>
                                <div className="flex justify-start items-center space-x-1">
                                    <p className='text-xs sm:text-sm font-Roboto font-light text-black'> posted by {postData?.postCreatorName}  </p>
                                    <span> • </span>
                                    <TimeAgo date={postCreadedAt} className="text-xs sm:text-sm font-Roboto font-light text-black" />
                                </div>
                            </div>

                        </div>


                    </div>
                ) : null}




                {/* Join Button  router.pathname === `/community/[id]`*/}
                {postData?.postCreatorID !== user?.uid && router.pathname !== `/community/[id]` ? (
                    <button type='button' className='w-14 h-6 bg-black border border-black flex justify-center items-center rounded-full'>
                        <span
                            onClick={() => {
                                router.push(`/community/${postData?.postCreateAtCommunityID}`)
                            }}
                            className='w-14 h-6 -mt-1 -ml-1 bg-BrutalGreen2 text-lg font-medium text-black border border-black rounded-full font-BebasNeue'>
                            Visit
                        </span>
                    </button>
                ) : null}


                {postData?.postCreatorID === user?.uid && <PostCardDropdown postData={postData} />}
            </div>

            {/* Title */}
            <div className='w-full flex justify-start items-center'>
                <h3 className='font-InriaSans font-semibold text-xl text-black'> {postData?.postTitle} </h3>
            </div>

            {/* Caption */}
            {postData.postCaption && (
                <div className='w-full flex justify-between items-center my-1 overflow-x-auto  overflow-hidden scrollbar-hide'>
                    <p className='font-InriaSans font-normal text-base text-black'> {postData.postCaption} </p>
                </div>
            )}


            {/* Image */}
            {postData.postImageURL && (
                <img src={postData.postImageURL} alt="title" className='w-full h-full aspect-square rounded-sm my-2 object-contain' draggable="false" />
            )}

            {/* Video */}
            {postData.postVideoURL && (
                <video src={postData.postVideoURL} controls className='w-full h-full aspect-square rounded-sm my-2 ' />
            )}


            {/* Buttons */}
            <div className='w-full flex justify-start items-center space-x-4 py-5'>

                {/* Like */}
                <button
                    title='like'
                    type='button'
                    className='flex justify-center items-center space-x-2'
                    onClick={() => {
                        if (isPostLiked) {
                            unLikePost()
                        } else if (!isPostLiked) {
                            likePost()
                        }
                    }}
                >
                    {!isPostLiked && <AiOutlineLike className='text-xl active:scale-125' />}
                    {isPostLiked && <AiTwotoneLike className='text-xl text-BrutalPurple2 active:scale-125' />}
                    <span className='font-InriaSans'> {postLikeCount} </span>
                </button>

                {/* Comment */}
                <button
                    type='button'
                    title='comment'
                    className='flex justify-center items-center space-x-2'
                >
                    <MdOutlineModeComment className='text-xl text-black  active:text-BrutalPurple2 active:scale-125' />
                    <span className='font-InriaSans'> 0 </span>
                </button>


                <button
                    type='button'
                    title='share'
                    className='flex justify-center items-center space-x-2 '
                    onClick={copyPostCommunityURLtoClipboard}
                >
                    <AiOutlineShareAlt className='text-xl text-black active:text-BrutalPurple2 active:scale-125' />
                </button>


            </div>



        </div>
    )
}

export default PostCard