import { getDeadlineInfo, cn, getInitials } from "../lib/utils";

// cn() — menggabungkan class names

describe("cn", () => {
    it("menggabungkan beberapa class menjadi satu string", () => {
        expect(cn("flex", "items-center", "gap-2")).toBe("flex items-center gap-2");
    });

    it("mengabaikan nilai falsy (null, undefined, false, string kosong)", () => {
        expect(cn("text-red-500", null, undefined, false, "", "font-bold")).toBe("text-red-500 font-bold");
    });

    it("mengembalikan string kosong jika semua argument falsy", () => {
        expect(cn(null, undefined, false)).toBe("");
    });
});

// getInitials() — inisial dari nama user
describe("getInitials", () => {
    it("mengambil inisial dari nama lengkap dua kata", () => {
        expect(getInitials("Dandy Setiawan")).toBe("DS");
    });

    it("hanya mengambil 2 inisial pertama meski nama lebih dari 2 kata", () => {
        expect(getInitials("Ahmad Budi Santoso")).toBe("AB");
    });

    it("mengembalikan string kosong jika nama tidak diberikan", () => {
        expect(getInitials()).toBe("");
        expect(getInitials("")).toBe("");
    });

    it("mengembalikan 1 inisial jika nama hanya satu kata", () => {
        expect(getInitials("Dandy")).toBe("D");
    });
});

// getDeadlineInfo() — info deadline berdasarkan tanggal
describe("getDeadlineInfo", () => {
    it("mengembalikan null jika dateStr tidak diberikan", () => {
        expect(getDeadlineInfo(null)).toBeNull();
        expect(getDeadlineInfo(undefined)).toBeNull();
        expect(getDeadlineInfo("")).toBeNull();
    });

    it("mengembalikan colorClass merah dan label 'terlambat' jika deadline sudah lewat", () => {
        const result = getDeadlineInfo("2020-01-01");

        expect(result.diff).toBeLessThan(0);
        expect(result.colorClass).toBe("text-red-400 font-medium");
        expect(result.label).toContain("terlambat");
    });

    it("mengembalikan colorClass merah dan label 'hari ini' jika deadline hari ini", () => {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const result = getDeadlineInfo(today);

        expect(result.diff).toBe(0);
        expect(result.colorClass).toBe("text-red-500 font-semibold");
        expect(result.label).toContain("hari ini");
    });

    it("mengembalikan colorClass amber jika deadline 1-2 hari lagi", () => {
        const soon = new Date();
        soon.setDate(soon.getDate() + 2);
        const dateStr = soon.toISOString().split("T")[0];

        const result = getDeadlineInfo(dateStr);

        expect(result.diff).toBe(2);
        expect(result.colorClass).toBe("text-amber-400");
        expect(result.label).toContain("hari lagi");
    });

    it("mengembalikan colorClass abu-abu jika deadline masih jauh", () => {
        const result = getDeadlineInfo("2099-12-31");

        expect(result.diff).toBeGreaterThan(2);
        expect(result.colorClass).toBe("text-slate-400");
    });
});
