// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp, } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { Firestore, addDoc, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { ChatMessage } from "@/components/helpers/types";
import dotenv from 'dotenv'

dotenv.config()

let app: FirebaseApp
let db: Firestore

export const setup = () => {
  const firebaseConfig = JSON.parse((process.env.NEXT_PUBLIC_FIREBASE_CONFIG ?? ''));

  if (app) return;
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

export const saveNewGame = async (walletAddress: string, app_id: string, app_inbox: string) => {
  try {
    const cf = collection(db, "games")

    // Document doesn't exist, create a new one
    const newDocData = {
      appConfig: { app_id, app_inbox },

      player: walletAddress,
    }

    const docRef = await addDoc(cf, newDocData);

    // Return the newly created document data if needed
    return { docId: docRef.id, app_id, app_inbox };
  } catch (e) {
    console.error(e)
  }
}

export const updateGameState = async (docId: string, conv: ChatMessage[]) => {
  try {
    const cf = collection(db, "games")

    // Document doesn't exist, create a new one
    const newDocData = {
      conversation: arrayUnion(...conv)
    }

    await updateDoc(doc(cf, docId), newDocData);
  } catch (e) {
    console.error(e)
  }
}

export const mintNftOnWalletF = async (docId: string, description: string, image: string, name: string, hash: string) => {
  try {
    if(!db) setup()
    const cf = collection(db, "games")

    // Document doesn't exist, create a new one
    const newDocData = {
      description,
      image,
      name,
      hash,
      timestamp: Date.now()
    }

    await setDoc(doc(cf, docId), newDocData, { merge: true });
  } catch (e) {
    console.error(e)
  }
}


export const fetchLatestNftsF = async () => {
  try {
    const cf = collection(db, "games")

    const q = query(cf, orderBy("timestamp", "desc"), limit(10))

    const response = await getDocs(q)

    const docs = response.docs
    console.log('docsss', docs)

    if (docs.length > 0) {
      return docs;
    }
    return null;
  } catch (e) {
    console.log(e)
    return null;
  }
}

