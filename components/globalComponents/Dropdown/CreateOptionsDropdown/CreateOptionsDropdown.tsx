// import { Menu, Transition } from '@headlessui/react'
// import Link from 'next/link'
// import { Fragment } from 'react'
// import PlusIcon from '../../../Icons/Header/PlusIcon/PlusIcon'

// const CreateOptionsDropdown = () => {
//     return (
//         <div className="text-right hidden lg:inline-block  bg-gray-500 p-2">
//           <Menu as="div" className="relative inline-flex justify-center items-center text-left bg-green-500 ">
//             <div className='flex justify-center items-center'>
//               <Menu.Button>
//                 <PlusIcon />
//               </Menu.Button>
//             </div>
//             <Transition
//               as={Fragment}
//               enter="transition ease-out duration-100"
//               enterFrom="transform opacity-0 scale-95"
//               enterTo="transform opacity-100 scale-100"
//               leave="transition ease-in duration-75"
//               leaveFrom="transform opacity-100 scale-100"
//               leaveTo="transform opacity-0 scale-95"
//             >
//               <Menu.Items className="absolute right-0 mt-12 w-52 bg-white origin-top-right divide-y divide-gray-100 rounded-md bg-lightColor shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                 <div className="px-3 py-1 my-1">
//                   <Menu.Item as={Fragment}>
//                         <Link href={"/"}>
//                           <button
//                           type='button'
//                           >
//                             Create Community
//                           </button>
//                         </Link>
//                   </Menu.Item>
//                 </div>

//                 <div className="px-3 py-1 my-1">
//                   <Menu.Item as={Fragment}>
//                     <Link href={"/"}>
//                         <button
//                         type='button'
//                         >
//                           Upload Post
//                         </button>
//                     </Link>
//                   </Menu.Item>
//                 </div>
//               </Menu.Items>
//             </Transition>
//           </Menu>
//         </div>
//       )
  
// }

// export default CreateOptionsDropdown


import React from 'react'

const CreateOptionsDropdown = () => {
  return (
    <div>CreateOptionsDropdown</div>
  )
}

export default CreateOptionsDropdown