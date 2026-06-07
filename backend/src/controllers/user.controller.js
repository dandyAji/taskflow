import { getUserById } from "../service/user.service.js";
import { formatError } from "../utils/error.formatter.util.js";

export const getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await getUserById(userId);

        res.status(200).json({
            message: "Berhasil mengambil data pengguna",
            data: user,
        });
    } catch (error) {
        const { statusCode, body } = formatError(error);

        return res.status(statusCode).json(body);
    }
};
