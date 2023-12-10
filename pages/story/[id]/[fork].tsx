import { collection, getDocs, getFirestore, query, where } from "firebase/firestore"
import { initializeApp } from "firebase/app"
import Gameplay from "@/components/Gameplay/Gameplay"

type StoryPageProps = {
  nftExists: boolean
  nft?: any
}

export default function StoryPage(props: StoryPageProps) {
  const { nftExists, nft } = props

  if (!nftExists) return <>Nft Doesn't Exists</>

  return <Gameplay nft={nft} />
}

export async function getServerSideProps(context: any) {
  const { id, fork } = context.query


  const fetchProjectByTimestamp = async (timestamp: number) => {
    try {

      const firebaseConfig = JSON.parse((process.env.NEXT_PUBLIC_FIREBASE_CONFIG ?? ''));
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const cf = collection(db, "games")

      const q = query(cf, where("timestamp", "==", timestamp))

      const response = await getDocs(q)

      const docs = response.docs

      if (docs.length == 1) {
        return { ...docs[0].data(), conversation: docs[0].data().conversation.slice(0, fork) };
      }
      return null;
    } catch (e) {
      console.log(e)
      return null;
    }
  }

  if (!id || !fork) {
    return { props: { nftExists: false } }
  }

  const nft = await fetchProjectByTimestamp(parseInt(id.toString()))
  if (!nft) {
    return { props: { nftExists: false } }
  }

  if (nft.conversation.length < parseInt(fork)) {
    return { props: { nftExists: false } }
  }

  // Pass data to the page via props
  return { props: { nft: { ...nft, conversation: nft.conversation.slice(1, 2 * fork) }, nftExists: true } }
}
