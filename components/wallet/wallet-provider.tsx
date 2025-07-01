"use client"

import React, { createContext, useContext, ReactNode } from "react"
import { useWallet } from "@/hooks/use-wallet"

export interface WalletContextType {
  isConnected: boolean
  account: string | null
  isLoading: boolean
  error: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  formatAddress: (address: string) => string
  isMetaMaskInstalled: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const walletState = useWallet()

  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWalletContext() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider")
  }
  return context
} 