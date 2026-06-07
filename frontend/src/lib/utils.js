function formatDate(dateStr) {
    if (!dateStr) return "";
    // Ambil 10 karakter pertama saja (YYYY-MM-DD) untuk menghindari masalah timezone ISO
    const cleanDateStr = dateStr.split("T")[0];
    const [year, month, day] = cleanDateStr.split("-");

    if (!year || !month || !day) return "Tanggal tidak valid";

    const bulanIndo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktember", "November", "Desember"];

    return `${parseInt(day)} ${bulanIndo[parseInt(month) - 1]} ${year}`;
}

export function getDeadlineInfo(dateStr) {
    if (!dateStr) return null;

    const cleanDateStr = dateStr.split("T")[0];

    const d = new Date(`${cleanDateStr}T00:00:00`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diff = Math.round((d - today) / (1000 * 60 * 60 * 24));

    const fmt = formatDate(dateStr);

    let colorClass = "text-slate-400";
    let label = fmt;

    if (diff < 0) {
        colorClass = "text-red-400 font-medium";
        label = `${fmt} (terlambat)`;
    } else if (diff === 0) {
        colorClass = "text-red-500 font-semibold";
        label = `${fmt} (hari ini!)`;
    } else if (diff <= 2) {
        colorClass = "text-amber-400";
        label = `${fmt} (${diff} hari lagi)`;
    }

    return { diff, label, colorClass };
}

/**
 * Gabungkan class names (mirip clsx sederhana)
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

/**
 * Inisial dari nama user
 */
export function getInitials(name = "") {
    return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join("");
}
