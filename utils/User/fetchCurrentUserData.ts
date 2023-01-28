import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../../firebaseConfig"

export const fetchCurrentUserData = async () => {
    const id: string | undefined = auth?.currentUser?.uid
    if (id) {
        try {
            console.log(`fetching current user data`);
            const userRef = doc(db, "users", id as string)
            const data = await getDoc(userRef)
            return data.data()

        } catch (error) {
            alert(error)
        }
    }
}

