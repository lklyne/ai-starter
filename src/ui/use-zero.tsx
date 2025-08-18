import { useZero as useZeroBase } from "@rocicorp/zero/react";
import { schema } from "@/shared/schema.js";
import { createMutators } from "@/shared/mutators.js";

export function useZero() {
  return useZeroBase<typeof schema, ReturnType<typeof createMutators>>();
}