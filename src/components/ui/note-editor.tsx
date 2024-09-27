'use client'
import { useState, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export interface Note {
  id: number;
  content: string;
  creationTime: string;
  lastModificationTime: string;
}

interface NoteEditorProps {
  initialNotes: Note[]
}

export default function NoteEditor({ initialNotes }: NoteEditorProps)
{
  const [editMode, setEditMode] = useState<number>(0);
  const [notes, setNotes] = useState<Note[]>(initialNotes === null ? [] : initialNotes);
  const [noteEditorContent, setNoteEditorContent] = useState<string>('');
  const id = useSession().data?.user.id;

  const handleNoteEditorInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteEditorContent(event.target.value);
  }
  
  const now = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  const addNewNote = async () => {
    if(noteEditorContent.trim() === '') return
    const newNote: Note = {id: 0, content: noteEditorContent, creationTime: now(), lastModificationTime: now()}
    console.log(JSON.stringify({
      ...newNote, user_id: String(id)
      }))
    await fetch('http://localhost/note-app/api/v1/add-note.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...newNote, user_id: String(id)
      })
      
    })
    .then(response => response.json())
    .then((response) => {
      console.log(response)
      newNote.id = response['note_id']
    })
    .catch(error => console.warn(error))
    setNoteEditorContent('');
    setNotes([newNote, ...notes])
  }

  const editNote = (id: number, content: string) => {
    setNoteEditorContent(content)
    setEditMode(id)
  }
  
  const saveChanges = async () => {
    const modTime: string = now()
    await fetch('http://localhost/note-app/api/v1/update-note.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        noteId: editMode,
        newContent: noteEditorContent,
        lastModificationTime: modTime
      })
    })
    .then(response => response.json())
    .then((response) => {console.log(response)})
    .catch(error => console.warn(error))
    setEditMode(0)
    setNoteEditorContent('')
    for(const note of notes)
    {
      if(note.id === editMode)
      {
        note.content = noteEditorContent
        note.lastModificationTime = modTime
      }
    }
  }

  const deleteNote = async (idToDelete: number) => {
    const userConfirm: boolean = confirm('Are you sure you want to delete that note?')
    if(!userConfirm) return
    await fetch('http://localhost/note-app/api/v1/delete-note.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        noteId: idToDelete,
      })
    })
    .then(response => response.json())
    .then((response) => {console.log(response)})
    .catch(error => console.warn(error))
    setNotes(notes.filter((note) => note.id !== idToDelete))
  } 

  const cancel = () => {
    setNoteEditorContent('')
    setEditMode(0)
  }
  const targetRef = useRef<HTMLDivElement>(null);
  return (
    <>
    <div className="h-full rounded-xl border-2 overflow-y-auto bg-[#FAF3E0] note-background">
      <ul className="flex flex-wrap note-container">
        {notes?.length === 0 ? (
          <li className="m-4">Create your first note!</li>
        ) : (
          notes?.map((note: Note) => {
            return (
              <li key={note.id} className="note flex gap-2 flex-col">
                  <p className="bg-[#F0F4F8] p-4 box-border max-h-48 overflow-y-auto overflow-x-hidden text-sm border-2 rounded-lg break-words">{note.content}</p>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-1 mt-1 ml-2">
                      <button onClick={() => deleteNote(note.id)} className="w-7 h-7 bg-red-400 rounded-lg p-1 shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500">
                        <Image src="/delete.svg" width={20} height={20} alt="delete-icon"></Image>
                      </button>
                      <button onClick={() => {
                        editNote(note.id, note.content)
                        if (targetRef.current) {
                          targetRef.current.scrollIntoView({ behavior: 'smooth' });
                      }
                        }} className="w-7 h-7 bg-gray-400 rounded-lg p-1 shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        <Image src="/edit.svg" width={20} height={20} alt="edit-icon"></Image>
                      </button>
                    </div>
                    <div className="mr-3 text-slate-600">
                      <p className="text-[12px]">Last time modified:</p>
                      <pre className="text-[10px]">{note.lastModificationTime}</pre>
                    </div>
                  </div>
              </li>
              )
            })
          )}
      </ul>
    </div>
    <div className="bar bg-[#FAF3E0] p-4 rounded-xl border-2" ref={targetRef} >
      <h2 className="text-xl font-semibold mb-4">Create a note...</h2>
      <textarea className=" h-[250px] p-2 w-full border bg-[#F1F1F1] rounded-lg resize-none outline-none"
      placeholder="Enter your text here..." value={noteEditorContent} onChange={handleNoteEditorInput}/><br />
      {
        <div className="flex jusify-center gap-4 mt-2">
          {editMode ? (
            <>
              <button onClick={saveChanges} className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 focus:outline-none">Save changes</button>
              <button onClick={cancel} className="bg-red-400 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-500 focus:outline-none">Cancel</button>
            </>
          ) : (
            <button onClick={addNewNote} className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none">
              Save
            </button>
          )}
        </div>
      }
    </div>
    </>
  )
}
