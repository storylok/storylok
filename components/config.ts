import { WalletEntryPosition } from '@particle-network/auth'
import { MantleTestnet, ScrollSepolia, BaseGoerli } from '@particle-network/chains'
import { evmWallets } from '@particle-network/connect'

export default {
  projectId: process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID ?? '',
  clientKey: process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY ?? '',
  appId: process.env.NEXT_PUBLIC_PARTICLE_APP_ID ?? '',
  chains: [
    MantleTestnet, ScrollSepolia, BaseGoerli
  ],
  particleWalletEntry: {    //optional: particle wallet config
    displayWalletEntry: true, //display wallet button when connect particle success.
    defaultWalletEntryPosition: WalletEntryPosition.BR,
    supportChains: [
      MantleTestnet, ScrollSepolia, BaseGoerli
    ],
    customStyle: {}, //optional: custom wallet style
  },
  securityAccount: { //optional: particle security account config
    //prompt set payment password. 0: None, 1: Once(default), 2: Always
    promptSettingWhenSign: 0,
    //prompt set master password. 0: None(default), 1: Once, 2: Always
    promptMasterPasswordSettingWhenLogin: 0
  },
  wallets: evmWallets({
    projectId: process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID ?? '',
  }),
}