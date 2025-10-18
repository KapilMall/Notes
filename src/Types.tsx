export type Note = {
  content: string,
  id: number,
  status: string,
}

export type Notes = {
  notes: Note[],
  selectedNoteId: number | null
}
