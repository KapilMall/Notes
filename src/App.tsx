// import { ListTasks } from "./Components/ListTasks";
// import { TaskDescription } from "./Components/TaskDescription"
import "./index.css";
import { ToastContainer } from "react-toastify";
import { MenuBar } from "./Components/MenuBar";
import { NotesList } from "./Components/NotesList";
import { useRef } from "react";
import { NoteDetail } from "./Components/NoteDetail";
// import type { Note } from "./Types";

function App() {
  // Without redux states

  // const [notes, setNotes] = useState<Note[]>([]);
  // const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)
  // const noteDetailTextAreaRef = useRef<HTMLTextAreaElement>(null)

  // Doing this for toggle/add checkbox feature

  // This is ref to the noteDetail component itself not the textara in it
   const editableDivRef = useRef<HTMLDivElement>(null);

  // notes and selectedNoteId state in case of local storage

  // const [notes, setNotes] = useState<Note[]>(() => {
  //   const savedNotes = localStorage.getItem("notes");
  //   return savedNotes ? JSON.parse(savedNotes) : []
  // }); 

  // const [selectedNoteId, setSelectedNoteId] = useState<number | null>(() => {
  //   const currentSelectedNote = localStorage.getItem('selectedNote');
  //   return currentSelectedNote ? JSON.parse(currentSelectedNote) : null
  // })
  


  // const handleNotes = (note: Note) => {
  //   setNotes((prev) => [...prev, note])
  //   setSelectedNoteId(note.id);
  //   toast.success('Added note successfully!')

  //   // focus on text area after state update
  //   setTimeout(() => {  
  //     noteDetailTextAreaRef.current?.focus();
  //   }, 0)
  // }

  // const handleDelete = (id: number) => {
  //   setNotes((prev) => prev.filter((note) => note.id !== id))
  // }

  // const handelEditNote = (id: number, editingNote?: string, editingStatus?: boolean) => {

  //   setNotes((prev) => prev.map((note) => {
  //     if(note.id !== id) return note;

  //     const updatedNotes = {...note};

  //     if(editingNote !== undefined && editingNote !== '') {
  //       updatedNotes.content = editingNote;
  //     }

  //     if(editingStatus !== undefined) {
  //       updatedNotes.status = editingStatus ? 'complete' : 'incomplete'
  //     }

  //     return updatedNotes;
  //   }
  //   ))

  //   // if (editingNote !== undefined && editingNote !== '') {
  //   //   toast.success('Edited note successfully!');
  //   // }

  //   // if (editingStatus !== undefined) {
  //   //   toast.success(`Task status changed to: ${editingStatus ? 'complete' : 'incomplete'}`);
  //   // }
  // }

  // const selectedNote  = notes.find(note => note.id === selectedNoteId);

  //Get heading from the textarea, we will consider first line as heading

  const getHeading = (content: string) => {
    const firstLine = content.split('\n')[0];
    const hasCheckBox = firstLine.includes('[ ] ') || firstLine.includes('[x] ');

    if (hasCheckBox) {
      const heading = firstLine.substring(4);
      return heading;
    }

    return firstLine || "New Note";
  }

  //Get description from the textarea, Consider everything after the first line as description

  const getDescription = (content: string) => {
    const lines = content.split('\n');
    const description = lines.map((line) => {
      const hascheckBox = line.includes('[ ] ') || line.includes('[x] ');
      if(hascheckBox) {
        return line.slice(4);
      }
      return line;
    });

    return description.slice(1).join('\n') || "No additional text"
  }

  // Svave notes and selectedNoteId to local storage whenever it changes

  // useEffect(() => {
  //   localStorage.setItem("notes", JSON.stringify(notes));
  //   localStorage.setItem("selectedNote", JSON.stringify(selectedNoteId))
  // }, [notes, selectedNoteId])

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 h-screen w-full">

      {/* divider  */}

      <div className="w-[1px] h-[100%] dark:bg-white bg-gray-900 mx-[10px] absolute left-[24.3%]"></div>

      <MenuBar 
        // handleNotes = {handleNotes}
        // handleDelete = {handleDelete}
        // selectedNoteId = {selectedNoteId}
        editableDivRef = {editableDivRef}
      />
      {/* <TaskDescription  handleNotes = {handleNotes} />
      <ListTasks notes = {notes} handleDelete = {handleDelete} handelEditNote = {handelEditNote}/> */}

      <div className="flex flex-1 overflow-hidden">
        {/* Notes list  */}

        <NotesList 
          // notes = {notes}
          // selectedNoteId = {selectedNoteId}  
          getHeading = {getHeading}
          getDescription = {getDescription}
          // setSelectedNoteId = {setSelectedNoteId}
        />

        {/* Notes Details  */
        }
        <NoteDetail 
          // note = {selectedNote}
          // textareaRef = {noteDetailTextAreaRef}
          // onUpdateNote = {handelEditNote}
          editableDivRef={editableDivRef}
        />
      </div>



      <ToastContainer 
        position="bottom-right"
      />
    </div>
  )
}

export default App
