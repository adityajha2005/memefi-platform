"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Zap, AlertTriangle } from "lucide-react"
import { FileUploadZone } from "@/components/upload/file-upload-zone"
import { UploadProgress } from "@/components/upload/upload-progress"
import { MemeDetailsForm } from "@/components/upload/meme-details-form"
import { useToast } from "@/components/ui/toast-notification"
import { useMemeStaking } from "@/hooks/use-meme-staking"
import { useWalletContext } from "@/components/wallet/wallet-provider"

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tweetId, setTweetId] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [ipfsHash, setIpfsHash] = useState("")

  const { showToast } = useToast()
  const { submitMeme, hasUserSubmittedInCurrentContest, isLoading, error } = useMemeStaking()
  const { account, isConnected, connectWallet } = useWalletContext()

  const handleFileSelect = (file: File) => {
    setFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileRemove = () => {
    setFile(null)
    setPreview(null)
  }

  const uploadToIPFS = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      // Simulate upload progress for first part
      for (let i = 0; i <= 30; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // Upload to Pinata IPFS service
      const response = await fetch('/api/upload-ipfs', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`IPFS upload failed: ${errorData}`)
      }
      
      const result = await response.json()
      
      if (!result.ipfsHash) {
        throw new Error('No IPFS hash returned from upload service')
      }
      
      // Verify the upload worked by testing the gateway URL
      const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`
      const testResponse = await fetch(gatewayUrl, { method: 'HEAD' })
      
      if (!testResponse.ok) {
        console.warn('IPFS gateway test failed, but hash was returned')
      }
      
      return result.ipfsHash
      
    } catch (error) {
      console.error('IPFS upload failed:', error)
      
      // Fallback: try direct Pinata upload if API route fails
      try {
        console.log('Attempting direct Pinata upload...')
        
        const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT || ''}`,
          },
          body: formData,
        })
        
        if (pinataResponse.ok) {
          const pinataResult = await pinataResponse.json()
          return pinataResult.IpfsHash
        }
      } catch (fallbackError) {
        console.error('Fallback Pinata upload also failed:', fallbackError)
      }
      
      // If both methods fail, throw the original error
      throw new Error('Failed to upload image to IPFS. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      showToast("Please connect your wallet to submit a meme!", "error")
      await connectWallet()
      return
    }

    if (!file || !title || !tweetId) {
      showToast("Please fill in all required fields!", "error")
      return
    }

    // Check if user has already submitted in current contest
    if (account) {
      try {
        const hasSubmitted = await hasUserSubmittedInCurrentContest(account)
        if (hasSubmitted) {
          showToast("You have already submitted a meme for this contest!", "error")
          return
        }
      } catch (err) {
        console.error("Failed to check submission status:", err)
      }
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Step 1: Upload to IPFS
      showToast("Uploading image to IPFS...", "info")
      let hash: string
      
      try {
        hash = await uploadToIPFS(file)
        setIpfsHash(hash)
      } catch (ipfsError) {
        console.error("IPFS upload failed:", ipfsError)
        
        // Fallback: Generate a demo hash for development/testing
        const confirmed = window.confirm(
          "IPFS upload failed. This might be because Pinata isn't configured.\n\n" +
          "Do you want to submit with a demo hash for testing? " +
          "(The image won't be visible, but the meme will be recorded on-chain)"
        )
        
        if (!confirmed) {
          throw ipfsError
        }
        
        // Use demo hash as fallback
        hash = `QmDemo${Date.now()}${Math.random().toString(36).substr(2, 9)}`
        setIpfsHash(hash)
        showToast("Using demo IPFS hash for testing", "warning")
      }
      
      setUploadProgress(70)

      // Step 2: Submit to blockchain
      showToast("Submitting meme to blockchain...", "info")
      const memeId = await submitMeme(hash, tweetId)
      setUploadProgress(100)

      showToast(`MEME SUBMITTED SUCCESSFULLY! 🔥 Meme ID: ${memeId}`, "success")
      
      // Reset form
      setFile(null)
      setPreview(null)
      setTitle("")
      setDescription("")
      setTweetId("")
      setIpfsHash("")
      setUploadProgress(0)
      
    } catch (err: any) {
      console.error("Submission failed:", err)
      showToast(err.message || "Failed to submit meme. Please try again.", "error")
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="meme-card p-8">
        {/* Submission Status */}
        {account && (
          <div className="mb-6 p-4 bg-blue-100 border-4 border-blue-400">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-lg font-black text-blue-800 uppercase">SUBMISSION STATUS</span>
            </div>
            <p className="text-sm font-bold text-blue-700 text-center">
              ✅ Connected as: {account.slice(0, 6)}...{account.slice(-4)}
            </p>
            <p className="text-xs font-bold text-blue-600 mt-1 text-center">
              Remember: Only 1 meme per user per contest!
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-4 border-red-400">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-lg font-black text-red-800 uppercase">Error</span>
            </div>
            <p className="text-sm font-bold text-red-700">{error}</p>
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Area */}
          <div className="space-y-4">
            <label className="text-xl font-black uppercase tracking-wide">MEME IMAGE *</label>
            <FileUploadZone 
              file={file}
              preview={preview}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
            />
          </div>

          {/* Meme Details Form */}
          <MemeDetailsForm 
            title={title}
            description={description}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
          />

          {/* Twitter ID Field */}
          <div className="space-y-4">
            <label htmlFor="tweetId" className="text-xl font-black uppercase tracking-wide">
              TWITTER/X POST ID *
            </label>
            <input
              id="tweetId"
              type="text"
              value={tweetId}
              onChange={(e) => setTweetId(e.target.value)}
              placeholder="e.g., 1234567890123456789"
              className="w-full p-4 border-4 border-black font-bold text-lg focus:outline-none focus:ring-0"
              required
              disabled={uploading}
            />
            <div className="bg-gray-100 p-3 border-2 border-gray-300">
              <p className="text-sm font-bold text-gray-700 mb-2">💡 HOW TO GET TWITTER POST ID:</p>
              <p className="text-xs font-bold text-gray-600">
                1. Share your meme on Twitter/X first<br/>
                2. Copy the tweet URL: https://twitter.com/username/status/<strong>1234567890123456789</strong><br/>
                3. Paste just the number part (after "status/") above
              </p>
            </div>
          </div>

          {/* IPFS Hash Display */}
          {ipfsHash && (
            <div className="p-4 bg-green-100 border-4 border-green-400">
              <p className="text-sm font-black text-green-800 uppercase mb-1">IPFS Hash Generated:</p>
              <p className="text-xs font-mono text-green-700 break-all">{ipfsHash}</p>
            </div>
          )}

          {/* Upload Progress */}
          <UploadProgress progress={uploadProgress} isUploading={uploading} />

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={!file || !title || !tweetId || uploading || isLoading || !isConnected} 
            className="btn-primary w-full text-2xl py-6"
          >
            <Zap className="mr-3 h-6 w-6" />
            {uploading ? "SUBMITTING..." : isLoading ? "PROCESSING..." : "SUBMIT MEME"}
          </Button>

          {/* Submission Rules */}
          <div className="bg-yellow-100 p-4 border-4 border-yellow-400">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-lg font-black text-yellow-800 uppercase">Important Rules</span>
            </div>
            <ul className="text-sm font-bold text-yellow-700 space-y-1">
              <li>• Only 1 meme submission per contest per wallet</li>
              <li>• Your meme must be posted on Twitter/X first</li>
              <li>• Image will be permanently stored on IPFS</li>
              <li>• Submission requires a small gas fee</li>
            </ul>
          </div>
        </form>
      </div>
    </>
  )
}
