import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Note } from "../Types";

interface NotesState {
    notes: Note[],
    selectedNoteId: number | null
}

const initialState: NotesState = {
    notes: [],
    selectedNoteId: null,
}

export const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        addNote: (state) => {
            const newNote = {
                content: '',
                id: new Date().getTime(),
                status: 'incomplete'
            }
            state.notes.push(newNote);
            // on setting the selectedNoteId with the new Id, it will automatically focus on the text area when new note is added
            state.selectedNoteId = newNote.id;
        },
        deleteNote: (state, action: PayloadAction<number>) => {
            state.notes = state.notes.filter((s) => s.id !== action.payload)
        },
        editNote: (state, action: PayloadAction<{id: number | null, content: string}>) => {
            state.notes.map((note) => {
                if (note.id !== action.payload.id) return;

                note.content = action.payload.content;
            })
        },
        onSelectNoteId: (state, action: PayloadAction<number>) => {
            state.selectedNoteId = action.payload;
        }
    }
})

export const { addNote, deleteNote, onSelectNoteId, editNote } = notesSlice.actions;
export default notesSlice.reducer;