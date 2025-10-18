import { useState } from "react"
import { Button } from "./Basic components/Button"
import type { Note } from "../Types";

interface TaskDescriptionProps {
    handleNotes: (note: Note) => void,
}

export const TaskDescription: React.FC<TaskDescriptionProps> = ({handleNotes}) => {

    const [notesText, setNotesText] = useState('');

    const addNotes = () => {
        if(notesText.length === 0) {
            alert("Enter something!");
            return;
        }

        const newNote = {
            description: notesText,
            id: new Date().getTime(),
            status: 'incomplete'
        }
        
        handleNotes(newNote);
        setNotesText('');

    }

    return (
        <div className="w-[30%] flex gap-2 mb-[20px]"> 
            <input 
                type="text" 
                className="flex-1 border-2 border-amber-600 rounded-[5px] px-[8px] py-[4px] text-gray-900 dark:text-white bg-white dark:bg-gray-900" 
                placeholder="Enter the task" 
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
            />
            <Button name="Add" handleClick={addNotes}/>
        </div>
    )
}