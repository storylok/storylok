import axios from 'axios'
import { saveNewGame, updateGameState } from './firebase'
import { AppStorage, ChatMessage } from '@/components/helpers/types'

const rollupUrl = 'http://localhost:3000'

export const createRollup = async (walletAddress: string) => {
  const response = await axios(`${rollupUrl}/createNewRollup`, {
    headers: {
      'x-token': process.env.NEXT_PUBLIC_ROLLUP_AUTH
    }
  })

  if (response.data && response.data['app_id'] && response.data['app_inbox']) {
    const { app_id, app_inbox } = response.data
    await saveNewGame(walletAddress, app_id, app_inbox)

    return { app_id, app_inbox }
  }
}

export const createStackrTx = async (appStorage: AppStorage, conv: ChatMessage[]) => {
  // Doing Tx for now on firebase but will happen on stf.
  await updateGameState(appStorage.docId, conv)
}
