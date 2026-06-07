import { existingEmail } from "../service/user.service.js";
import authService from "../service/auth.service.js";
import { registerValidation, loginValidation } from "../validation/auth.validation.js";
import { formatError } from "../utils/error.formatter.util.js";
import { generateToken } from "../utils/jwt.util.js";

const Register = async (req, res) => {
    try {
        const data = registerValidation.parse(req.body);
        await existingEmail(data.email);
        const user = await authService.register(data);

        return res.status(201).json({
            message: "User berhasil didaftarkan",
            data: user,
        });
    } catch (error) {
        const { statusCode, body } = formatError(error);

        return res.status(statusCode).json(body);
    }
};

const Login = async (req, res) => {
    try {
        const data = loginValidation.parse(req.body);
        const user = await authService.login(data.email, data.password);
        const token = generateToken({ id: user.id, email: user.email });

        return res.status(200).json({
            message: "Login berhasil",
            data: user,
            token: token,
        });
    } catch (error) {
        const { statusCode, body } = formatError(error);

        return res.status(statusCode).json(body);
    }
};

export { Register, Login };
