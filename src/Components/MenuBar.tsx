import { CaseSensitive, ChevronDown, Images, ListTodo, Lock, Logs, Share, SquarePen, Trash2 } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "./Basic components/Button"
import type { Note } from "../Types"
import { useAppDispatch, useAppSelector } from "../Hooks/reduxHooks"
import { addNote, deleteNote, editNote } from "../Slices/notesSlice"
import { ImageUpload } from "./ImageUplaod"

interface MenuBarProps {
    handleNotes?: (note: Note) => void,
    handleDelete?: (id: number) => void,
    selectedNoteId?: number | null,
    editableDivRef: React.RefObject<HTMLDivElement | null>
 }

export const MenuBar: React.FC<MenuBarProps> = ({ editableDivRef }) => {

    const dispatch = useAppDispatch();
    const { selectedNoteId } = useAppSelector((state) => state.notes)

    const handleCheckbox = () => {
        // Simply call the insertCheckbox method
        // editableDivRef.current?.insertCheckbox();
    }
    return (
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-[15px] gap-[13px]">

            <div className="flex justify-between items-center w-[24%] py-[5px]">

                <div className="flex items-center gap-[20px]">
                    {/* Logo  */}

                    <h1 className="text-2xl text-gray-900 dark:text-white">Notes</h1>

                    {/* hamburger icon */}

                    <Button Icon={<Logs className="text-gray-900 dark:text-white" size={20}/>} handleClick={() => console.log('button clicked!')} isBackground = {false}/>
                </div>

                {/* Delete Icon  */}
                <Button Icon={<Trash2 className="text-gray-900 dark:text-white" size={20}/>} handleClick={() => selectedNoteId ? dispatch(deleteNote(selectedNoteId)) : console.log("Select a note to delete!")} isBackground = {false}/>             
            </div>

            <div className="flex gap-[20px] flex-1 items-center justify-between py-[5px]">
                
                {/* Add new note Icon  */}

                <Button Icon={<SquarePen className="text-gray-900 dark:text-white" size={20}/>} handleClick={() => dispatch(addNote())} isBackground = {false}/>                

                <div className="flex gap-[20px] items-center">
                    {/* Change font icon  */}

                    <Button Icon={<CaseSensitive className="text-gray-900 dark:text-white" size={25}/>} handleClick={() => console.log('button clicked!')} isBackground = {false}/>

                    {/* Toggle checkbox icon  */}
                    <Button Icon={<ListTodo className="text-gray-900 dark:text-white" size={20}/>} handleClick={() => handleCheckbox()} isBackground = {false}/>

                    {/* add table icon  */}

                    {/* add Image or file icon */}

                    <ImageUpload editableDivRef = {editableDivRef}/>

                </div>


                <div className="flex items-center gap-[20px] py-[5px]">
                    {/* Lock note Dropdown Icon  */}

                    <div className="flex">
                        <Lock className="text-gray-900 dark:text-white" size={20} />
                        <ChevronDown className="text-gray-900 dark:text-white" size={20} />
                    </div>

                    {/* Search bar  */}
                    

                    {/* Share note icon  */}
                    <Button Icon={<Share className="text-gray-900 dark:text-white" size={20}/>} handleClick={() => console.log('button clicked!')} isBackground = {false}/>

                    {/* Theme toggle  */}
                    
                    <ThemeToggle />
                </div>



            </div>

            {/* Search note icon  */}

        </div>
    )
}