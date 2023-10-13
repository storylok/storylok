import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import Link from "next/link"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ConnectWallet } from "./ConnectWallet";
import { useAccount } from "@particle-network/connect-react-ui";
const WalletSolButton = dynamic(async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton, { ssr: false })
const Header = () => {
  const {publicKey: account} = useWallet()
  const [loggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {

    const isNotLoggedIn = account == null
    setIsLoggedIn(!isNotLoggedIn)

    if (loggedIn && isNotLoggedIn) {
      window.location.reload()
    }
  }, [account])

  return <div className="navbar flex flex-1 justify-center p-4 xs:z-5 md:z-50 bg-white w-full fixed top-0">
    <div className="flex-1">
      <div className="w-full">
        <Link href={"/"}><h1 className="text-3xl">storylok.xyz</h1></Link>
        <p className="pt-2 text-sm">Lok is a Sanskrit term meaning "a universe" </p>
      </div>
    </div>
    <div className="flex-none">
      {/* <ConnectWallet /> */}
      <WalletSolButton />
    </div>
  </div>
}

export default Header
