import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BiErrorCircle } from "react-icons/bi"
import { useSelector } from 'react-redux'
import { UserProfileDisplayPictures } from '../../../../constants/User/UserProfileDisplayPictures'
import { IUserData } from '../../../../customTypesAndInterfaces/User/userInterfaces'
import { auth } from '../../../../firebaseConfig'

const ProfileIcon = () => {
  const [user] = useAuthState(auth)
  const router = useRouter()
  
  const currentUserData: IUserData = useSelector((state: any) => state.user.currentUserData)
  


  return (
    <Link href={user ? `/profile/${user?.uid}` : "/register"}>
      <button type='button' title='profile' className={router?.pathname === "/login" || router?.pathname === "/register" || router.pathname === `/profile/[profileID]` ? (
        'w-10 h-10 bg-black outline-none flex justify-center items-center rounded-md relative '
      ) : (
        'w-10 h-10 bg-white  outline-none flex justify-center items-center rounded-md'
      )} >
        <div className={router?.pathname === "/login" || router?.pathname === "/register" || router.pathname === `/profile/[profileID]` ? (
          'w-10 h-10 bg-BrutalPurple1 flex justify-center items-center rounded-md absolute bottom-1 right-1 border-2 border-black active:bottom-0 active:right-0'
        ) : (
          'w-10 h-10 bg-white flex justify-center items-center rounded-md'
        )}>
          {!currentUserData?.userDisplayPicture && <BiErrorCircle className='text-2xl text-black' />}

          {currentUserData?.userDisplayPicture && (
            <Image unoptimized src={currentUserData?.userDisplayPicture  || UserProfileDisplayPictures[`${Math.floor(Math.random() * 4) }`]} alt="dp" width={6} height={6} className="w-6 h-6 rounded-full" />
          )}
        </div>
      </button>
      
    </Link>
  )
}

export default ProfileIcon