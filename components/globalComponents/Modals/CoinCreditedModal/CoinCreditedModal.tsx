import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import PlusIcon from '../../../Icons/Header/PlusIcon/PlusIcon'
import { useDispatch, useSelector } from "react-redux"
import { setIsCoinCreditedModalOpen, setIsCreateOptionsModalOpen } from "../../../../redux/slices/modalSlice"
import CrossIcon from '../../../Icons/General/CrossIcon/CrossIcon'
import Link from 'next/link'
import { useRouter } from 'next/router'


export default function CoinCreditedModal() {
    // console.log(`===== CreateOptionsModal is running =====`);
    const router = useRouter()
    const dispatch = useDispatch()
    const isCoinCreditedModalOpen = useSelector((state: any) => state?.modal?.isCoinCreditedModalOpen)

    function closeModal() {
        dispatch(setIsCoinCreditedModalOpen(false))
    }

    return (
        <>
            <Transition appear show={isCoinCreditedModalOpen} as={Fragment}>
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
                                <Dialog.Panel className="w-[70%] sm:w-[50%] md:w-[40%] lg:w-[35%] xl:w-[25%] 2xl:w-[20%] scrollbar-hide bg-transparent flex flex-col justify-start items-start overflow-x-hidden overflow-y-scroll border-2 border-black">

                                    <div className='w-full h-full bg-white flex flex-col justify-start items-start px-5 py-6 md:py-12'>

                                        <div
                                            onClick={() => {
                                                closeModal()
                                            }}
                                            className='w-full py-2 space-y-6 flex flex-col justify-start items-center my-4 hover:cursor-pointer'>
                                            <div className='w-full h-16 relative bg-black border-2 border-black flex justify-between items-center'>
                                                <div className='w-full h-16 absolute right-1 bottom-1 flex justify-center items-center bg-BrutalAqua1 border-2 border-black active:right-0 active:bottom-0'>
                                                    <p className='font-bold text-base text-black'> aaaaaaaaaaa </p>
                                                </div>
                                            </div>
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



