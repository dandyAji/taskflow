import express from "express";
import { CreateTask, GetTasks, GetTask, UpdateTask, UpdateTaskStatus, DeleteTask } from "../controllers/task.controller.js";

const TaskRouter = express.Router();

TaskRouter.post("/", CreateTask);
TaskRouter.get("/", GetTasks);
TaskRouter.get("/:id", GetTask);
TaskRouter.put("/:id", UpdateTask);
TaskRouter.delete("/:id", DeleteTask);
TaskRouter.patch("/status/:id", UpdateTaskStatus);

export default TaskRouter;
