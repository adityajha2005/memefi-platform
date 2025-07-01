import { NeonProgressBar } from "@/components/ui/neon-progress-bar"

interface UploadProgressProps {
  progress: number
  isUploading: boolean
}

export function UploadProgress({ progress, isUploading }: UploadProgressProps) {
  if (!isUploading) return null

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-lg font-black uppercase">
        <span>UPLOADING...</span>
        <span>{progress}%</span>
      </div>
      <div className="bg-black p-2 retro-border">
        <NeonProgressBar progress={progress} color="green" animated={true} />
      </div>
    </div>
  )
} 