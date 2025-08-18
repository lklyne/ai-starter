import { useState } from "react";
import { useQuery } from "@rocicorp/zero/react";
import { useSession } from "@/client/auth";
import { queries } from "@/shared/queries";
import { useZero } from "./use-zero";

export function NotesSection() {
  const { data: session } = useSession();
  const zero = useZero();
  const [notes] = useQuery(queries.userNotes(session));
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const selectedNote = selectedNoteId ? notes?.find(note => note.id === selectedNoteId) : undefined;

  async function handleCreateNote() {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    
    setIsCreating(true);
    try {
      const id = crypto.randomUUID();
      await zero.mutate.createNote({
        id,
        title: newNoteTitle.trim(),
        content: newNoteContent.trim(),
      });
      
      setNewNoteTitle("");
      setNewNoteContent("");
      setSelectedNoteId(id);
    } catch (error) {
      console.error("Failed to create note:", error);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdateNote() {
    if (!editingNoteId || !editTitle.trim() || !editContent.trim()) return;

    try {
      await zero.mutate.updateNote({
        id: editingNoteId,
        title: editTitle.trim(),
        content: editContent.trim(),
      });
      setEditingNoteId(null);
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  }

  async function handleDeleteNote(noteId: string) {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await zero.mutate.deleteNote({ id: noteId });
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  }

  function startEditing(note: any) {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Notes</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes List */}
        <div>
          <h3 className="text-md font-medium mb-3">Your Notes</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {notes?.map((note) => (
              <div
                key={note.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedNoteId === note.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => note.id && setSelectedNoteId(note.id)}
              >
                <h4 className="font-medium text-sm truncate">{note.title}</h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{note.content}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (note.id) startEditing(note);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (note.id) handleDeleteNote(note.id);
                      }}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {(!notes || notes.length === 0) && (
              <p className="text-gray-500 text-sm">No notes yet. Create your first note!</p>
            )}
          </div>
        </div>

        {/* Note Editor/Viewer */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-medium">
              {editingNoteId ? 'Edit Note' : selectedNoteId ? 'Note Details' : 'Create New Note'}
            </h3>
            {selectedNoteId && !editingNoteId && (
              <button
                onClick={() => setSelectedNoteId(null)}
                className="btn btn-default text-xs"
              >
                Create New Note
              </button>
            )}
          </div>
          
          {editingNoteId ? (
            /* Edit Mode */
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="input w-full"
                placeholder="Note title"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="input w-full h-32"
                placeholder="Note content"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateNote}
                  className="btn btn-primary text-sm"
                  disabled={!editTitle.trim() || !editContent.trim()}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingNoteId(null)}
                  className="btn btn-default text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : selectedNote ? (
            /* View Mode */
            <div className="space-y-3">
              <h4 className="font-semibold">{selectedNote.title}</h4>
              <div className="p-3 bg-gray-50 rounded-lg min-h-32 whitespace-pre-wrap">
                {selectedNote.content}
              </div>
              <div className="text-xs text-gray-500">
                Created: {new Date(selectedNote.createdAt).toLocaleString()}
                {selectedNote.updatedAt !== selectedNote.createdAt && (
                  <span className="ml-2">
                    Updated: {new Date(selectedNote.updatedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ) : (
            /* Create Mode */
            <div className="space-y-3">
              <input
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="input w-full"
                placeholder="Note title"
              />
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="input w-full h-32"
                placeholder="Write your note here..."
              />
              <button
                onClick={handleCreateNote}
                disabled={!newNoteTitle.trim() || !newNoteContent.trim() || isCreating}
                className="btn btn-primary text-sm"
              >
                {isCreating ? 'Creating...' : 'Create Note'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}