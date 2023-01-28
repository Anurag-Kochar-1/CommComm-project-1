import { arrayUnion, doc, updateDoc } from "firebase/firestore"
import { db } from "../../firebaseConfig"


const JoinCommunity = async (userID: string, communityID: string) => {

    try {
        const userRef = doc(db, "users", userID)
        const communityRef = doc(db, "communities", communityID)

        // updaing community
        await updateDoc(communityRef, {
            communityMembersID: arrayUnion(userID)
        })

        // updaing user
        await updateDoc(userRef, {
            communitiesJoinedID: arrayUnion(communityID)
        })

        console.log(`JOINED !!!`);
    } catch (error) {
        alert("Try Again")
    }

}




export { JoinCommunity }