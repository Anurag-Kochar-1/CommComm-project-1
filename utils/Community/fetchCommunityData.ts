import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/router"
import { db } from "../../firebaseConfig"

interface IProps {
    id: string
}

export const fetchCommunityData = async ( {id }:IProps ) => {
    if(id !== undefined || id !== null) {
        try {
            const communityRef = doc(db, "communities", id as string)
            const data = await getDoc(communityRef)
            return data.data()
        } catch (error) {
            console.log(error)
        }
    } else {
        alert("Try again "+ id)
    }
}
