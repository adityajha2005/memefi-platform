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
          
          {/* Submission Status */}
          {/* <div className="mt-6 p-4 bg-blue-100 border-4 border-blue-400">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-lg font-black text-blue-800 uppercase">SUBMISSION STATUS</span>
            </div>
            <p className="text-sm font-bold text-blue-700">
              ✅ You have not submitted a meme for this contest yet.
            </p>
            <p className="text-xs font-bold text-blue-600 mt-1">
              Remember: Only 1 meme per user per contest!
            </p>
          </div> */}
        </div>
        <UploadForm />
      </div>
    </div>
  )
}
