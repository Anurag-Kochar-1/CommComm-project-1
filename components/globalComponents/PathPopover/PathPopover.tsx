import { useState } from "react"
import { Popover, Transition } from '@headlessui/react'
import { arrayUnion, collection, doc, getDoc, getDocs, increment, query, updateDoc, where } from 'firebase/firestore'
import { Fragment } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { FaLock, FaLockOpen } from 'react-icons/fa'
import { BsCheckLg } from 'react-icons/bs'
import { IPathsData } from '../../../customTypesAndInterfaces/Tracks/pathsInterface'
import { auth, db } from '../../../firebaseConfig'
import { IUserData } from "../../../customTypesAndInterfaces/User/userInterfaces"
import { AiFillStar } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"
import { setIsCoinCreditedModalOpen } from "../../../redux/slices/modalSlice"
import { toast } from "react-toastify"
// import coinIcon from "../../../public/images/icons/coinIcon.svg"


interface IProps {
    path: IPathsData
}

export function PathPopover({ path }: IProps) {
    const [user, loading] = useAuthState(auth)
    const router = useRouter()
    const dispatch = useDispatch()



    // Redux States
    const userDetails: IUserData = useSelector((state: any) => state?.user?.currentUserData)



    const markComplete = async () => {
        if (path?.pathCreatorID === user?.uid) {
            try {
                const pathRef = doc(db, `communityCourses/${path?.courseID}/coursePaths/${path?.pathID}`)

                // marking complete
                await updateDoc(pathRef, {
                    isCompleted: true,
                    isUnlocked: true
                })

                // unlocking next path
                unlockingNextPath()


            } catch (error) {
                alert(error)
            }
        }
    }


    const unlockingNextPath = async () => {
        try {
            // findin the next path to unlock
            const coursePathCollectionRef = collection(db, `communityCourses/${path?.courseID}/coursePaths`)
            const nextPathQuery = query(coursePathCollectionRef, where("pathNumber", "==", path?.pathNumber + 1))
            const queryData = await getDocs(nextPathQuery)
            const nextPath: IPathsData[] = queryData?.docs?.map((doc) => doc.data() as IPathsData)

            const nextPathDocRef = doc(db, `communityCourses/${path?.courseID}/coursePaths/${nextPath[0]?.pathID}`)


            // Updating the next path
            await updateDoc(nextPathDocRef, {
                isUnlocked: true
            })
        } catch (error) {
            alert(error)
        }



    }

    const claimCoin = async () => {
        if (user) {
            if (!path?.coinsClaimedByUsers?.includes(user?.uid) && userDetails?.communitiesJoinedID?.includes(path?.communityID)) {
                const pathRef = doc(db, `communityCourses/${path?.courseID}/coursePaths/${path?.pathID}`)
                const userRef = doc(db, `users/${user?.uid}`)

                // Updating Path Doc
                await updateDoc(pathRef, {
                    coinsClaimedByUsers: arrayUnion(user?.uid)
                })

                // Updating User doc
                await updateDoc(userRef, {
                    userCoins: increment(50)
                })

                claimCoinToastSuccess()


            }
        }
    }

    const claimCoinToastSuccess = () => toast('✅ 50 coins credited!!!', {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });





    return (
        <div >
            <Popover className="relative">
                {({ open }) => (
                    <>
                        <Popover.Button className={"border-none outline-none focus:ring-0"} onClick={() => {
                            console.log(path)
                            if (!path.isUnlocked) {
                                alert("Path is LOCKED")
                            } else if (!userDetails?.communitiesJoinedID?.includes(path?.communityID)) {
                                alert("You are not a member of this community")
                            }
                        }}>
                            <div className={`w-20 h-20 ${path?.isUnlocked && !path.isCompleted ? "bg-[#CC7800]" : "bg-[#B7B7B7]"}   rounded-full flex justify-center items-center ${path?.pathNumber % 2 === 0 ? "mr-16" : "ml-16"} ]`} >
                                <div className={`w-full h-full -mt-3 rounded-full flex flex-col justify-center items-center ${!path.isUnlocked ? "bg-[#E5E5E5]" : "bg-[#FF9600]"} active:-mt-0`}>

                                    {!path?.isUnlocked && (<FaLock className='text-2xl text-[#AFAFAF]' />)}
                                    {path?.isUnlocked && !path.isCompleted ? (<AiFillStar className='text-3xl text-white' />) : null}
                                    {path.isCompleted ? (<BsCheckLg className='text-2xl text-white' />) : null}
                                 
                                </div>
                            </div>
                        </Popover.Button>
                        <Transition

                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >

                            <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-60 -translate-x-1/2 transform">

                                {path.isUnlocked && !path.isCompleted && userDetails?.communitiesJoinedID?.includes(path?.communityID) ? (
                                    <div className="w-full h-full bg-[#FF9600] border-2 border-black py-7 px-3 rounded-sm">
                                        <div className="w-full h-full space-y-5 p-1 flex flex-col justify-start items-center">

                                            {/* Create Class Button*/}
                                            {user?.uid === path.pathCreatorID && !path?.isPathClassCreated ? (
                                                <button
                                                    onClick={() => router.push(`/community/${path?.communityID}/Classes/createClass`)}
                                                    type='button'
                                                    className='w-[95%] flex justify-center items-center space-x-2  bg-white rounded-md py-3 px-4'>
                                                    <p className='font-semibold text-base'> Create Class </p>
                                                </button>
                                            ) : null}

                                            {/* Mark Complete Button*/}
                                            {user?.uid === path.pathCreatorID && (
                                                <button
                                                    onClick={() => markComplete()}
                                                    type='button'
                                                    className='w-[95%] flex justify-center items-center space-x-2  bg-white rounded-md py-3 px-4'>
                                                    <p className='font-semibold text-base'> Mark Complete </p>
                                                </button>
                                            )}


                                            {/* Attend Class Button */}
                                            {userDetails?.communitiesJoinedID?.includes(path?.communityID) && path?.isPathClassCreated ? (
                                                <button
                                                    onClick={() => (router.push(`/community/${path?.communityID}/Classes`))}
                                                    type='button'
                                                    className='w-[95%] flex justify-center items-center space-x-2  bg-white rounded-md py-3 px-4'>
                                                    <p className='font-semibold text-base'> Attend Class </p>
                                                </button>
                                            ) : null}




                                            {/* Claim Coins Button*/}
                                            {userDetails?.communitiesJoinedID?.includes(path?.communityID) && (
                                                <button
                                                    onClick={() => {
                                                        claimCoin()
                                                    }}
                                                    type='button'
                                                    className={`w-[95%] flex justify-center items-center space-x-2 bg-white ${path?.coinsClaimedByUsers?.includes(user?.uid as string) && "opacity-80"} rounded-md py-3 px-4`}>
                                                    {!path?.coinsClaimedByUsers?.includes(user?.uid as string) && <p className='font-semibold text-base '> Claim 50 coins </p>}
                                                    {path?.coinsClaimedByUsers?.includes(user?.uid as string) && <p className='font-semibold text-base '> CLAIMED !!! </p>}
                                                </button>
                                            )}


                                           

                                        </div>


                                    </div>
                                ) : (null)}



                            </Popover.Panel>



                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    )
}
