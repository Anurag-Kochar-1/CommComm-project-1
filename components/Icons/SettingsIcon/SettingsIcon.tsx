import React, { useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BsFillGearFill } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import { ICommunityData } from '../../../customTypesAndInterfaces/Community/CommunityInterfaces'
import { auth, db } from '../../../firebaseConfig'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { IUserData } from '../../../customTypesAndInterfaces/User/userInterfaces'
import { arrayRemove, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { toast } from "react-toastify";



const SettingsIcon = () => {
    const [user] = useAuthState(auth)
    const router = useRouter()
    const { id } = router.query

    const [communityShareURL, setCommunityShareURL] = useState<string>(`https://th3-project.vercel.app/community/${id}`)

    const communityData: ICommunityData = useSelector((state: any) => state.communityData.currentCommunityData[0])
    const currentUserData: IUserData = useSelector((state: any) => state.user.currentUserData)

    const logoInputRef: any = useRef()
    const BannerInputRef: any = useRef()

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

    const copyCommunityShareURLtoClipboard = () => {
        navigator.clipboard.writeText(communityShareURL)
        copiedToastSuccess()
    }


    // const deleteCommunity = async () => {
    //     if(user?.uid === communityData.communityOwnerID) {
    //         const communityRef = doc(db, 'communities', id as string)
    //         const userRef = doc(db, 'users', user?.uid)

    //         // updaing user doc
    //         await updateDoc(userRef, {
    //             communitiesJoinedID: arrayRemove(id),
    //             communitiesOwnedID: arrayRemove(id)

    //         })

    //         // deleting community doc
    //         await deleteDoc(communityRef)



    //         // deleting community course


    //     } 
    // }

    if (user?.uid !== communityData?.communityOwnerID || router.pathname === `/community/[id]/Courses/createCourse` || router.pathname === `/community/[id]/Classes/createClass`) return null
    return (
        <>
            {user?.uid === communityData?.communityOwnerID && (

                <div className="text-right z-50">
                    <Menu as="div" className="relative inline-block text-left z-50">
                        <div className='z-50'>
                            <Menu.Button className="inline-flex w-full justify-center rounded-md text-sm font-medium text-white">
                                <div className='w-10 h-10 bg-black border border-black flex justify-center items-center rounded-full'>
                                    <button
                                        title='settings'
                                        type='button'
                                        className='w-full h-full -mt-2 -ml-2 flex justify-center items-center bg-gray-400 text-xl font-medium text-black border-2 border-black active:-mt-0 active:-ml-0 rounded-full font-BebasNeue'>
                                        <BsFillGearFill className='text-xl text-black' onClick={() => console.log(router.pathname)} />
                                    </button>
                                </div>
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >

                            <Menu.Items className="bg-white absolute right-0 mt-2 w-52 origin-top-right divide-y divide-gray-100 rounded-sm space-y-2 border-2 border-black p-2 z-50">

                                <div className="px-3 py-2 z-50 bg-BrutalOrange1 rounded-md hover:cursor-pointer">
                                    <Menu.Item as={Fragment}>
                                        <div onClick={() => console.log(1)}>
                                            <button
                                                title='change'
                                                type='button'
                                                className='text-black font-Roboto font-semibold'
                                                onClick={() => logoInputRef?.current.click()}
                                            >
                                                <input type="file" placeholder='logo' accept="image/*" hidden ref={logoInputRef} />
                                                Change logo
                                            </button>

                                        </div>
                                    </Menu.Item>
                                </div>

                                <div className="px-3 py-2 z-50 bg-BrutalBlue1 rounded-md hover:cursor-pointer">
                                    <Menu.Item as={Fragment}>
                                        <div onClick={() => console.log(1)}>
                                            <button
                                                title='change'
                                                type='button'
                                                className='text-black font-Roboto font-semibold'
                                                onClick={() => BannerInputRef?.current.click()}
                                            >
                                                <input type="file" placeholder='banner' accept="image/*" hidden ref={BannerInputRef} />
                                                Change Banner
                                            </button>
                                        </div>
                                    </Menu.Item>
                                </div>

                                <div className="px-3 py-2 z-50 bg-BrutalPurple1 rounded-md hover:cursor-pointer">
                                    <Menu.Item as={Fragment}>

                                        <div onClick={() => console.log(1)}>
                                            <button
                                                type='button'
                                                className='text-black font-Roboto font-semibold'
                                                onClick={() => { copyCommunityShareURLtoClipboard() }}
                                            >



                                                Share
                                            </button>
                                        </div>
                                    </Menu.Item>
                                </div>

                                <div className="px-3 py-2 z-50 bg-BrutalRed1 rounded-md hover:cursor-pointer">
                                    <Menu.Item as={Fragment}>

                                        <div onClick={() => console.log(1)}>
                                            <button
                                                type='button'
                                                className='text-black font-Roboto font-semibold'
                                            >
                                                Delete Community
                                            </button>
                                        </div>
                                    </Menu.Item>
                                </div>





                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            )}
        </>
    )
}

export default SettingsIcon