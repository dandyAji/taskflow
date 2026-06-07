import api from "../lib/api";
import Cookies from "js-cookie";

export const authService = {
    /**
     * Login user
     * @returns {{ token: string, user: object }}
     */
    async login(email, password) {
        const res = await api.post("/auth/login", { email, password });
        const { token, user } = res.data;
        Cookies.set("token", token, { expires: 7, sameSite: "strict" });
        return { token, user };
    },

    /**
     * Register user baru
     * @returns {{ token: string, user: object }}
     */
    async register(name, email, password) {
        const res = await api.post("/auth/register", { name, email, password });
        return res.data;
    },

    /**
     * Logout: hapus token dari cookie
     */
    logout() {
        Cookies.remove("token");
    },

    async getMe() {
        const res = await api.get("/users/me");
        return res.data;
    },
};
