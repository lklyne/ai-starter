import {CustomMutatorDefs} from '@rocicorp/zero';
import {schema, Session} from './schema.js';

export function createMutators(sess: Session | null) {
  return {
    // Add your mutator definitions here
    // Example:
    // createIssue(tx, {id, title, description}) {
    //   if (!sess) throw new Error("Not authenticated");
    //   await tx.issue.insert({ id, title, description });
    // }
    // If you need to perform complex permission checks server side for a mutator,
    // 1. add the unpermissioned mutator here
    // 2. add the permissioned mutator in src/server/server-mutators.ts
    // The mutator on the server can be async and call whatever you like.
    // It can even be non-deterministic, like generating a random ID.
    // To share code, the server mutator can call the mutator defined here.
    // Create a new note
    createNote(
      tx,
      {id, title, content}: {id: string; title: string; content: string},
    ) {
      if (!sess) throw new Error('Not authenticated');
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
    updateNote(
      tx,
      {id, title, content}: {id: string; title?: string; content?: string},
    ) {
      if (!sess) throw new Error('Not authenticated');
      const now: number = Date.now();
      return tx.mutate.note.update({
        id,
        ...(title !== undefined && {title}),
        ...(content !== undefined && {content}),
        updatedAt: now,
      });
    },

    // Delete a note
    deleteNote(tx, {id}: {id: string}) {
      if (!sess) throw new Error('Not authenticated');
      return tx.mutate.note.delete({
        id,
      });
    },
  } as const satisfies CustomMutatorDefs<typeof schema>;
}

export type Mutators = ReturnType<typeof createMutators>;
