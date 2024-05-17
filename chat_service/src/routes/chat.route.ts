import { Router } from "express";
import { asyncHandler } from "../utils/authKeyToken";

import authenticationToken from "../middlewares/authToken";
import ChatController from "../controllers/chat.controller";

const chatRouter = Router()

chatRouter.use(authenticationToken)

chatRouter.post("/create-chat/:userId", asyncHandler(ChatController.createChat));
chatRouter.get("/find/:userId", asyncHandler(ChatController.getChat));


export default chatRouter