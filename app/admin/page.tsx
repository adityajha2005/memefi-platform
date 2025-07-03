"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid"
import { AdminContestPanel } from "@/components/admin/admin-contest-panel"
import { AdminNFTPanel } from "@/components/admin/admin-nft-panel"
import { AdminUserPanel } from "@/components/admin/admin-user-panel"
import { AdminSettingsPanel } from "@/components/admin/admin-settings-panel"
import { AdminRecentActivity } from "@/components/admin/admin-recent-activity"
import { useWalletContext } from "@/components/wallet/wallet-provider"
import { CustomButton } from "@/components/ui/custom-button"
import { AlertTriangle, Shield } from "lucide-react"
import { PLATFORM_SETTINGS } from "@/lib/contracts"

export default function AdminDashboard() {
  const { isConnected, account, connectWallet } = useWalletContext()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isConnected) {
      // Simulate loading admin data
      const timer = setTimeout(() => setIsLoading(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isConnected])

  // Access control - only allow deployer address
  if (!isConnected || !account || account.toLowerCase() !== PLATFORM_SETTINGS.deployerAddress.toLowerCase()) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="meme-card p-8">
              <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-yellow-400" />
              <h1 className="text-3xl font-black uppercase mb-4">ACCESS DENIED</h1>
              <p className="text-lg font-bold text-gray-300 mb-6">
                {!isConnected ? (
                  "CONNECT WALLET TO ACCESS ADMIN PANEL"
                ) : (
                  "ONLY THE CONTRACT DEPLOYER CAN ACCESS THIS PAGE"
                )}
              </p>
              {!isConnected && (
                <CustomButton 
                  variant="primary" 
                  className="text-lg px-8"
                  onClick={connectWallet}
                >
                  CONNECT WALLET
                </CustomButton>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              {/* <Shield className="h-12 w-12 text-yellow-400" /> */}
            </motion.div>
            <p className="text-xl font-black uppercase">LOADING ADMIN DASHBOARD...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl font-black uppercase">ADMIN DASHBOARD</h1>
          </div>
          <p className="text-lg font-bold text-gray-300">
            PLATFORM MANAGEMENT CONTROL CENTER
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <AdminStatsGrid />
        </motion.div>

        {/* Main Admin Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AdminContestPanel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AdminNFTPanel />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AdminUserPanel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AdminSettingsPanel />
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AdminRecentActivity />
        </motion.div>
      </div>
    </div>
  )
} 