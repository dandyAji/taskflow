import express from "express";
import cors from "cors";
import "dotenv/config";
import AuthRouter from "./src/routes/auth.route.js";
import TaskRouter from "./src/routes/task.route.js";
import { authMiddleware } from "./src/middlewares/auth.middleware.js";
import { formatError } from "./src/utils/error.formatter.util.js";
import UserRouter from "./src/routes/user.route.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/tasks", authMiddleware, TaskRouter);
app.use("/api/v1/users", authMiddleware, UserRouter);

app.use((err, req, res, next) => {
    const { statusCode, body } = formatError(err);

    return res.status(statusCode).json(body);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
