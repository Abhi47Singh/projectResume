import { QuerySnapshot, arrayRemove, arrayUnion, collection, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import { toast } from "react-toastify";

export const getUserDetail = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((userCred) => {
            if (userCred) {
                const userData = userCred.providerData[0];

                const userDocRef = doc(db, "users", userData?.uid);
                const userUnsub = onSnapshot(userDocRef, (_doc) => {
                    if (_doc.exists()) {
                        resolve(_doc.data());
                    } else {
                        setDoc(userDocRef, userData).then(() => {
                            resolve(userData);
                        });
                    }
                });

                // Ensure we return the correct unsubscribe function
                return userUnsub;
            } else {
                reject(new Error("User is not authenticated"));
            }
        });

        // Unsubscribe from the auth listener
        return () => unsubscribe();
    });
};

// Function to get templates
export const getTemplates = () => {
    return new Promise((resolve, reject) => {
        const templateQuery = query(
            collection(db, "templates"),
            orderBy("timestamp", "asc")
        );

        const unsubscribeTemplates = onSnapshot(templateQuery, (querySnap) => {
            const templates = querySnap.docs.map((doc) => doc.data());
            resolve(templates);
        });

        // Return the unsubscribe function
        return unsubscribeTemplates
    });
};


export const saveToCollection = async (user, data) => {
    if (!user?.collections?.includes(data?._id)) {
        const docRef = doc(db, "users", user?.uid)

        await updateDoc(docRef, {
            collections: arrayUnion(data?._id)
        })
    }
    else if (user?.collections?.includes(data?._id)) {
        const docRef = doc(db, "users", user?.uid)

        await updateDoc(docRef, {
            collections: arrayRemove(data?._id)
        })
    }
}

export const saveToFavourites = async (user, data) => {

    if (!data?.favourites?.includes(user?.uid)) {
        const docRef = doc(db, "templates", data?._id)

        await updateDoc(docRef, {
            favourites: arrayUnion(user?.uid)
        })
    }
    else {
        const docRef = doc(db, "templates", data?._id)

        await updateDoc(docRef, {
            favourites: arrayRemove(user?.uid)
        })
    }
}

export const getTemplateDetails = async (templateID) => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(doc(db, "templates", templateID), (doc) => {
            resolve(doc.data())
        })
        return unsubscribe
    })
}

export const getTemplateDetailEditByUser = (uid, id) => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(doc(db, "users", uid, "resumes", id), (doc) => {
            resolve(doc.data())
        })

        return unsubscribe
    })
}

export const getSaveResumes = (uid, id) => {
    return new Promise((resolve, reject) => {
        const templateQuery = query(collection(db, "users", uid, "resumes"), orderBy("timeStamp", "asc"))

        const unsubscribe = onSnapshot(templateQuery, (querySnap) => {
            const templates = querySnap.docs.map((doc) => doc.data())
        })

        return unsubscribe
    })
}