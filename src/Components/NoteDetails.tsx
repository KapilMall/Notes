import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import { useAppDispatch, useAppSelector } from "../Hooks/reduxHooks";
import { editNote } from "../Slices/notesSlice";

interface NoteDetailProps {
    note?: any,
    onUpdateNote?: (id: number, editingNote: string) => void
}

export interface NoteDetailsHandle {
    getTextareaRef: () => HTMLDivElement | null;
    insertCheckbox: () => void;
}

export const NoteDetails = forwardRef<NoteDetailsHandle, NoteDetailProps>((props, ref) => {

    const [content, setContent] = useState('');
    const prevNoteIdRef = useRef<number | null>(null);
    const editableDivRef = useRef<HTMLDivElement>(null);
    const isUpdatingRef = useRef(false);
    const pendingCursorPosRef = useRef<number | null>(null);

    const notes = useAppSelector((state) => state.notes);
    const dispatch = useAppDispatch();

    const selectedNote = notes.notes.find(note => note.id === notes.selectedNoteId);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
        getTextareaRef: () => editableDivRef.current,
        insertCheckbox: () => insertCheckboxAtCursor()
    }), [content]);

    // Convert markdown images to HTML
    const renderContent = (text: string) => {
        return text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 400px; margin: 10px 0; border-radius: 8px;" />');
    };

    // Save cursor position
    const saveCursorPosition = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || !editableDivRef.current) return null;

        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(editableDivRef.current);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        return preCaretRange.toString().length;
    };

    // Restore cursor position
    const restoreCursorPosition = (position: number) => {
        if (!editableDivRef.current) return;

        const range = document.createRange();
        const sel = window.getSelection();
        
        let currentPos = 0;
        let found = false;

        const traverseNodes = (node: Node): boolean => {
            if (node.nodeType === Node.TEXT_NODE) {
                const textLength = node.textContent?.length || 0;
                if (currentPos + textLength >= position) {
                    range.setStart(node, Math.min(position - currentPos, textLength));
                    range.collapse(true);
                    found = true;
                    return true;
                }
                currentPos += textLength;
            } else {
                for (let i = 0; i < node.childNodes.length; i++) {
                    if (traverseNodes(node.childNodes[i])) return true;
                }
            }
            return false;
        };

        traverseNodes(editableDivRef.current);
        
        if (found && sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    // Insert checkbox at cursor position
    const insertCheckboxAtCursor = () => {
        if (!editableDivRef.current || !selectedNote) return;

        const cursorPosition = saveCursorPosition();
        if (cursorPosition === null) return;

        const currentContent = content;

        // Find the start of the current line
        let lineStart = currentContent.lastIndexOf('\n', cursorPosition - 1) + 1;
        const lineEnd = currentContent.indexOf('\n', cursorPosition);
        const currentLine = currentContent.substring(lineStart, lineEnd === -1 ? currentContent.length : lineEnd);
        
        let newContent;
        let newCursorPos;

        // Check if line already has a checkbox
        if (currentLine.startsWith('[ ] ') || currentLine.startsWith('[x] ')) {
            const restOfLine = currentLine.substring(4);
            newContent = 
                currentContent.substring(0, lineStart) + 
                restOfLine +
                (lineEnd !== -1 ? currentContent.substring(lineEnd) : '');
            newCursorPos = cursorPosition;
        } else {
            // Add new unchecked checkbox at the start of the line
            newContent = 
                currentContent.substring(0, lineStart) + 
                '[ ] ' + 
                currentContent.substring(lineStart);
            newCursorPos = lineStart + 4;
        }

        isUpdatingRef.current = true;
        setContent(newContent);
        dispatch(editNote({id: selectedNote.id, content: newContent}));

        setTimeout(() => {
            restoreCursorPosition(newCursorPos);
            isUpdatingRef.current = false;
        }, 0);
    };

    useEffect(() => {
        if(selectedNote) {
            const isNewNote = selectedNote.id !== prevNoteIdRef.current;
            
            if (isNewNote) {
                setContent(selectedNote.content || "");
                prevNoteIdRef.current = selectedNote.id;

                if (editableDivRef.current) {
                    editableDivRef.current.innerHTML = renderContent(selectedNote.content || "");
                }

                setTimeout(() => {
                    editableDivRef.current?.focus();
                }, 0);
            }
        } else {
            prevNoteIdRef.current = null;
            setContent('');
            if (editableDivRef.current) {
                editableDivRef.current.innerHTML = '';
            }
        }
    }, [selectedNote?.id]);

    // CHANGE 1: Handle input changes
    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const newContent = e.currentTarget.textContent || '';
        setContent(newContent);
        
        if(selectedNote) {
            dispatch(editNote({id: selectedNote.id, content: newContent}));
        }
    };

    // Toggle checkbox when clicking on [ ] or [x]
    const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!editableDivRef.current || !selectedNote) return;

        const cursorPos = saveCursorPosition();
        if (cursorPos === null) return;

        const currentContent = content;

        // Find line at cursor
        const lineStart = currentContent.lastIndexOf('\n', cursorPos - 1) + 1;
        const lineEnd = currentContent.indexOf('\n', cursorPos);
        const line = currentContent.substring(lineStart, lineEnd === -1 ? currentContent.length : lineEnd);

        // Check if clicking near the checkbox (within first 4 characters of line)
        const clickPosInLine = cursorPos - lineStart;
        if ((line.startsWith('[ ] ') || line.startsWith('[x] ')) && clickPosInLine <= 3) {
            e.preventDefault();
            const isChecked = line.startsWith('[x] ');
            const restOfLine = line.substring(4);

            let newContent;
            // Toggle checkbox
            if (isChecked) {
                newContent = currentContent.substring(0, lineStart) + '[ ] ' + restOfLine;
            } else {
                newContent = currentContent.substring(0, lineStart) + '[x] ' + restOfLine;
            }

            isUpdatingRef.current = true;
            setContent(newContent);
            dispatch(editNote({ id: selectedNote.id, content: newContent }))

            setTimeout(() => {
                isUpdatingRef.current = false;
            }, 0);
        }
    };

    // CHANGE 2: Moved e.preventDefault() to top and handle both cases explicitly
    const handleNextLine = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if(!editableDivRef.current || !selectedNote) return;

        if (e.key === 'Enter') {
            e.preventDefault(); // Always prevent default to control newline behavior
            
            const cursorPos = saveCursorPosition();
            if (cursorPos === null) return;

            // Get current content from the DOM, not state
            const currentContent = editableDivRef.current.textContent || '';

            // gets the content before cursor including '/n' 
            const contentBeforeCursor = currentContent.substring(0, cursorPos);

            // gets the index of the last '\n'  
            const lastNewLineIndex = contentBeforeCursor.lastIndexOf('\n');

            // gets the starting index of last line
            const secondLastNewLineIndex = contentBeforeCursor.lastIndexOf('\n', lastNewLineIndex - 1);

            // gets the content of last line
            const lastNewLine = contentBeforeCursor.substring(secondLastNewLineIndex, lastNewLineIndex);

            const lastLinehasNoContent = lastNewLine.substring(4).trim().length === 0;

            let newContent;
            let newCursorPos;

            if (!lastLinehasNoContent && (lastNewLine.startsWith('[ ] ') || lastNewLine.startsWith('[x] '))) {
                // Add checkbox to new line
                newContent = currentContent.substring(0, cursorPos) + '\n[ ] ' + currentContent.substring(cursorPos);
                newCursorPos = cursorPos + 5;
            } else {
                // Regular newline
                newContent = currentContent.substring(0, cursorPos) + '\n' + currentContent.substring(cursorPos);
                newCursorPos = cursorPos + 1;
            }
            
            // Directly update the DOM
            editableDivRef.current.textContent = newContent;
            
            // Update state and dispatch
            setContent(newContent);
            dispatch(editNote({ id: selectedNote?.id, content: newContent }));
            
            // Restore cursor immediately
            setTimeout(() => {
                restoreCursorPosition(newCursorPos);
            }, 0);
        }
    }

    // Update the div content when state changes but preserve cursor
    useEffect(() => {
        if (!editableDivRef.current) return;

        const renderedContent = renderContent(content);
        const currentHTML = editableDivRef.current.innerHTML;
        
        // Update innerHTML if rendered content is different (for images)
        if (renderedContent !== currentHTML) {
            const cursorPos = saveCursorPosition();
            editableDivRef.current.innerHTML = renderedContent;
            
            // Restore cursor if it was saved
            if (cursorPos !== null) {
                requestAnimationFrame(() => {
                    restoreCursorPosition(cursorPos);
                });
            }
        }
    }, [content]);

    if(!selectedNote) {
        return (
            <div className="flex flex-1 items-center justify-center overflow-y-auto">
                <h1 className="text-gray-900 dark:text-white">Select a note to View</h1>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 overflow-y-auto px-[15px] py-[5px]">
            <div
                ref={editableDivRef}
                contentEditable
                className="flex-1 w-full outline-0 text-gray-900 dark:text-white"
                suppressContentEditableWarning
                onInput={handleInput}
                onClick={handleDivClick}
                onKeyDown={handleNextLine}
                style={{
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                }}
            />
            <style>{`
                div[contenteditable]::first-line {
                    font-size: 1.5rem;
                    font-weight: 700;
                    line-height: 2;
                }
            `}</style>
        </div>
    )
});
