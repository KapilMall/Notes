import { useState } from "react";
import type { Note } from "../Types";
import { Button } from "./Basic components/Button"
import { Check, Circle, CircleCheck, SquarePen, Trash2, X } from "lucide-react";

interface ListTasksProps {
    notes: Note[],
    handleDelete: (id: number) => void;
    handelEditNote: (id: number, editedNote?: string, editingStatus?: boolean) => void;
}

export const ListTasks: React.FC<ListTasksProps> = ({notes, handleDelete, handelEditNote}) => {

    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState('');

    const deleteNote = (id: number) => {
        return handleDelete(id);
    }

    const startEdit = (task: Note) => {
        setEditingNoteId(task.id);
        setEditingText(task.description)
    }

    const SaveNotes = (id: number) => {
        handelEditNote(id, editingText);
        setEditingNoteId(null);
        setEditingText('');
    }

    const cancelEdit = () => {
        setEditingNoteId(null);
        setEditingText('');
    }

    const handleStatusChange = (task: Note) => {
        const newStatus = task.status !== 'complete';
        handelEditNote(task.id, undefined, newStatus)
    }

    return (
        <div className="min-w-[50%]">
            {notes.map((task) => (
                <div key={task.id}>   
                    {editingNoteId === task.id ? 
                        <div className="flex gap-[10px] my-[10px] border-2 border-amber-500 rounded-[5px] items-center justify-between px-[8px] py-[4px]">
                            <input type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)}  className="flex-1 px-[8px]"/>
                            <Button Icon={<Check size={20} />} handleClick={() => SaveNotes(task.id)}/>
                            <Button Icon={<X size={20} />} handleClick={cancelEdit}/>
                        </div>
                        :
                        <div className="flex gap-[10px] my-[10px] border-2 border-amber-500 rounded-[5px] items-center justify-center px-[8px] py-[4px]">
                             <li className="list-none flex-1">{task.description}</li>
                            <Button Icon={ task.status === 'complete' ? <CircleCheck size={20} /> : <Circle size={20} /> } handleClick={() => handleStatusChange(task)}/>
                            <Button Icon={<SquarePen size={20}/>} handleClick={() => startEdit(task)}/>
                            <Button Icon={<Trash2 size={20} />} handleClick={() => deleteNote(task.id)}/>
                        </div> 
                    }
                </div>
            ))}
        </div>
    )
}