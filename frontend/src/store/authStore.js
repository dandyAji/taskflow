import { create } from "zustand";
import Cookies from "js-cookie";
import { authService } from "../services/auth.service";

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
    },

    logout: () => {
        authService.logout();
        set({ user: null, token: null, isAuthenticated: false });
    },

    hydrate: (user) => {
        const token = Cookies.get("token");
        if (token && user) {
            set({ user, token, isAuthenticated: true });
        }
    },
}));
