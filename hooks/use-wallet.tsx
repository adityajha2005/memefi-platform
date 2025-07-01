"use client"

import { useState, useEffect, useCallback } from "react"

interface WalletState {
  isConnected: boolean
  account: string | null
  isLoading: boolean
  error: string | null
}

declare global {
  interface Window {
    ethereum?: any
  }
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    account: null,
    isLoading: false,
    error: null,
  })

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  }, [])

  // Format wallet address for display
  const formatAddress = useCallback((address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [])

  // Connect to MetaMask
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setWalletState(prev => ({
        ...prev,
        error: "MetaMask is not installed. Please install MetaMask to continue."
      }))
      return
    }

    setWalletState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setWalletState({
          isConnected: true,
          account: accounts[0],
          isLoading: false,
          error: null,
        })

        // Store connection state in localStorage
        localStorage.setItem("walletConnected", "true")
        localStorage.setItem("walletAccount", accounts[0])
      }
    } catch (error: any) {
      let errorMessage = "Failed to connect wallet"
      
      if (error.code === 4001) {
        errorMessage = "Connection rejected by user"
      } else if (error.code === -32002) {
        errorMessage = "Connection request already pending"
      }

      setWalletState({
        isConnected: false,
        account: null,
        isLoading: false,
        error: errorMessage,
      })
    }
  }, [isMetaMaskInstalled])

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      account: null,
      isLoading: false,
      error: null,
    })

    // Clear localStorage
    localStorage.removeItem("walletConnected")
    localStorage.removeItem("walletAccount")
  }, [])

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return

      try {
        // Check if previously connected
        const wasConnected = localStorage.getItem("walletConnected")
        const savedAccount = localStorage.getItem("walletAccount")

        if (wasConnected && savedAccount) {
          // Verify the account is still connected
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          })

          if (accounts.length > 0 && accounts[0] === savedAccount) {
            setWalletState({
              isConnected: true,
              account: accounts[0],
              isLoading: false,
              error: null,
            })
          } else {
            // Clear invalid connection data
            localStorage.removeItem("walletConnected")
            localStorage.removeItem("walletAccount")
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }

    checkConnection()
  }, [isMetaMaskInstalled])

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        disconnectWallet()
      } else if (accounts[0] !== walletState.account) {
        // Account changed
        setWalletState(prev => ({
          ...prev,
          account: accounts[0],
          isConnected: true,
        }))
        localStorage.setItem("walletAccount", accounts[0])
      }
    }

    const handleChainChanged = () => {
      // Reload the page when chain changes (recommended by MetaMask)
      window.location.reload()
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum.removeListener("chainChanged", handleChainChanged)
    }
  }, [isMetaMaskInstalled, walletState.account, disconnectWallet])

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  }
} 