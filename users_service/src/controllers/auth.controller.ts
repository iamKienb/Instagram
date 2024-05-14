import { NextFunction, Request, Response} from "express";
import statusCode from "../core/statusCode";
import HttpResponse from "../core/httpResponse";
import AuthService from "../services/auth.service";
import { AuthRequest } from "../typings/types";

export default class AuthController {
    static signUp =  async (req:Request, res:Response, next:NextFunction) =>{
        const authRequest: AuthRequest = req.body
        const {confirmPassword, ...body} = authRequest
        const data = await AuthService.signUp(confirmPassword, body)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "sign up successfully", data))
    }

    static signIn = async (req:Request, res:Response, next:NextFunction) =>{
        const {username, password} = req.body
        const data = await AuthService.signIn(username, password)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.OK, "sign in successfully", data))
    }
}
