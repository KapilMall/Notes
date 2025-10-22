import { useState } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { editNote } from "../Slices/notesSlice";

interface ImageType {
    id: number,
    file: File,
    preview: string,
    name: string,
    size: string,

}

export const useImageUplaod = (editorRef: React.RefObject<HTMLDivElement | null>) => {
    const [images, setImages] = useState<ImageType[]>([]);
    const dispatch = useAppDispatch();
    const { selectedNoteId, notes } = useAppSelector((state) => state.notes);
    const selectedNote = notes.find((note) => note.id === selectedNoteId)

    const handleImageUpload = (files: FileList)=> {
        if(!files || !selectedNote) return;

        const fileArray = Array.from(files);

        console.log('filearray: ', fileArray);

        fileArray.map((file: File) => {
            const reader = new FileReader();
            reader.onloadend = (event) => {
                //create image element

                const img = document.createElement('img');
                img.src = event.target?.result as string;
                img.style.maxWidth = "500px";
                img.style.height = "300px"
                img.style.display = "inline";
                img.style.margin = "10px 0";

                // Insert image into the editor
                if(editorRef.current) {
                    editorRef.current.appendChild(img);
                    editorRef.current.appendChild(document.createElement("br"));
                    
                    const newContent = editorRef.current.innerHTML;
                    dispatch(editNote({ id: selectedNoteId, content: newContent }))
                }
                // Update local images state
                const newImage: ImageType = {
                    id: Date.now() + Math.random(),
                    file,
                    preview: event.target?.result as string,
                    name: file.name,
                    size: (file.size / 1024).toFixed(2)
                };
                setImages((prev) => [...prev, newImage]);

            }
            reader.readAsDataURL(file);
        })
    }

    return { handleImageUpload, images }
}
