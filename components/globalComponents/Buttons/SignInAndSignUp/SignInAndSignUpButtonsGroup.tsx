import React from 'react'
import SignInButton from './SignInButton/SignInButton'
import SignUpButton from './SignUpButton/SignUpButton'

const SignInAndSignUpButtonsGroup = () => {
  return (
    <div className='flex flex-row justify-center items-center space-x-3 md:space-x-5'>

        <SignInButton />
        <SignUpButton />
    </div>
  )
}

export default SignInAndSignUpButtonsGroup