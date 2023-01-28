import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import BellIcon from '../../../Icons/Header/BellIcon/BellIcon'
import { useDispatch, useSelector } from "react-redux"
import { setIsNotificationModalOpen } from "../../../../redux/slices/modalSlice"
import CrossIcon from '../../../Icons/General/CrossIcon/CrossIcon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { RxCross2 } from 'react-icons/rx'
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../../../firebaseConfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import { INotificationData } from '../../../../customTypesAndInterfaces/Notification/INotificationData'
import coinIcon from "../../../../public/images/icons/coinIcon.svg"
import Image from 'next/image'


export default function NotificationModal() {
    // console.log(`===== NotificationModal is running =====`);
    const [user, loading] = useAuthState(auth)
    const router = useRouter()
    const dispatch = useDispatch()

    // states
    const [userNotificationsState, setUserNotificationsState] = useState<INotificationData[]>([])

    // redux
    const isNotificationModalOpen = useSelector((state: any) => state?.modal?.isNotificationModalOpen)

    function closeModal() {
        dispatch(setIsNotificationModalOpen(false))
    }

    // const sendNotifictationToUser = async () => {
    //     if (user) {
    //         try {
    //             const userNotificationSubCollectionRef = collection(db, 'users', user?.uid as string, 'notifications')
    //             const sendingNotification = await addDoc(userNotificationSubCollectionRef, {
    //                 notificationID: "",
    //                 notificationText: "You got 100 coins",
    //                 notificationIconName: "coinIcon",
    //                 notificationSendedAt: serverTimestamp()
    //             })

    //             // adding id 
    //             const notificationRef = doc(db, 'users', user?.uid as string, 'notifications', sendingNotification?.id)
    //             await updateDoc(notificationRef, {
    //                 notificationID: sendingNotification?.id
    //             })




    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    // }


    useEffect(() => {
        if (user && !loading) {
            const userNotificationSubCollectionRef = collection(db, 'users', user?.uid as string, 'notifications')
            const userNotificationSubCollectionQuery = query(userNotificationSubCollectionRef, orderBy("notificationSendedAt", "desc"))

            const unSubRealTimeUserNotificationsOnSnapShotListener = onSnapshot(userNotificationSubCollectionQuery, (snapshot) => {
                setUserNotificationsState(snapshot.docs.map(doc => doc.data() as INotificationData))
                console.log(userNotificationsState)

            })
        }
    }, [])



    return (
        <>
            <BellIcon />
            <Transition appear show={isNotificationModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-80" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-[90%] sm:w-[60%] md:w-[40%] lg:w-[35%] xl:w-[25%] h-80 lg:h-96 scrollbar-hide bg-transparent flex flex-col justify-start items-start overflow-x-hidden overflow-y-scroll border-2 border-black">

                                    <div className='w-full h-full bg-white flex flex-col justify-start items-start px-5 py-5  overflow-x-hidden overflow-y-scroll scrollbar-hide'>

                                        {/* Header */}
                                        <div className='w-full flex justify-between items-center'>
                                            <h4 className='text-2xl text-black font-Roboto font-bold'> Notifications </h4>
                                            <button
                                                onClick={() => {
                                                    dispatch(setIsNotificationModalOpen(false))
                                                }}
                                                type='button'
                                                title='home'
                                                className='w-8 h-8 bg-black outline-none flex justify-center items-center rounded-md relative ' >

                                                <div className='w-8 h-8 bg-BrutalRed1 flex justify-center items-center rounded-md absolute bottom-1 right-1 border-2 border-black active:bottom-0 active:right-0' >

                                                    <RxCross2 className='text-sm' />
                                                </div>
                                            </button>
                                        </div>


                                        {/* Notification Cards */}
                                        <div className='w-full  flex flex-col items-center justify-start my-8 space-y-2'>
                                            {userNotificationsState[0] && userNotificationsState?.map((notification) => {
                                                return (
                                                    <div key={notification?.notificationID} className='w-full h-16 border border-black bg-black flex items-center justify-center rounded-md hover:cursor-pointer'>
                                                        <div className='w-full h-full -mt-1 -ml-1 border border-black bg-white flex items-center justify-between rounded-md px-5'>
                                                            <div className='flex justify-center items-center'>
                                                                <Image src={coinIcon} alt="coin" width={6} height={6} className="w-8 h-8 rounded-full" />
                                                            </div>
                                                            <p className='flex-1 font-bold font-Roboto text-bas'> {notification?.notificationText} </p>
                                                        </div>
                                                    </div>
                                                )
                                            })}

                                        </div>


                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}