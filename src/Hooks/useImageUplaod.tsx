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

export const useImageUplaod = () => {

    const [images, setImages] = useState<ImageType[]>([]);
    const dispatch = useAppDispatch();
    const { selectedNoteId, notes } = useAppSelector((state) => state.notes);
    const selectedNote = notes.find((note) => note.id === selectedNoteId)

    console.log('images: ', images);

    const handleImageUpload = (files: FileList)=> {
        if(!files || !selectedNote) return;

        const fileArray = Array.from(files);

        console.log('filearray: ', fileArray);

        fileArray.map((file: File) => {
            const reader = new FileReader();
            console.log('reader: ', reader);
            reader.onloadend = () => {
                const newImage: ImageType = {
                    id: Date.now() + Math.random(),
                    file,
                    preview: reader.result as string,
                    name: file.name,
                    size: (file.size / 1024).toFixed(2)
                };
                // Update local state
                setImages((prev) => [...prev, newImage]);

                // Update Redux immediately with the new image
                const imageMarkdown = `![${newImage.name}](${newImage.preview})`; //This creates a Markdown image syntax string. 
                const newContent = selectedNote?.content + imageMarkdown;

                dispatch(editNote({ id: selectedNoteId, content: newContent }))
            }
            reader.readAsDataURL(file);
        })
    }

    return { handleImageUpload, images }
}


// Markdown image syntax: 

{ /* 
    
    ![alt text](image URL)

    In the Code:
    const imageMarkdown = `![${newImage.name}](${newImage.preview})`;

    This creates a string like:
    ![photo.jpg](data:image/jpeg;base64,/9j/4AAQSkZJRg...)

    What Each Part Means:
    ! - Tells Markdown this is an image (not a link)
    [${newImage.name}] - Alt text (shown if image fails to load, also for accessibility)
    Example: [photo.jpg]

    (${newImage.preview}) - Image source URL (the base64 data)

    Example: (data:image/jpeg;base64,/9j/4AAQ...)

    When rendered by a Markdown parser, it displays the image. For example:

    Here's my photo: ![vacation.jpg](data:image/jpeg;base64,/9j/...)

    Output (HTML):
    Here's my photo: <img src="data:image/jpeg;base64,/9j/..." alt="vacation.jpg">

    Why Use This?
    Since you're storing notes (likely in Markdown format), this allows you to:

    1. Embed images directly in your note content
    2. Display them when the Markdown is rendered
    3. Keep everything as text in your Redux store
*/}