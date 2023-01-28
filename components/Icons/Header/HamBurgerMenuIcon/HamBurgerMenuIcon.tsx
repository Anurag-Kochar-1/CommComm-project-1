import React from 'react'
import { GiHamburgerMenu } from "react-icons/gi"


const HamBurgerMenuIcon = () => {
  return (
    <button type='button' title='home' className={'lg:hidden w-8 h-8 bg-black outline-none flex justify-center items-center rounded-md relative '} >
        <div className={'w-8 h-8 bg-[#FF9C6F] flex justify-center items-center rounded-md absolute bottom-1 right-1 border-2 border-black hover:bottom-0 hover:right-0'}>
          <GiHamburgerMenu className='text-lg' />
        </div>
      </button>
  )
}

export default HamBurgerMenuIcon