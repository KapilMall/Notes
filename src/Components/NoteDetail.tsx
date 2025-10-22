import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../Hooks/reduxHooks";
import { editNote } from "../Slices/notesSlice";

interface noteType {
    id: number;
    content: string;
    createdAt: string;
}

interface NoteDetailProps {
    editableDivRef: React.RefObject<HTMLDivElement | null>
}

export const NoteDetail:React.FC<NoteDetailProps>  = ({ editableDivRef }) => {
    const [currentNote, setCurrentNote] = useState<noteType | null>(null);
   

    const notes = useAppSelector((state) => state.notes);
    const dispatch = useAppDispatch();

    const selectedNote = notes.notes.find(note => note.id === notes.selectedNoteId);
    
    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const newContent = e.currentTarget.innerHTML || '';

        if(selectedNote) {
            dispatch(editNote({id: selectedNote.id, content: newContent}))
        }
    }

    // Only sync when switching notes (id changes), NOT when content changes
    useEffect(() => {
        if (editableDivRef.current && selectedNote) {
            editableDivRef.current.innerHTML = selectedNote.content || '';
        }
    }, [selectedNote?.id]);

    return (
        <>
        <div
            ref = {editableDivRef}
            contentEditable
            onInput={handleInput}
            className="editable-div bg-red w-full flex-1 text-gray-900 dark:text-white outline-0 px-[10px] py-[15px]"
        />
        <style>{
        `
            .editable-div::first-line {
                font-size: 1.8em;
                font-weight: bold;
            }
        `    
        }
        </style>
        </>
    )
}