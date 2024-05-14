import { NextFunction, Request, Response } from "express";
import FollowService from "../services/follow.service";
import statusCode from "../core/statusCode";
import HttpResponse from "../core/httpResponse";
import KafkaConfig from "../utils/kafka";
import config from "../configs/config";
const topic = "USER_SERVICE"



export default class FollowController {
    static followUser = async (req: Request, res: Response, next: NextFunction) =>{
        const currentUserId = req.userId 
        const targetUserId = parseInt(req.params.userId)
        const data = await FollowService.followUser(targetUserId, currentUserId)
        const payload = await FollowService.getOrderPayload(data, 'UPDATE_FOLLOW_USER_COUNT') 
        await KafkaConfig.startKafkaProducer({topic ,payload})
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "follow success", data))
    }

    static getFollowingOfUser = async (req: Request, res: Response, next: NextFunction) =>{
        const targetUserId = parseInt(req.params.userId)
        const data = await FollowService.getFollowingOfUser(targetUserId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "get following success", data))
    }

    static getFollowedOfUser = async (req: Request, res: Response, next: NextFunction) =>{
        const targetUserId = parseInt(req.params.userId)
        const data = await FollowService.getFollowedOfUser(targetUserId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "get followed success", data))
    }

}