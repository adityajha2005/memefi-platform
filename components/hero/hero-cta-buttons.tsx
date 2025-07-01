import { CustomButton } from "@/components/ui/custom-button"
import { Upload } from "lucide-react"
import Link from "next/link"

export function HeroCTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center">
      <Link href="/upload">
        <CustomButton variant="primary" className="text-xl px-8 py-4">
          <Upload className="mr-3 h-6 w-6" />
          UPLOAD MEME
        </CustomButton>
      </Link>
      <Link href="/explore">
        <CustomButton variant="secondary" className="text-xl px-8 py-4">
          EXPLORE MEMES
        </CustomButton>
      </Link>
    </div>
  )
} 