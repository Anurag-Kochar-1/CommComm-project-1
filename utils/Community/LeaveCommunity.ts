import { arrayRemove, doc, updateDoc } from "firebase/firestore"
import { db } from "../../firebaseConfig"


const LeaveCommunity = async (userID: string, communityID: string) => {

    try {
        const userRef = doc(db, "users", userID)
        const communityRef = doc(db, "communities", communityID)

        // updaing community
        await updateDoc(communityRef, {
            communityMembersID: arrayRemove(userID)
        })

        // updaing user
        await updateDoc(userRef, {
            communitiesJoinedID: arrayRemove(communityID)
        })

        console.log(`LEFT !!!`);
    } catch (error) {
        alert("Try Again")
    }

}




export { LeaveCommunity }