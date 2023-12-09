import Header from '@/components/Header'
import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ParticleAdapter, PhantomWalletAdapter, SolflareWalletAdapter, TrustWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Importing particle network libraries.
import { ModalProvider } from '@particle-network/connect-react-ui'
import { MantleTestnet } from '@particle-network/chains'
import config from '@/components/config'

import mixpanel from 'mixpanel-browser'
import { useEffect, useMemo } from 'react';
import * as firebase from '@/rollup/firebase'

// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    firebase.setup()
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL ?? '', { track_pageview: true, persistence: 'localStorage' });
  }, [])

  return <>
    <ModalProvider
      options={config}
      theme={'light'}
      language={'en'}   //optional：localize, default en
      particleAuthSort={[    //optional：display particle auth items and order
        'phone',
        'google',
        'apple',
        'twitter'
      ]}
    >

      <Header />
      <Component {...pageProps} />
      <div id="modal" />
    </ModalProvider>
  </>
}

export default MyApp
