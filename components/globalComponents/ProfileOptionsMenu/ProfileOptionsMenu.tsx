import { Menu, Transition } from '@headlessui/react'
import { signOut } from 'firebase/auth'
import { arrayRemove, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BiDotsVertical } from 'react-icons/bi'
import { auth, db } from "../../../firebaseConfig"


const ProfileOptionsMenu = () => {
    const [user] = useAuthState(auth)
    const router = useRouter()

    const signOutUserFunc =  () => {
        signOut(auth)
        router.push(`/`)
    }


    return (
        <>
            {user && (
                <div className="lg:hidden text-right z-50">
                <Menu as="div" className="relative inline-block text-left z-50">
                    <div className='z-50'>
    
                        <Menu.Button className="inline-flex w-full justify-center rounded-md text-sm font-medium text-white">
                            <button type='button' title='searchIcon' className='relative w-10 h-10 border-black bg-black border rounded-full flex justify-center items-center'>
                                <span className='w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center absolute right-[1px] bottom-[1.5px] border border-black active:bottom-0 active:right-0'>
                                    <BiDotsVertical className='inline-block w-6 h-6 text-black hover:cursor-pointer' />
                                </span>
                            </button>
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
                            <div className="px-3 py-2 z-50 bg-BrutalRed1 rounded-md hover:cursor-pointer">
                                <Menu.Item as={Fragment}>
    
                                    <div onClick={() =>  signOutUserFunc() }>
                                        <button
                                            type='button'
                                            className='text-black font-Roboto font-semibold'
                                        >
                                            Log out
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

export default ProfileOptionsMenu