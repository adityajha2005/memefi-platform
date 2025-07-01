import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface MemeDetailsFormProps {
  title: string
  description: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
}

export function MemeDetailsForm({ 
  title, 
  description, 
  onTitleChange, 
  onDescriptionChange 
}: MemeDetailsFormProps) {
  return (
    <>
      {/* Title Input */}
      <div className="space-y-4">
        <Label htmlFor="title" className="text-xl font-black uppercase tracking-wide">
          MEME TITLE
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
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
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="TELL US ABOUT YOUR MEME..."
          rows={4}
          className="text-lg font-bold border-4 border-black p-4"
        />
      </div>
    </>
  )
} 