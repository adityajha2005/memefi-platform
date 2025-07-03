"use client"

import { useState } from "react"
import { useMemeStaking } from "@/hooks/use-meme-staking"
import { Button } from "@/components/ui/button"

export function DebugMemeInfo() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { getNextMemeId, getMeme } = useMemeStaking()

  const runDebug = async () => {
    setIsLoading(true)
    const info: any = {}
    
    try {
      // Test 0: Check basic environment
      console.log("Testing environment setup...")
      info.environment = {
        hasWindow: typeof window !== "undefined",
        hasEthereum: typeof window !== "undefined" && !!window.ethereum,
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "SSR"
      }
      
      if (!info.environment.hasEthereum) {
        throw new Error("MetaMask not found! Please install MetaMask browser extension.")
      }

      // Test 1: Check provider connection
      console.log("Testing provider connection...")
      const { ethers } = await import("ethers")
      const provider = new ethers.BrowserProvider(window.ethereum)
      
      // Test network
      const network = await provider.getNetwork()
      info.network = {
        chainId: Number(network.chainId),
        name: network.name,
        expectedChainId: 97,
        isCorrectNetwork: Number(network.chainId) === 97
      }
      
      console.log("Network info:", info.network)
      
      if (!info.network.isCorrectNetwork) {
        info.networkError = `Wrong network! Connected to chain ${info.network.chainId}, but need BNB Testnet (97)`
      }

      // Test 2: Contract initialization
      console.log("Testing contract initialization...")
      const contractAddress = "0x79593ac71642f42bdbde4eb5d1e8260c0019e4f7"
      
      // Import ABI
      const { default: MemeStakingABI } = await import("../abi/MemeStaking.json")
      
      const contract = new ethers.Contract(
        contractAddress,
        MemeStakingABI,
        provider
      )
      
      info.contract = {
        address: contractAddress,
        hasABI: !!MemeStakingABI && Array.isArray(MemeStakingABI),
        abiLength: MemeStakingABI ? MemeStakingABI.length : 0
      }
      
      console.log("Contract info:", info.contract)

      // Test 3: Simple contract call
      console.log("Testing simple contract calls...")
      try {
        // Test if contract exists by checking code
        const code = await provider.getCode(contractAddress)
        info.contractExists = code !== "0x"
        
        if (!info.contractExists) {
          throw new Error("Contract not deployed at this address!")
        }
        
        console.log("Contract exists with code length:", code.length)
      } catch (codeError: any) {
        info.contractCodeError = codeError.message
        console.error("Contract code check failed:", codeError)
      }

      // Test 4: Try nextMemeId call
      if (info.contractExists) {
        console.log("Testing getNextMemeId...")
        try {
          const nextId = await contract.nextMemeId()
          info.nextMemeId = Number(nextId)
          info.totalMemes = Math.max(0, Number(nextId) - 1)
          console.log("Next meme ID:", Number(nextId))
        } catch (nextIdError: any) {
          info.nextMemeIdError = nextIdError.message
          console.error("getNextMemeId failed:", nextIdError)
        }
      }

      // Test 5: Try getCurrentContestId
      if (info.contractExists) {
        console.log("Testing getCurrentContestId...")
        try {
          const contestId = await contract.currentContestId()
          info.currentContestId = Number(contestId)
          console.log("Current contest ID:", Number(contestId))
        } catch (contestError: any) {
          info.contestIdError = contestError.message
          console.error("getCurrentContestId failed:", contestError)
        }
      }

      // Test 6: If memes exist, try to fetch one
      if (info.nextMemeId && info.nextMemeId > 1) {
        console.log("Testing getMeme(1)...")
        try {
          const meme1 = await contract.getMeme(1)
          info.meme1 = {
            id: Number(meme1.id),
            creator: meme1.creator,
            ipfsHash: meme1.ipfsHash,
            totalStaked: meme1.totalStaked.toString(),
            timestamp: Number(meme1.timestamp),
            exists: meme1.exists
          }
          console.log("Meme #1:", info.meme1)

          if (info.meme1.ipfsHash) {
            info.meme1ImageUrl = `https://gateway.pinata.cloud/ipfs/${info.meme1.ipfsHash}`
            
            // Test image accessibility
            try {
              console.log("Testing image URL:", info.meme1ImageUrl)
              const imageResponse = await fetch(info.meme1ImageUrl, { method: 'HEAD' })
              info.imageAccessible = imageResponse.ok
              info.imageStatus = imageResponse.status
              console.log("Image accessible:", imageResponse.ok, "Status:", imageResponse.status)
            } catch (imgError: any) {
              info.imageAccessible = false
              info.imageError = imgError.message
              console.error("Image fetch error:", imgError)
            }
          }
        } catch (memeError: any) {
          info.meme1Error = memeError.message
          console.error("getMeme(1) failed:", memeError)
        }
      }

    } catch (error: any) {
      console.error("Debug test failed:", error)
      info.error = error.message
    }

    setDebugInfo(info)
    setIsLoading(false)
  }

  return (
    <div className="bg-gray-100 p-6 border-4 border-gray-300 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black uppercase">🔍 Debug Meme Info</h3>
        <Button 
          onClick={runDebug} 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Testing..." : "Run Debug Test"}
        </Button>
      </div>

      {debugInfo && (
        <div className="space-y-4">
          {/* Environment Check */}
          {debugInfo.environment && (
            <div className="bg-white p-4 border-2 border-gray-300 rounded">
              <h4 className="font-bold mb-2">🌐 Environment:</h4>
              <ul className="text-sm space-y-1">
                <li><strong>Browser Window:</strong> {debugInfo.environment.hasWindow ? "✅" : "❌"}</li>
                <li><strong>MetaMask Detected:</strong> {debugInfo.environment.hasEthereum ? "✅" : "❌"}</li>
                <li><strong>User Agent:</strong> {debugInfo.environment.userAgent.includes('Chrome') ? '🟢 Chrome' : debugInfo.environment.userAgent.includes('Firefox') ? '🟠 Firefox' : '🔴 Other'}</li>
              </ul>
            </div>
          )}

          {/* Network Check */}
          {debugInfo.network && (
            <div className={`p-4 border-2 rounded ${debugInfo.network.isCorrectNetwork ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
              <h4 className="font-bold mb-2">🌍 Network Status:</h4>
              <ul className="text-sm space-y-1">
                <li><strong>Connected Chain ID:</strong> {debugInfo.network.chainId}</li>
                <li><strong>Network Name:</strong> {debugInfo.network.name}</li>
                <li><strong>Expected Chain:</strong> 97 (BNB Testnet)</li>
                <li><strong>Correct Network:</strong> {debugInfo.network.isCorrectNetwork ? "✅ Yes" : "❌ No"}</li>
              </ul>
              {debugInfo.networkError && (
                <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
                  <p className="text-sm text-red-700 font-bold">{debugInfo.networkError}</p>
                  <p className="text-xs text-red-600 mt-1">Please switch to BNB Testnet in MetaMask</p>
                </div>
              )}
            </div>
          )}

          {/* Contract Check */}
          {debugInfo.contract && (
            <div className="bg-white p-4 border-2 border-gray-300 rounded">
              <h4 className="font-bold mb-2">📝 Contract Setup:</h4>
              <ul className="text-sm space-y-1">
                <li><strong>Address:</strong> {debugInfo.contract.address}</li>
                <li><strong>ABI Loaded:</strong> {debugInfo.contract.hasABI ? "✅" : "❌"}</li>
                <li><strong>ABI Functions:</strong> {debugInfo.contract.abiLength}</li>
                <li><strong>Contract Exists:</strong> {debugInfo.contractExists ? "✅ Yes" : "❌ No"}</li>
              </ul>
              {debugInfo.contractCodeError && (
                <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded">
                  <p className="text-sm text-red-700 font-bold">Contract Error: {debugInfo.contractCodeError}</p>
                </div>
              )}
            </div>
          )}

          {/* Contract Calls */}
          <div className="bg-white p-4 border-2 border-gray-300 rounded">
            <h4 className="font-bold mb-2">📊 Contract Data:</h4>
            <ul className="text-sm space-y-1">
              <li><strong>Next Meme ID:</strong> 
                {debugInfo.nextMemeIdError ? (
                  <span className="text-red-600">❌ Error: {debugInfo.nextMemeIdError}</span>
                ) : (
                  <span className="text-green-600">✅ {debugInfo.nextMemeId || "Not loaded"}</span>
                )}
              </li>
              <li><strong>Total Memes:</strong> {debugInfo.totalMemes || 0}</li>
              <li><strong>Current Contest ID:</strong> 
                {debugInfo.contestIdError ? (
                  <span className="text-red-600">❌ Error: {debugInfo.contestIdError}</span>
                ) : (
                  <span className="text-green-600">✅ {debugInfo.currentContestId ?? "Not loaded"}</span>
                )}
              </li>
            </ul>
          </div>

          {/* Meme Data */}
          {debugInfo.meme1 && (
            <div className="bg-white p-4 border-2 border-gray-300 rounded">
              <h4 className="font-bold mb-2">🎭 Meme #1 Data:</h4>
              <ul className="text-sm space-y-1">
                <li><strong>Creator:</strong> {debugInfo.meme1.creator}</li>
                <li><strong>IPFS Hash:</strong> {debugInfo.meme1.ipfsHash}</li>
                <li><strong>Total Staked:</strong> {(Number(debugInfo.meme1.totalStaked) / 1e18).toFixed(4)} BNB</li>
                <li><strong>Timestamp:</strong> {new Date(debugInfo.meme1.timestamp * 1000).toLocaleString()}</li>
                <li><strong>Exists:</strong> {debugInfo.meme1.exists ? "✅" : "❌"}</li>
              </ul>
            </div>
          )}

          {debugInfo.meme1Error && (
            <div className="bg-red-100 p-4 border-2 border-red-400 rounded">
              <h4 className="font-bold mb-2">❌ Meme Fetch Error:</h4>
              <p className="text-sm text-red-700">{debugInfo.meme1Error}</p>
            </div>
          )}

          {/* Image Test */}
          {debugInfo.meme1ImageUrl && (
            <div className="bg-white p-4 border-2 border-gray-300 rounded">
              <h4 className="font-bold mb-2">🖼️ Image Accessibility:</h4>
              <ul className="text-sm space-y-1">
                <li><strong>Image URL:</strong> <a href={debugInfo.meme1ImageUrl} target="_blank" className="text-blue-600 underline break-all">{debugInfo.meme1ImageUrl}</a></li>
                <li><strong>Accessible:</strong> {debugInfo.imageAccessible ? "✅ Yes" : "❌ No"}</li>
                <li><strong>Status:</strong> {debugInfo.imageStatus || "Unknown"}</li>
                {debugInfo.imageError && <li><strong>Error:</strong> {debugInfo.imageError}</li>}
              </ul>
              
              {debugInfo.imageAccessible && (
                <div className="mt-4">
                  <p className="text-sm font-bold mb-2">🎨 Image Preview:</p>
                  <img 
                    src={debugInfo.meme1ImageUrl} 
                    alt="Meme #1" 
                    className="max-w-xs max-h-48 border-2 border-gray-300"
                    onError={(e) => {
                      console.error("Image failed to load")
                      e.currentTarget.style.display = 'none'
                    }}
                    onLoad={(e) => {
                      console.log("Image loaded successfully")
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Overall Error */}
          {debugInfo.error && (
            <div className="bg-red-100 p-4 border-2 border-red-400 rounded">
              <h4 className="font-bold mb-2">❌ Main Error:</h4>
              <p className="text-sm text-red-700">{debugInfo.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 