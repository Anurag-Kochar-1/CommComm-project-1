import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FcGoogle } from "react-icons/fc"
import { MdOutlineFacebook } from "react-icons/md"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebaseConfig"
import { useRouter } from 'next/router'
import { SignInWithGoogleFunction } from "../../utils/SignInWithGoogle/SignInWithGoogle"
import { SignInWithFacebookFunction } from "../../utils/SignInWithFacebook/SignInWithFacebook"
import { useDispatch } from 'react-redux'
import { setIsBottomBarVisible } from "../../redux/slices/bottomBarSlice"
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'

import logoTwo from "../../public/images/logos/logoTwo.png"
import { UserProfileDisplayPictures } from '../../constants/User/UserProfileDisplayPictures'

const Index = () => {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const dispatch = useDispatch()
  const [emailInputValue, setEmailInputValue] = useState<string>("")
  const [userNameInputValue, setUserNameInputValue] = useState<string>("")
  const [passwordInputValue, setPasswordInputValue] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const allInputRef: any = useRef(null)

  const signUp = () => {
    if (userNameInputValue && emailInputValue && passwordInputValue) {
      if (userNameInputValue.length > 5 && userNameInputValue.length < 20) {
        if (passwordInputValue.length >= 6) {
          setIsLoading(true)
          createUserWithEmailAndPassword(auth, emailInputValue, passwordInputValue)
            .then((response) => {
              console.log(response)
              // updating user's profile
              updateProfile(auth?.currentUser as any, {
                displayName: userNameInputValue,
                photoURL: ""
              }

              ).then(() => {
                console.log('PROFILE UPDATED !')
                setIsLoading(false)
                createUserInDB(auth.currentUser?.uid as string)
                
              }).catch((error) => {
                console.log(error)
                setIsLoading(false)
              });

            }).catch((error) => {
              console.log(error?.message)
              setIsLoading(false)
            })


          // Resetting States
          setUserNameInputValue("")
          setEmailInputValue("")
          setPasswordInputValue("")
        } else {
          alert("Password should be more than 6 characters")
        }
      } else {
        alert("Username should not be more than 20 characters and less than 5 characters ")
      }
    } else {
      alert("Fill all fields")
    }
  }


  const createUserInDB = async (userID: string) => {
    console.log(`Creating user in DB from email and passowrd`);

    await setDoc(doc(db, "users", userID), {
      userName: userNameInputValue,
      userDisplayPicture: UserProfileDisplayPictures[`${Math.floor(Math.random() * 4)}`],
      userEmail: emailInputValue,
      userID: userID,
      userProfileBanner: "",

      communitiesJoinedID: [],
      communitiesOwnedID: [],
      createdPostsID: [],
      likedPostsID: [],
      dislikedPostsID: [],

      userCoins: 100
    })

    sendSignUpRewardNotification(userID)
    router.push("/")
  }


  const sendSignUpRewardNotification = async (userID: string) => {
      console.log(`sendSignUpRewardNotification is running`);
      try {
        const userNotificationSubCollectionRef = collection(db, 'users', userID , 'notifications')
        const sendingNotification = await addDoc(userNotificationSubCollectionRef, {
          notificationID: "",
          notificationText: "You got 100 coins",
          notificationIconName: "coinIcon",
          notificationSendedAt: serverTimestamp()
        })

        // adding id 
        const notificationRef = doc(db, 'users', userID, 'notifications', sendingNotification?.id)
        await updateDoc(notificationRef, {
          notificationID: sendingNotification?.id
        })

      } catch (error) {
        console.error(error);
      }
  }


  useEffect(() => {
    if (user && !loading) {
      router.push("/")
    }
  }, [user])

  return (
    <div className='fixed inset-0 w-[100%] h-[100vh] bg-white lg:bg-BrutalRed1 flex flex-row justify-center lg:justify-end items-center lg:px-28 xl:px-52 2xl:px-60'>

      {/* <img src={blueLinesBG} alt='bg' className='fixed inset-0 z-10 w-full h-full' draggable="false" /> */}



      {!isLoading && (
        <div className='z-20 w-full h-[90vh] mb-[10vh] lg:mb-0 sm:w-[70%] sm:h-[70vh] md:w-[70%] lg:w-[60%] xl:w-[40%] 2xl:w-[35%] bg-white rounded-md flex flex-col justify-start items-start pt-10 pb-5 px-5 space-y-5 overflow-x-hidden overflow-y-scroll scrollbar-hide'>

          {/* ---- LOGO ---- */}
          <Link href={'/'} className='flex justify-center items-center space-x-3'>
            {/* <div className='w-6 h-6 rounded-full bg-BrutalPurple2 flex justify-center items-center text-white' /> */}
            <Image src={logoTwo as any} alt="logo" className='w-6 h-6 rounded-full' width={6} height={6} unoptimized quality={100} />
            <span className='font-semibold'> CommComm </span>
          </Link>

          {/* ---- Heading ----- */}
          <h1 className='text-3xl font-bold'> Create an account </h1>

          {/* ---- Continue with google and facebook ----- */}
          <div className='flex justify-start items-center space-x-5'>
            <button onClick={() => {
              SignInWithGoogleFunction()
              setTimeout(() => {
                if (user && !loading) {
                  router.push('/')
                }
              }, 3000);
            }} type='button' title='google' className='bg-white w-14 h-14 rounded-full flex justify-center items-center border-2 border-gray-200'>
              <FcGoogle className='w-10 h-10' />
            </button>

            <button
              onClick={() => {
                SignInWithFacebookFunction()
                setTimeout(() => {
                  if (user && !loading) {
                    router.push('/')
                  }
                }, 3000);
              }}
              type='button'
              title='facebnook'
              className='w-14 h-14 rounded-full flex justify-center items-center border-2 border-gray-200'>
              <MdOutlineFacebook className='text-blue-500 w-10 h-10' />
            </button>
          </div>

          <span className='mx-auto' onClick={() => console.log(auth?.currentUser)}> Or </span>

          {/* ---- Sign up with email */}
          <div className='w-full h-full flex flex-col items-start justify-start'>
            <h3 className='font-bold text-base'> Sign up with email </h3>
            <span className='text-base font-normal'> Already have an account? <Link className='text-blue-500 hover:cursor-pointer' href='/login'> Log in </Link> </span>

            <div className='w-full flex flex-col justify-between items-start space-y-4 py-3 mt-4'>

              <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                <input
                  value={emailInputValue}
                  onChange={(e) => setEmailInputValue(e.target.value)}
                  required
                  type="email"
                  placeholder='Email address'
                  className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'

                />
              </div>

              <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                <input
                  value={userNameInputValue}
                  onChange={(e) => setUserNameInputValue(e.target.value)}
                  required
                  type="text"
                  placeholder='Username'
                  className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'
                />
              </div>

              <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
                <input
                  value={passwordInputValue}
                  onChange={(e) => setPasswordInputValue(e.target.value)}
                  required
                  type="password"
                  placeholder='Password'
                  className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'
                />
              </div>
            </div>


            {/* ---- Continue Button div ---- */}
            <div className='w-full flex justify-end items-center py-5'>
              <button
                onClick={signUp}
                type='button'
                title='singIn'
                className='w-20 md:w-32 h-10 relative flex justify-center items-center bg-black rounded-sm border-2 border-black'>
                <span className='w-20 md:w-32 h-10 absolute bottom-[2px] right-[2px] bg-BrutalBlue1  flex justify-center items-center rounded-sm border-2 border-black active:right-0 active:bottom-0 hover:right-0 hover:bottom-0'>
                  <p className='text-xs md:text-sm font-medium'> Continue  </p>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}


      {isLoading && (
        <div className='z-50 fixed inset-0 w-full h-screen flex justify-center items-center bg-white scrollbar-hide'>
          <AiOutlineLoading3Quarters className='animate-spin text-2xl text-BrutalBlack1' />
        </div>
      )}
    </div>
  )
}

export default Index