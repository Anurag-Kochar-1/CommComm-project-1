import { Menu, Transition } from '@headlessui/react'
import { arrayRemove, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BiWallet } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { IClassData } from '../../../../customTypesAndInterfaces/Class/classInterfaces'
import { IUserData } from '../../../../customTypesAndInterfaces/User/userInterfaces'
import { auth, db } from '../../../../firebaseConfig'
import coinIcon from "../../../../public/images/icons/coinIcon.svg"

interface IProps {
    classData?: IClassData
}

const WalletDropdownMenu = () => {
    const [user] = useAuthState(auth)
    const router = useRouter()

    // --- Redux States ---
    const currentUserData: IUserData = useSelector((state: any) => state.user.currentUserData)



    return (
        <div className="lg:hidden text-right z-50">
            <Menu as="div" className="relative inline-block text-left z-50">
                <Menu.Button className="inline-flex w-full justify-center rounded-md text-sm font-medium text-white">
                    <button type='button' title='searchIcon' className='relative w-10 h-10 border-black bg-black border rounded-full flex justify-center items-center'>
                        <span className='w-10 h-10 rounded-full bg-red-800 flex justify-center items-center absolute right-[1px] bottom-[1.5px] border border-black active:bottom-0 active:right-0'>
                            <BiWallet className='text-lg text-white' />
                        </span>
                    </button>
                </Menu.Button>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >

                    <Menu.Items className="bg-white absolute right-0 mt-2 w-52 origin-top-right divide-y divide-gray-100 rounded-lg space-y-2 border-2 border-black p-1 z-50">

                        <div className="w-full px-3 py-1 z-50 bg-white rounded-md hover:cursor-pointer">
                            <Menu.Item as={Fragment}>
                                <div
                                    className='w-full py-1 flex flex-col justify-start items-center space-y-3'
                                >

                                    <p className='text-xl text-black font-Roboto font-bold'> My coins </p>

                                    <div className='flex justify-center items-center space-x-2'>
                                        <Image unoptimized src={coinIcon as string} alt="icon" width={5} height={5} className="w-8 h-8 rounded-full" />
                                        <span className='text-base text-black font-Roboto font-medium'> {currentUserData?.userCoins} </span>
                                    </div>
                                </div>
                            </Menu.Item>
                        </div>


                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}

export default WalletDropdownMenu