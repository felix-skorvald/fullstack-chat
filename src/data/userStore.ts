import { create } from "zustand";

interface UserState {
    username: string;
    accessLevel: string;
    userId: string;
    setUsername: (text: string) => void;
    setUserId: (text: string) => void;
    setAccessLevel: (text: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    username: "",
    userId: "",
    accessLevel: "",
    setUsername: (text) => set({ username: text }),
    setUserId: (text) => set({ userId: text }),
    setAccessLevel: (text) => set({ accessLevel: text }),
}));
