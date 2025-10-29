import { create } from "zustand";

const useHeaderStore = create((set) => ({
    headerText: "P1",
    setHeaderText: (headertext: string) => set({ headerText: headertext }),
}));

export { useHeaderStore };
