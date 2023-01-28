import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { IMessageData } from '../../../../customTypesAndInterfaces/message/messageInterfaces'
import { auth } from '../../../../firebaseConfig'
import userDPdemo from "../../../../public/images/bg/userDPdemo.jpg"
import MessageOptionsMenu from './MessageOptionsMenu/MessageOptionsMenu'


interface IProps {
    message: IMessageData
}

const MessageCard = ({ message }: IProps) => {
    const [user] = useAuthState(auth)
    const router = useRouter()


    return (
        <div key={message?.messageID} className={` w-full flex  ${message.messageCreatorID === user?.uid ? "justify-end" : "justify-start"} space-x-1 py-2 px-2`} onClick={() => console.log(message)}>
            <div className={`flex justify-end items-center space-x-3 ${message?.messageCreatorID === user?.uid ? "bg-purple-200 " : "bg-blue-200"} py-2 px-2 rounded-md`} >

                <div className='w-10 h-10 flex justify-center items-center'>
                    <Image
                        quality={90}
                        src={message?.messageCreatorDisplayPicture || userDPdemo}
                        alt="dp"
                        className='w-7 h-7 rounded-md aspect-square hover:cursor-pointer'
                        width={7}
                        height={7}
                        onClick={() => router.push(`/profile/${message.messageCreatorID}`)}
                    />
                </div>

                <div className='flex flex-col items-start justify-start '>
                    <div className='flex justify-center items-center space-x-2'>
                        <p
                            className='font-Roboto text-black font-medium text-lg hover:cursor-pointer'
                            onClick={() => router.push(`/profile/${message.messageCreatorID}`)}>
                            {message?.messageCreatorName}
                        </p>
                        {message.messageCreatorID === user?.uid && <MessageOptionsMenu message={message} />}
                    </div>
                    <p className='font-Roboto text-black font-normal text-base pr-5'> {message?.messageText} </p>
                </div>

            </div>
        </div>
    )
}

export default MessageCard