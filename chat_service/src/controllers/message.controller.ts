import { NextFunction, Request, Response } from "express";
import FollowService from "../services/chat.service";
import statusCode from "../core/statusCode";
import HttpResponse from "../core/httpResponse";
import KafkaConfig from "../utils/kafka";
import config from "../configs/config";
import MessageService from "../services/message.service";
const topic = "USER_SERVICE"



export default class MessageController {
    static addMessage = async (req: Request, res: Response, next: NextFunction) =>{
        const userId = req.userId 
        const messageRequest:{text:string, chatId:number} =  req.body
        const data = await MessageService.addMessage(messageRequest, userId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "follow success", data))
    }

    static getMessages = async (req: Request, res: Response, next: NextFunction) =>{
        const userId = parseInt(req.params.userId)
        const data = await MessageService.getMessage(userId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "get following success", data))
    }


}