import config from '../configs/config'
import { NextFunction,Request ,Response } from "express";
import HttpResponse from "../core/httpResponse";
import { validateToken } from "../utils/authKeyToken";

import { getUser } from '../utils/actions';

 const authenticationToken = async(req: Request, res:Response, next:NextFunction) =>{
    const authHeader = req.headers['authorization']
    if(!authHeader){
        return res.status(401).json(new HttpResponse(401,"authorized", null))
    }
    const token = authHeader.split(" ")[1]
    try{
        const payload = await validateToken(token, config.jwt.private_key) as{
            id: number,
            email: string
        }
        const user = await getUser(payload.id)
        if(!user){
            return res.status(401).json({error: 'API TOKEN EXPIRED'})
        }
        req.userId = user.userId
    }catch(e){
        return res.sendStatus(401)
    }
    next()

}

export = authenticationToken