"use client"

import { motion, AnimatePresence } from "framer-motion"
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

  const { showToast } = useToast()

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
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleDisconnect}
              className="btn-warning flex items-center gap-2"
              title="Click to disconnect wallet"
            >
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Wallet className="h-4 w-4" />
              </motion.div>
              <span className="hidden sm:inline">{formatAddress(account)}</span>
              <span className="sm:hidden">Connected</span>
            </Button>
          </motion.div>
        </motion.div>
      </>
    )
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          onClick={handleConnect}
          disabled={isLoading}
          className={`btn-primary flex items-center gap-2 ${isLoading ? "opacity-75" : ""}`}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Loader2 className="h-4 w-4 animate-spin" />
              </motion.div>
            ) : !isMetaMaskInstalled ? (
              <motion.div
                key="install"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ExternalLink className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div
                key="wallet"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Wallet className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.span
            key={isLoading ? "connecting" : !isMetaMaskInstalled ? "install" : "connect"}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading
              ? "Connecting..."
              : !isMetaMaskInstalled
              ? "Install MetaMask"
              : "Connect Wallet"}
          </motion.span>
        </Button>
      </motion.div>
    </>
  )
} 