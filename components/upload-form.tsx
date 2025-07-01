"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { FileUploadZone } from "@/components/upload/file-upload-zone"
import { UploadProgress } from "@/components/upload/upload-progress"
import { MemeDetailsForm } from "@/components/upload/meme-details-form"
import { useToast } from "@/components/ui/toast-notification"

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const { showToast } = useToast()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title) return

    setUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          showToast("MEME UPLOADED SUCCESSFULLY! 🔥", "success")
          // Reset form
          setFile(null)
          setPreview(null)
          setTitle("")
          setDescription("")
          return 100
        }
        return prev + 10
      })
    }, 200)
  }



  return (
    <>
      <div className="meme-card p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Area */}
          <div className="space-y-4">
            <label className="text-xl font-black uppercase tracking-wide">MEME IMAGE</label>
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

          {/* Upload Progress */}
          <UploadProgress progress={uploadProgress} isUploading={uploading} />

          {/* Submit Button */}
          <Button type="submit" disabled={!file || !title || uploading} className="btn-primary w-full text-2xl py-6">
            <Zap className="mr-3 h-6 w-6" />
            {uploading ? "UPLOADING..." : "SUBMIT MEME"}
          </Button>
        </form>
      </div>
      {/* <ToastContainer /> */}
    </>
  )
}
