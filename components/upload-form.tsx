"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, X, Zap } from "lucide-react"
import Image from "next/image"
import { NeonProgressBar } from "@/components/ui/neon-progress-bar"
import { useToast } from "@/components/ui/toast-notification"

export function UploadForm() {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const { showToast, ToastContainer } = useToast()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
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

  const removeFile = () => {
    setFile(null)
    setPreview(null)
  }

  return (
    <>
      <div className="meme-card p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Area */}
          <div className="space-y-4">
            <Label className="text-xl font-black uppercase tracking-wide">MEME IMAGE</Label>
            <div
              className={`upload-zone ${dragActive ? "active" : ""} p-12 text-center transition-all`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {preview ? (
                <div className="relative">
                  <Image
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    width={400}
                    height={300}
                    className="mx-auto max-h-64 object-contain border-4 border-black"
                  />
                  <Button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white border-2 border-black"
                    size="icon"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="mx-auto h-20 w-20 bg-black text-green-400 flex items-center justify-center retro-border">
                    <Upload className="h-10 w-10" />
                  </div>
                  <div>
                    <p className="text-2xl font-black uppercase tracking-wide">DROP YOUR MEME HERE</p>
                    <p className="text-lg font-bold text-gray-600 uppercase">OR CLICK TO BROWSE</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-4">
            <Label htmlFor="title" className="text-xl font-black uppercase tracking-wide">
              MEME TITLE
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="GIVE YOUR MEME A SICK TITLE..."
              required
              className="text-lg font-bold border-4 border-black p-4"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-4">
            <Label htmlFor="description" className="text-xl font-black uppercase tracking-wide">
              DESCRIPTION (OPTIONAL)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="TELL US ABOUT YOUR MEME..."
              rows={4}
              className="text-lg font-bold border-4 border-black p-4"
            />
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-4">
              <div className="flex justify-between text-lg font-black uppercase">
                <span>UPLOADING...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="bg-black p-2 retro-border">
                <NeonProgressBar progress={uploadProgress} color="green" animated={true} />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={!file || !title || uploading} className="btn-primary w-full text-2xl py-6">
            <Zap className="mr-3 h-6 w-6" />
            {uploading ? "UPLOADING..." : "SUBMIT MEME"}
          </Button>
        </form>
      </div>
      <ToastContainer />
    </>
  )
}
