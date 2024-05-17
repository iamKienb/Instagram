import { Router } from "express";
import { asyncHandler } from "../utils/authKeyToken";

import authenticationToken from "../middlewares/authToken";
import MessageController from "../controllers/message.controller";

const messageRouter = Router()

messageRouter.use(authenticationToken)

messageRouter.post("/:chatId", asyncHandler(MessageController.getMessages));
messageRouter.get("/", asyncHandler(MessageController.addMessage));


export default messageRouter