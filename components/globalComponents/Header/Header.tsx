import React, { useState } from 'react'
import { useRouter } from 'next/router'
import BellIcon from '../../Icons/Header/BellIcon/BellIcon'
import MessagesIcon from '../../Icons/Header/MessagesIcon/MessagesIcon'
import SignInAndSignUpButtonsGroup from '../Buttons/SignInAndSignUp/SignInAndSignUpButtonsGroup'
import SearchBarIcon from '../../Icons/Header/SearchBarIcon/SearchBarIcon'
import SearchBar from './components/SearchBar/SearchBar'
// import PlusIcon from '../../Icons/Header/PlusIcon/PlusIcon'
import CreateOptionsModal from '../Modals/CreateOptionsModal/CreateOptionsModal'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from '../../../firebaseConfig'
import Link from 'next/link'
import { useAuthState } from 'react-firebase-hooks/auth'

import logoTwo from "../../../public/images/logos/logoTwo.png"
import Image from 'next/image'
import NotificationModal from '../Modals/NotificationModal/NotificationModal'
import ProfileOptionsMenu from '../ProfileOptionsMenu/ProfileOptionsMenu'
import WalletDropdownMenu from '../DropdownMenus/WalletDropdownMenu/WalletDropdownMenu'



const Header = () => {
  const router = useRouter()
  const [user, loading] = useAuthState(auth)



  return (
    <div className='fixed top-0 w-full h-[10vh] bg-gray-100 py-4 px-3 md:px-5 flex justify-between items-center'>

      {/*  DEMO LOGO  */}
      {/* <Link href={'/'} className='w-10 h-10 rounded-full bg-BrutalOrange1' onClick={() => console.log(0)} /> */}
      <Link href={'/'} className='flex justify-center items-center space-x-3'>
        {/* <div className='w-10 h-10 rounded-full bg-BrutalPurple2 flex justify-center items-center text-white' /> */}
        <Image src={logoTwo as any} alt="logo" className='w-12 h-12 md:w-16 md:h-16 rounded-full' width={14} height={14} unoptimized quality={100}/>
        <span className='hidden lg:inline-block font-bold font-Roboto text-xl'> CommComm </span>
      </Link>

      <SearchBar />

      {user !== null && (
        <div className='flex justify-between items-center space-x-4'>
          <SearchBarIcon />

          {/* <PlusIcon /> */}
          <CreateOptionsModal />

          {/* <BellIcon /> */}
          <NotificationModal />

          {/* <MessagesIcon /> */}

          {user?.uid && <WalletDropdownMenu /> }

          {user?.uid && <ProfileOptionsMenu />}
        </div>
      )}

      {user === null && (
        <div className='flex justify-between items-center space-x-4'>
          <SignInAndSignUpButtonsGroup />
        </div>
      )}

    </div>
  )
}

export default Header