import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface storeState {
  workspaceId: string;
  updateWorkspace: (workspaceId: string) => void;
}

const store = (set: any) => ({
  workspaceId: "",
  updateWorkspace: (workspaceId: string) =>
    set(() => ({ workspaceId: workspaceId })),
});

export const useAppStore = create<storeState>()(
  devtools(persist(store, { name: "AppStore" }))
);
