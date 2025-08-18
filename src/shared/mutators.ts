import { CustomMutatorDefs } from "@rocicorp/zero";
import { schema, Session } from "./schema.js";

export function createMutators(sess: Session | null) {
  return {
    // Create a new note
    createNote(tx, { id, title, content }: { id: string; title: string; content: string }) {
      if (!sess) throw new Error("Not authenticated");
      const now: number = Date.now();
      return tx.mutate.note.insert({
        id,
        title,
        content,
        userId: sess.user.id,
        createdAt: now,
        updatedAt: now,
      });
    },

    // Update an existing note
    updateNote(tx, { id, title, content }: { id: string; title?: string; content?: string }) {
      if (!sess) throw new Error("Not authenticated");
      const now: number = Date.now();
      return tx.mutate.note.update({
        id,
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        updatedAt: now,
      });
    },

    // Delete a note
    deleteNote(tx, { id }: { id: string }) {
      if (!sess) throw new Error("Not authenticated");
      return tx.mutate.note.delete({
        id,
      });
    },
  } as const satisfies CustomMutatorDefs<typeof schema>;
}

export type Mutators = ReturnType<typeof createMutators>;
