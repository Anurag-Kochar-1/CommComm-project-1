import { Menu, Transition } from '@headlessui/react'
import { arrayRemove, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BiDotsVertical } from 'react-icons/bi'
import { IMessageData } from '../../../../../customTypesAndInterfaces/message/messageInterfaces'
import { auth, db } from '../../../../../firebaseConfig'


interface IProps {
    message: IMessageData
}


const MessageOptionsMenu = ( {message}: IProps ) => {
    const [user] = useAuthState(auth)
    const router = useRouter()
    const {id} = router.query

    const deleteMessage = async () => {
        if(message.messageCreatorID === user?.uid){
            const messageRef = doc(db, `communities/${id}/communityMessages/${message.messageID}`)
            
            await deleteDoc(messageRef)
        }
    }

    return (
        <div className="text-right z-50">
            <Menu as="div" className="relative inline-block text-left z-50">
                <div className='z-50'>
                    <Menu.Button className="inline-flex w-full justify-center rounded-md text-sm font-medium text-white">
                        <BiDotsVertical className='inline-block w-4 h-4 text-black hover:cursor-pointer' />
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

                    <Menu.Items className="bg-white absolute right-0 mt-2 w-52 origin-top-right divide-y divide-gray-100 rounded-md space-y-2 border-2 border-black p-2 z-50">

                        <div className="px-3 py-2 z-50 bg-BrutalRed1 rounded-md hover:cursor-pointer">
                            <Menu.Item as={Fragment}>
                                <div onClick={ deleteMessage }>
                                    <button
                                        type='button'
                                        className='text-black font-Roboto font-semibold'
                                    >
                                        Delete Message
                                    </button>
                                </div>
                            </Menu.Item>
                        </div>





                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    )
}

export default MessageOptionsMenu