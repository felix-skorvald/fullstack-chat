import { create } from "zustand";

interface HeaderState {
    headerText: string;
    setHeaderText: (text: string) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
    headerText: "Chappy",
    setHeaderText: (text) => set({ headerText: text }),
}));
