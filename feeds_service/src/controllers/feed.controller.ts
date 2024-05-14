import { NextFunction, Request, Response } from "express";
import FeedService from "../services/feed.service";
import statusCode from "../core/statusCode";
import HttpResponse from "../core/httpResponse";


export default class FeedController {
    static  createPost = async (req: Request, res: Response, next: NextFunction) =>{
        const userId = req.userId 
        const captions = req.body.captions
        const file = req.files as any
        const images = file.map( (image :any) => image.path)
        const data = await FeedService.createPost(captions, images, userId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "create data success", data))
    }
    static  getPostOfUser = async (req: Request, res: Response, next: NextFunction) =>{
        const userId = parseInt(req.params.userId);
        const data = await FeedService.getPostsOfUser(userId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "get data success", data))
    }
    static  updatePost = async (req: Request, res: Response, next: NextFunction) =>{
        const userId = req.userId 
        const captions = req.body.captions
        const file = req.files as any
        const images = file.map( (image :any) => image.path)
        const postId = req.get("postId") as unknown as number
        const data = await FeedService.UpdatePost(captions, images, userId, postId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "update data success", data))
    }
    static  deletePost = async (req: Request, res: Response, next: NextFunction) =>{
        const userId = req.userId 
        const postId = req.get("postId") as unknown as number
        const data = await FeedService.deletePost(userId, postId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "delete data success", data))
    }
    static  likePost = async (req: Request, res: Response, next: NextFunction) =>{
        const userId = req.userId 
        const postId = req.get("postId") as unknown as number
        const data = await FeedService.likePost(userId, postId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "like post success", data))
    }
    static  unlikePost = async (req: Request, res: Response, next: NextFunction) =>{
        const userId = req.userId 
        const postId = req.get("postId") as unknown as number
        const data = await FeedService.unLikePost(userId, postId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "get data success", data))
    }
    static  getLikeOfPost = async (req: Request, res: Response, next: NextFunction) =>{
        const postId = req.get("postId") as unknown as number
        const data = await FeedService.getLikeOfPost(postId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "get data success", data))
    }

    static  sharePost = async (req: Request, res: Response, next: NextFunction) =>{
        const postId = req.get("postId") as unknown as number
        const userId = req.userId 
        const data = await FeedService.sharePost(userId, postId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "share post success", data))
    }

    static  unsharePost = async (req: Request, res: Response, next: NextFunction) =>{
        const postId = req.get("postId") as unknown as number
        const userId = req.userId 
        const data = await FeedService.UnSharePost(userId, postId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "unshare post success", data))
    }

    static  commentPost = async (req: Request, res: Response, next: NextFunction) =>{
        const postId = req.get("postId") as unknown as number
        const text = req.get("text") as unknown as string
        const userId = req.userId 
        const data = await FeedService.commentPost(userId, postId, text)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "comment post success", data))
    }
    static  modifyComment = async (req: Request, res: Response, next: NextFunction) =>{
        const postId = req.get("postId") as unknown as number
        const text = req.get("text") as unknown as string
        const userId = req.userId 
        const commentId = parseInt(req.params.commentId) 
        const data = await FeedService.modifyComment(commentId, userId, postId, text)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "modify comment  success", data))
    }
    static  deleteComment = async (req: Request, res: Response, next: NextFunction) =>{
        const postId = req.get("postId") as unknown as number
        const userId = req.userId 
        const commentId = parseInt(req.params.commentId) 
        const data = await FeedService.deleteComment(commentId,userId, postId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "delete comment  success", data))
    }

    static  getCommentsWithUserDetails = async (req: Request, res: Response, next: NextFunction) =>{
        const postId = req.get("postId") as unknown as number
        const data = await FeedService.getCommentsWithUserDetails(postId)
        return res.status(statusCode.OK).json(new HttpResponse(statusCode.CREATED, "get data success", data))
    }

}