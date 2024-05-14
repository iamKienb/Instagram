import { NextFunction, Request, Response} from "express";
import statusCode from "../core/statusCode";
import HttpResponse from "../core/httpResponse";
import { AuthRequest, UserType } from "../typings/types";
import UserService from "../services/user.service";
import HttpException from "../core/httpException";

export default class UserController {
    static getUser =  async (req:Request, res:Response, next:NextFunction) =>{
        const userId = req.params.userId as unknown as number
        const data = await UserService.getUser(userId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "get data success", data))
    }
    static getAllUsers =  async (req:Request, res:Response, next:NextFunction) =>{
        const data = await UserService.getAllUsers()
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "get data success", data))
 
    }
    static updateUser =  async (req:Request, res:Response, next:NextFunction) =>{
        const userRequest: UserType = req.body
        const currentUserId  = req.userId
        const userId = parseInt(req.params.userId)
        if(currentUserId !== userId) throw new HttpException(statusCode.UNAUTHORIZED, "Unauthorized")
        const data = await UserService.updateUser(userId, userRequest)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "update data success", data))
    }
    static deleteUser = async (req:Request, res:Response, next:NextFunction) =>{
        const currentUserId  = req.userId
        const userId = parseInt(req.params.userId)
        if(currentUserId !== userId) throw new HttpException(statusCode.UNAUTHORIZED, "Unauthorized")
        const data = await UserService.deleteUser(userId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "delete data success", data))
    }
    static searchUser =  async (req:Request, res:Response, next:NextFunction) =>{
        const keyWord = req.header("text") || ''
        const data = await UserService.searchUser(keyWord)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "search data success", data))
    }
}