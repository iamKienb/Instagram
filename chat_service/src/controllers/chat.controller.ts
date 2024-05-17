import { NextFunction, Request, Response } from "express";
import statusCode from "../core/statusCode";
import HttpResponse from "../core/httpResponse";
import KafkaConfig from "../utils/kafka";
import config from "../configs/config";
import ChatService from "../services/chat.service";
const topic = "USER_SERVICE"



export default class ChatController {
    static createChat = async (req: Request, res: Response, next: NextFunction) =>{
        const currentUserId = req.userId 
        const targetUserId = parseInt(req.params.userId)
        const data = await ChatService.createChat(targetUserId, currentUserId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "create data success", data))
    }
    static getChat = async (req: Request, res: Response, next: NextFunction) =>{
        const currentUserId = req.userId 
        const targetUserId = parseInt(req.params.userId)
        const data = await ChatService.createChat(targetUserId, currentUserId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "get data success", data))
    }

  

}