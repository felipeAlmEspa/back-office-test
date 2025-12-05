import { create } from "zustand";

interface FormStore {
  submitters: Record<string, (() => void) | null>;
  setSubmitter: (id: string, fn: (() => void) | null) => void;
  getSubmitter: (id: string) => (() => void) | null;
}

export const useFormStore = create<FormStore>((set, get) => ({
  submitters: {},
  setSubmitter: (id, fn) =>
    set((state) => ({
      submitters: { ...state.submitters, [id]: fn },
    })),
  getSubmitter: (id) => get().submitters[id] ?? null,
}));
