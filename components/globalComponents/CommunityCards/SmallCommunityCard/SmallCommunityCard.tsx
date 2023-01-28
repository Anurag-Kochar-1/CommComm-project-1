import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ICommunityData } from '../../../../customTypesAndInterfaces/Community/CommunityInterfaces'

interface IProps {
    community: ICommunityData
}

const SmallCommunityCard = ({ community }: IProps) => {

    const randomBGcolorsArray = ["bg-purple-300", "bg-red-300", "bg-green-400", "bg-yellow-300", "bg-blue-300", "bg-gray-300", "bg-orange-300", "bg-indigo-300"]
    const randomBGcolorIndex = Math.floor(Math.random() * 8)
    const randomBG = ` ${randomBGcolorsArray[randomBGcolorIndex]}`
    console.log();

    return (
        <Link
            href={`/community/${community.communityID}`}
            key={community.communityID}
            className="w-[90%] h-14 xl:h-20 flex justify-start items-center bg-back border bg-black border-black space-x-2 rounded-lg hover:cursor-pointer hover:scale-105"
        >
            <div className={`w-full h-full -mt-1 -ml-1 ${randomBG}  border border-black rounded-sm flex justify-start items-center space-x-2 px-3`}>
                {community.communityLogo !== null && (
                    <Image
                        unoptimized
                        src={community.communityLogo as string}
                        width={8}
                        height={8}
                        alt="pfp"
                        className='w-auto h-[70%] rounded-sm aspect-square border border-black' draggable="false"
                    />
                )}

                {community.communityLogo === null && (
                    <div className='w-auto h-[70%] rounded-sm bg-BrutalOrange1 border-2 border-black aspect-square' />
                )}

                <div className='border-r border-r-black h-full' />

                <div className='w-full flex flex-col items-start justify-center'>
                    <p className='font-BebasNeue lg:text-base xl:text-xl  text-black font-medium'> {community.communityName.slice(0, 20)} </p>
                    {/* <p className='hidden xl:inline-block font-InriaSans text-xs text-black font-bold'> {community?.communityMembersID?.length} {community?.communityMembersID?.length > 1 ? "members" : "member"} </p> */}
                </div>
            </div>
        </Link>
    )
}

export default SmallCommunityCard