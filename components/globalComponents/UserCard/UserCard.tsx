import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IUserData } from '../../../customTypesAndInterfaces/User/userInterfaces'
import coinIcon from "../../../public/images/icons/coinIcon.svg"

interface IProps {
    userData: IUserData
}

const UserCard = ({ userData }: IProps) => {
    return (
        <Link  
            href={`/profile/${userData?.userID}`}
            key={userData?.userDisplayPicture}
            className="w-[90%] h-14 xl:h-20 flex justify-start items-center bg-back border bg-black border-black space-x-2 rounded-lg hover:cursor-pointer"
        >
            <div className={`w-full h-full -mt-1 -ml-1 bg-white  border border-black rounded-sm flex justify-start items-center space-x-2 px-3`}>
                <Image
                    unoptimized
                    src={userData?.userDisplayPicture as string || "https://firebasestorage.googleapis.com/v0/b/th3-hackathon.appspot.com/o/postImages%2F6cf18550-5ca7-491f-9725-171e5c38b6fc--220703-minions-music-hero_tfqnbm.jpg?alt=media&token=8c0fc36a-394a-413c-9b49-2e86342095a3"}
                    width={8}
                    height={8}
                    alt="pfp"
                    className='w-auto h-[70%] rounded-sm aspect-square border border-black' draggable="false"
                />


                <div className='border-r border-r-black h-full' />

                <div className='w-full flex flex-col items-start justify-center'>
                    <p className='font-BebasNeue lg:text-base xl:text-xl  text-black font-medium'> {userData?.userName}  </p>
                    <div className='w-full flex justify-start items-center space-x-2'>
                        <Image src={coinIcon as string} alt="icon" width={5} height={5} className="w-5 h-5" />
                        <p className='font-BebasNeue lg:text-base xl:text-xl  text-black font-medium'> {userData?.userCoins}  </p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default UserCard