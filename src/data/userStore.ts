import { create } from "zustand";

interface UserState {
    username: string;
    accessLevel: string;
    setUsername: (text: string) => void;
    setAccessLevel: (text: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    username: "",
    accessLevel: "",
    setUsername: (text) => set({ username: text }),
    setAccessLevel: (text) => set({ accessLevel: text }),
}));
