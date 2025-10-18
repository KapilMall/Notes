import { useAppDispatch, useAppSelector } from "../Hooks/reduxHooks";
import { onSelectNoteId } from "../Slices/notesSlice";
import type { Note } from "../Types"
import { getCurrentTime } from "../Utility/util"

interface NotesListProps {
    // notes: Notes,
    selectedNoteId?: number | null,
    getHeading: (content: string) => string;
    getDescription: (content: string) => string;
    setSelectedNoteId?: (id: number) => void;
}

export const NotesList: React.FC<NotesListProps> = ({ getHeading, getDescription}) => {

    const dispatch = useAppDispatch();
    const { notes, selectedNoteId } = useAppSelector((state) => state.notes)
    
    return (
        <div className="w-[25%] overflow-y-auto px-[15px] py-[5px]">
            {
                notes.length === 0 ? 
                <div className="flex items-center justify-center h-[100%]">
                    <h1 className="text-gray-900 dark:text-white">No notes yet!</h1>
                </div>
                :
                <div className="flex flex-col py-[10px] gap-[20px]">
                    {notes.map((note: Note) => {
                        return (
                            <div 
                                className={`
                                    flex flex-col gap-[10px] px-[16px] py-[10px] rounded-[10px] flex-nowrap
                                    ${selectedNoteId === note.id ? "bg-gray-400 dark:bg-amber-600/75" : "bg-gray-200 dark:bg-gray-700"}    
                                `} 
                                key={note.id}
                                onClick={() => dispatch(onSelectNoteId(note.id))}
                            >
                                <h1 className="text-gray-900 dark:text-white font-bold">{getHeading(note.content)}</h1>
                                <div className="flex items-center justify-between overflow-hidden gap-[20px]">
                                    <p className="text-gray-900 dark:text-white min-w-fit">
                                        {getCurrentTime()}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300 text-[14px] text-nowrap">
                                        {getDescription(note.content)}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}