"use client"

import { Button } from "@/components/ui/button"
import { Wallet, ExternalLink, AlertCircle, Loader2 } from "lucide-react"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import { useToast } from "@/components/ui/toast-notification"
import { useEffect } from "react"

export function WalletButton() {
  const {
    isConnected,
    account,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isMetaMaskInstalled,
  } = useWalletContext()

  const { showToast, ToastContainer } = useToast()

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      showToast(error, "error")
    }
  }, [error, showToast])

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      showToast(
        "MetaMask not detected. Please install MetaMask to connect your wallet.",
        "error"
      )
      // Open MetaMask installation page
      window.open("https://metamask.io/download/", "_blank")
      return
    }

    await connectWallet()
  }

  const handleDisconnect = () => {
    disconnectWallet()
    showToast("Wallet disconnected successfully!", "success")
  }

  if (isConnected && account) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleDisconnect}
            className="btn-warning flex items-center gap-2"
            title="Click to disconnect wallet"
          >
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">{formatAddress(account)}</span>
            <span className="sm:hidden">Connected</span>
          </Button>
        </div>
        <ToastContainer />
      </>
    )
  }

  return (
    <>
      <Button
        onClick={handleConnect}
        disabled={isLoading}
        className={`btn-primary flex items-center gap-2 ${isLoading ? "opacity-75" : ""}`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : !isMetaMaskInstalled ? (
          <ExternalLink className="h-4 w-4" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        <span>
          {isLoading
            ? "Connecting..."
            : !isMetaMaskInstalled
            ? "Install MetaMask"
            : "Connect Wallet"}
        </span>
      </Button>
      <ToastContainer />
    </>
  )
} 