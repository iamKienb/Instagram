import { NextFunction, Request, Response } from "express";
import StoryService from "../services/story.service";
import statusCode from "../core/statusCode";
import HttpResponse from "../core/httpResponse";


export default class StoryController {
    static  createStory = async (req: Request, res: Response, next: NextFunction) =>{
        const userId = req.userId 
        const captions = req.body.captions
        const file = req.files as any
        const images = file.map( (image :any) => image.path)
        const data = await StoryService.createStory(captions, images, userId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "create data success", data))
    }
    static  getStoryOfUser = async (req: Request, res: Response, next: NextFunction) =>{
        const userId = parseInt(req.params.userId);
        const data = await StoryService.getStoryOfUser(userId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "get data success", data))
    }
    static  updateStory = async (req: Request, res: Response, next: NextFunction) =>{
        const userId = req.userId 
        const captions = req.body.captions
        const file = req.files as any
        const images = file.map( (image :any) => image.path)
        const storyId = req.get("storyId") as unknown as number
        const data = await StoryService.updateStory(captions, images, userId, storyId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "update data success", data))
    }
    static  deleteStory = async (req: Request, res: Response, next: NextFunction) =>{
        const userId = req.userId 
        const storyId = req.get("storyId") as unknown as number
        const data = await StoryService.deleteStory(userId, storyId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "delete data success", data))
    }
    static  likeStory = async (req: Request, res: Response, next: NextFunction) =>{
        const userId = req.userId 
        const storyId = req.get("storyId") as unknown as number
        const data = await StoryService.likeStory(userId, storyId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "like story success", data))
    }
    static  unlikeStory = async (req: Request, res: Response, next: NextFunction) =>{
        const userId = req.userId 
        const storyId = req.get("storyId") as unknown as number
        const data = await StoryService.unLikeStory(userId, storyId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "get data success", data))
    }
    static  getLikeOfStory = async (req: Request, res: Response, next: NextFunction) =>{
        const storyId = req.get("storyId") as unknown as number
        const data = await StoryService.getLikeOfStory(storyId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "get data success", data))
    }
    static  commentStory = async (req: Request, res: Response, next: NextFunction) =>{
        const storyId = req.get("storyId") as unknown as number
        const text = req.get("text") as unknown as string
        const userId = req.userId 
        const data = await StoryService.commentStory(userId, storyId, text)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "comment story success", data))
    }


    static  getCommentsWithUserDetails = async (req: Request, res: Response, next: NextFunction) =>{
        const storyId = req.get("storyId") as unknown as number
        const data = await StoryService.getCommentsWithUserDetails(storyId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "get data success", data))
    }

}