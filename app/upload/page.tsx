import { UploadForm } from "@/components/upload-form"

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-black mb-4 uppercase tracking-tight">📤 UPLOAD YOUR MEME</h1>
          <p className="text-xl font-bold text-gray-700 uppercase tracking-wide">
            SHARE YOUR CREATIVITY AND COMPETE FOR BNB REWARDS
          </p>
        </div>
        <UploadForm />
      </div>
    </div>
  )
}
