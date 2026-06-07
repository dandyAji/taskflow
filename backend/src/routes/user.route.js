import express from "express";
import { getUser } from "../controllers/user.controller.js";

const UserRouter = express.Router();

UserRouter.get("/me", getUser);

export default UserRouter;
