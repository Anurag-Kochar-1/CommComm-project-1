import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { communityCategoriesArray, communitySubCategoriesArray } from "../../constants/createCommunityPage/communityCategories"
import { addDoc, arrayUnion, collection, doc, increment, updateDoc } from 'firebase/firestore'
import { db, auth } from '../../firebaseConfig'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useDispatch } from 'react-redux'
import { setIsBottomBarVisible } from '../../redux/slices/bottomBarSlice'
import logoTwo from "../../public/images/logos/logoTwo.png"
import Image from 'next/image'

import { communityCategoriesBannersURLArray, communitySubCategoriesLogoArray } from '../../constants/createCommunityPage/communityCategories'



const Index = () => {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const dispatch = useDispatch()

  const [communityNameInputValue, setCommunityNameInputValue] = useState<string>("")
  const [communityCategory, setCommunityCategory] = useState<string>(communityCategoriesArray[0].label)
  const [communitySubCategory, setCommunitySubCategory] = useState<string>(communitySubCategoriesArray[0].parentLabel)
  const [isDemoOpen, setIsDemoOpen] = useState<boolean>(true)
  const [categoryID, setCategoryID] = useState<number>(0)
  const communitiesCollectionRef = collection(db, "communities")

  const [categoryBannerURL, setCategoryBannerURL] = useState<string>("https://firebasestorage.googleapis.com/v0/b/th3-hackathon.appspot.com/o/postImages%2FRectangle%20111.png?alt=media&token=228bdf8c-24e1-4ad1-bd99-3b1681aa0a0f")

  const [communityLogoURL, setCommunityLogoURL] = useState<string>("https://firebasestorage.googleapis.com/v0/b/th3-hackathon.appspot.com/o/communityLogos%2Ftile-2822716_960_720.webp?alt=media&token=c7e987df-b500-42a2-9334-a87dfd33e1d1")

  const getBanner =  (categoryValue: string) => {
    console.log(`getBanner is running`);
    communityCategoriesBannersURLArray.map((category) => {
      if(category.value === categoryValue) {
        setCategoryBannerURL(category.bannerURL)
      }
    })
  }

  const getLogo = (subCategoryValue: string) => {
    console.log(`getLogo is running`)
    communitySubCategoriesLogoArray.map((subCategory) => {
      if(subCategoryValue === subCategory?.value) {
        setCommunityLogoURL(subCategory?.logoURL)
      } else {
        setCommunityLogoURL("https://firebasestorage.googleapis.com/v0/b/th3-hackathon.appspot.com/o/communityLogos%2Ftile-2822716_960_720.webp?alt=media&token=c7e987df-b500-42a2-9334-a87dfd33e1d1")
      }
    })
  }


  const createCommunity = async () => {
    if (!communityNameInputValue || communityCategory === "Choose Category" || communitySubCategory === "Choose Sub Category") {
      alert("Fill all fields")
    } else {
      if (communityNameInputValue.length < 5 || communityNameInputValue.length > 21) {
        alert("Community Name should be more than 5 characters and less than 21 characters")
      } else if (communityNameInputValue.length > 5 || communityNameInputValue.length < 21) {
        try {
          console.log("creating community")
          const addingCommunityDoc = await addDoc(communitiesCollectionRef, {
            communityID: "",
            communityName: communityNameInputValue,
            communityCategory: communityCategory,
            communitySubCategory: communitySubCategory,
            communityLogo: communityLogoURL,
            communityBanner: categoryBannerURL,
            communityMembersID: [auth?.currentUser?.uid],
            communityOwnerID: auth?.currentUser?.uid,
            communityOwnerDisplayName: auth?.currentUser?.displayName,
            communityOwnerEmail: auth.currentUser?.email,
            communityPostsID: [],
            communityDescription: `This is community is for ${communityCategory} (${communitySubCategory}), made by ${user?.displayName}`,

            isCommunitySuggested: false,
            isCommunityTrending: false,

            communityCoursesID: []
          })

          const communityRef = doc(db, "communities", addingCommunityDoc.id)

          // adding communityID manually hehe
          await updateDoc(communityRef, {
            communityID: addingCommunityDoc?.id
          })

          // updating user and Sending Coins to user
          const userRef = doc(db, "users", auth?.currentUser?.uid as string)
          const updateUser = await updateDoc(userRef, {
            communitiesJoinedID: arrayUnion(communityRef.id),
            communitiesOwnedID: arrayUnion(communityRef.id),
            userCoins: increment(50)
          })



          router.push(`/community/${addingCommunityDoc.id}`)

          // resetting states
          setCommunityNameInputValue("")
        } catch (error) {
          alert(error)
        }


      }

    }
  }


  useEffect(() => {
    if (!user && loading === false) {
      router.push("/register")
    }
  }, [loading])

  useEffect(() => {
    getBanner(communityCategory)
  },[communityCategory]) 

  useEffect(() => {
    getLogo(communitySubCategory)
  },[communitySubCategory])

  return (
    <div className='fixed inset-0 w-[100%] h-[100vh] bg-BrutalOrange1 flex flex-row justify-center lg:justify-end items-center lg:px-32 xl:px-40 2xl:px-72'>

      <div className='z-50 w-full h-[90vh] mb-[10vh] lg:mb-0 sm:w-[70%] sm:h-[70vh] md:w-[70%] lg:w-[60%] xl:w-[40%] 2xl:w-[35%] bg-white rounded-md flex flex-col justify-start items-start pt-10 pb-5 px-5 space-y-5 overflow-x-hidden overflow-y-scroll scrollbar-hide'>

        {/* ---- LOGO ---- */}
        <div className='flex justify-center items-center space-x-3'>
          <Image src={logoTwo as any} alt="logo" className='w-6 h-6 rounded-full' width={6} height={6} unoptimized quality={100} />
          <span> CommCom </span>
        </div>

        {/* ---- Heading ----- */}
        <h1 className='text-3xl font-bold' onClick={() => {
          console.log(communityCategory + " ___ " + communitySubCategory + `___ Name -> ${communityNameInputValue}`)
        }}> Create a Community </h1>


        {/* ---- Fill community details ---- */}
        <div className='w-full h-full flex flex-col items-start justify-start'>
          <p className='font-medium text-sm text-gray-900' onClick={() => {
            console.log(`categoryBannerURL -- ${categoryBannerURL} `)
            console.log(`communityLogoURL -- ${communityLogoURL} `)
          }}> Your own community where you and others can build good habits and skills with the support of each other  </p>

          <div className='w-full flex flex-col justify-between items-start space-y-4 py-3 mt-4'>

            {/* ---- Name ---- */}
            <div className='w-[90%] h-10 relative bg-black flex justify-start items-center' onMouseEnter={() => dispatch(setIsBottomBarVisible(false))} onMouseLeave={() => dispatch(setIsBottomBarVisible(true))}>
              <input
                value={communityNameInputValue}
                onChange={(e) => setCommunityNameInputValue(e.target.value)}
                required
                type="email"
                placeholder='Community Name'
                className='w-full h-10 absolute right-1 bottom-1 text-black placeholder:text-black outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'
              />
            </div>

            {/* ---- Category ---- */}
            <div className='w-[90%] h-10 relative bg-black flex justify-start items-center '>
              <select
                title='choose'
                className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'
                value={communityCategory}
                onChange={(e) => {
                  setCommunityCategory(e.target.value)
                  setCommunitySubCategory(communitySubCategoriesArray[0].parentLabel)
                  setIsDemoOpen(false)
                }}
              >
                {communityCategoriesArray && communityCategoriesArray?.map((category) => {
                  return (
                    <option
                      key={category.id}
                      value={category.value}
                      className='bg-white px-2 py-3 text-black text-base'
                    > {category.label} </option>
                  )
                })}
              </select>
            </div>

            {/* Sub Categories */}
            {communityCategory !== communityCategoriesArray[0].label && <div className='w-[90%] h-10 relative bg-black flex justify-start items-center'>
              <select
                title='choose'
                className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'
                value={communitySubCategory}
                onChange={(e) => setCommunitySubCategory(e.target.value)}
              >

                {communitySubCategoriesArray && communitySubCategoriesArray.filter((subCategory) => {
                  if (subCategory.parentValue === communityCategory) {
                    // console.log(subCategory)
                    return subCategory
                  } else {
                    return
                  }
                }).map((subC) => {
                  return (
                    subC.subCategories.map((sub) => {
                      return <option
                        key={sub.id}
                        value={sub.value}
                        onChange={() => setCommunitySubCategory(sub.value)}
                        className='bg-white px-2 py-3 text-black text-base'
                      > {sub.label} </option>
                    })
                  )
                })

                }

              </select>
            </div>}


            {/* Demo  communityCategory === communityCategoriesArray[0].label */}
            {communityCategory === communityCategoriesArray[0].label && <div className='w-[90%] h-10 relative bg-black flex justify-start items-center'>
              <select
                title='Choose Sub Category'
                className='w-full h-10 absolute right-1 bottom-1 outline-none focus:ring-0 px-2 placeholder:px-2 border-2 border-black'
              >

                <option
                  key={"Choose Sub Category"}
                  value={"Choose Sub Category"}
                  className='bg-white px-2 py-3 text-black text-base'
                > {"Choose Sub Category"} </option>

              </select>
            </div>}


          </div>


          {/* ---- Create Button div ---- */}
          <div className='w-full h-full flex justify-end items-center py-5'>
            <button
              onClick={createCommunity}
              type='button'
              title='singIn'
              className='w-20 md:w-32 h-10 relative flex justify-center items-center bg-black rounded-sm border-2 border-black'>
              <span className='w-20 md:w-32 h-10 absolute bottom-[2px] right-[2px] bg-BrutalGreen1  flex justify-center items-center rounded-sm border-2 border-black active:right-0 active:bottom-0'>
                <p className='text-xs md:text-sm font-bold '> Create  </p>
              </span>
            </button>
          </div>
        </div>


      </div>
    </div>
  )
}

export default Index

