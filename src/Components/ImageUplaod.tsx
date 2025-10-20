import { Images } from "lucide-react"
import { useImageUplaod } from "../Hooks/useImageUplaod"

interface ImageUploadProps {
    editableDivRef: React.RefObject<HTMLDivElement | null>
}

export const ImageUpload:React.FC<ImageUploadProps> = ({editableDivRef}) => {

    const { handleImageUpload } = useImageUplaod(editableDivRef);
    const handleChange = (e: any) => {
        if(e.target.files && e.target.files.length > 0)
            handleImageUpload(e.target.files)
        }

    return (
        <div>
            <input 
                type="file"
                className="cursor-pointer hidden"
                id="file-upload"
                accept="image/*"
                onChange={handleChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer inline-flex  items-center justify-center py-2 px-4  rounded-[5px] dark:hover:bg-gray-700 hover:bg-gray-300">
                <Images className="text-gray-900 dark:text-white" size={20} />
            </label>
        </div>
    )
}