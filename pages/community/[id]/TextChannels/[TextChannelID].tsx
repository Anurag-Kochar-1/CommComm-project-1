import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/router"
import CommunityLayout from "../../../../components/layouts/Community/CommunityLayout"
import { FiSend } from "react-icons/fi"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../../../../firebaseConfig"
import { addDoc, collection, doc, getDocs, limit, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore"

import Image from "next/image"
import { GrFormAdd } from "react-icons/gr"
import { useSelector } from "react-redux"
import MessageCard from "../../../../components/globalComponents/message/MessageCard/MessageCard"

const Index = ({ allCommunityMessage }: any) => {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const { TextChannelID } = router.query
  const { id } = router.query
  const [messageInputValue, setMessageInputValue] = useState<string>("")
  const [realTimeMessagesState, setRealTimeMessagesState] = useState<any[]>([])

  const messageInputRef: any = useRef(null)

  const sendMessage = async () => {
    if (user && !loading) {
      try {
        if (messageInputValue) {
          const date = new Date()

          const communityMessagesSubCollectionRef = collection(db, "communities", id as string, "communityMessages")
          const addingMessage = await addDoc(communityMessagesSubCollectionRef, {
            messageText: messageInputValue,
            messageCreatorID: user?.uid,
            messageCreatorName: user?.displayName,
            messageCreatorDisplayPicture: user?.photoURL,
            messageID: "",
            messageCreatedAtCommunityID: id as string,
            messageCreatedAtTime: date.getTime() as number
          })

          // adding messageID
          await updateDoc(addingMessage, {
            messageID: addingMessage.id
          })



          // resetting
          setMessageInputValue("")
        } else {
          alert("Type message")
        }

      } catch (error) {
        alert(error)
      }
    } else if (!user && !loading) {
      router.push("/register")
    }
  }

  const communityDataRedux = useSelector((state: any) => state.communityData.currentCommunityData[0])


  useEffect(() => {
    const communityMessagesRefAndQuery = query(collection(db, "communities", id as string, "communityMessages"), orderBy("messageCreatedAtTime", "asc"))
    const unSubRealTimeMessagesOnSnapShotListener = onSnapshot(communityMessagesRefAndQuery, (snapshot) => {
      setRealTimeMessagesState(snapshot.docs.map(doc => doc.data()))
    })
  }, [])

  // useEffect(() => {
  //   console.log(` sorting messages `)
  //   realTimeMessagesState.sort(function (a, b) {
  //     if (a.messageCreatedAtTime < b.messageCreatedAtTime) { return -1 }
  //     if (a.messageCreatedAtTime > b.messageCreatedAtTime) { return 1 }
  //     return 0
  //   })
  // },[realTimeMessagesState])

  return (
    <CommunityLayout>
      <main className='w-full flex flex-col justify-between items-center bg-white pb-5 sm:px-4'>
        {/* <h1 className="my-10 text-3xl font-bold " onClick={() => console.log(communityDataRedux)}>  lOG communityDataRedux </h1> */}


        {/* Message Box */}
        <div className='w-full space-y-3 pb-40 px-3 bg-white py-5 rounded-md scrollbar-hide'>
    
          {realTimeMessagesState[0] && (
            realTimeMessagesState?.map((message: any) => {
              return (
                <MessageCard message={message} key={message?.messageID} /> 
              )
            })
          )}



          {!realTimeMessagesState[0] && (
            <div className="w-full flex justify-center items-center p-2">
              <div className="px-8 py-4 bg-BrutalBlue1">
                <p className="font-bold text-lg"> Be the first one to message 😉 </p>
              </div>
            </div>
          )}

          
        </div>


        {/* Message Bar  */}
        <div className='z-50 fixed bottom-[0vh] lg:bottom-[2vh] w-full lg:w-[55%] h-20 lg:h-[8vh]  bg-purple-300 flex justify-between items-end space-x-3 p-2'>

          <input
            ref={messageInputRef}
            value={messageInputValue}
            onChange={(e) => setMessageInputValue(e.target.value)}
            type="text"
            placeholder='TYPE HERE...'
            className='outline-none focus:ring-0 w-full h-full px-4 py-1 placeholder:text-black text-black font-InriaSans text-base border-2 border-black rounded-sm'
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                sendMessage()
              }
            }}
          />

          <button
            type='button'
            title='send'
            className='w-[20%] md:w-[10%] bg-white h-full outline-none flex justify-center items-center border-2 border-black rounded-sm'
            onClick={() => {
              sendMessage()
            }}
          >
            <FiSend className="text-2xl" />

          </button>
        </div>
      </main>
    </CommunityLayout>
  )
}

export default Index



export const getServerSideProps = async ({ params }: any) => {
  const { id }: string | any = params

  const allCommunityMessage: any[] = []

  // fetching community messages
  const messagesSubCollectionRef = collection(db, "communities", id as string, "communityMessages")
  const res = await getDocs(messagesSubCollectionRef)
  res.forEach((message) => {
    return allCommunityMessage.push(message.data())
  })

  return {
    props: {
      allCommunityMessage
    }
  };
}
