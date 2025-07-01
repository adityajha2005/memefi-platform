"use client"

import React, { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface FileUploadZoneProps {
  file: File | null
  preview: string | null
  onFileSelect: (file: File) => void
  onFileRemove: () => void
}

export function FileUploadZone({ file, preview, onFileSelect, onFileRemove }: FileUploadZoneProps) {
  const [dragActive, setDragActive] = React.useState(false)

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
      onFileSelect(file)
    }
  }

  return (
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
            onClick={onFileRemove}
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
  )
} 