import { Router } from "express";
import { asyncHandler } from "../utils/authKeyToken";
import FeedController from "../controllers/feed.controller";
import upload from "../middlewares/multer";
import uploadMultipleFiles from "../utils/FileUploader";
import authenticationToken from "../middlewares/authToken";

const feedRouter = Router()
feedRouter.get('/getPostOfUser/:userId', asyncHandler(FeedController.getPostOfUser))
feedRouter.get('/getLikeOfPost', asyncHandler(FeedController.getLikeOfPost))
feedRouter.get('/getComment',  asyncHandler(FeedController.getCommentsWithUserDetails))
feedRouter.use(authenticationToken)
feedRouter.post('/createPost', upload.array("images"), uploadMultipleFiles, asyncHandler(FeedController.createPost))
feedRouter.patch('/updatePost', upload.array("images"), uploadMultipleFiles, asyncHandler(FeedController.updatePost))
feedRouter.post('/deletePost', asyncHandler(FeedController.deletePost))
feedRouter.post('/likePost', asyncHandler(FeedController.likePost))
feedRouter.post('/unlikePost', asyncHandler(FeedController.unlikePost))
feedRouter.post('/sharePost', asyncHandler(FeedController.sharePost))
feedRouter.post('/unsharePost', asyncHandler(FeedController.unsharePost))
feedRouter.post('/commentPost', asyncHandler(FeedController.commentPost))
feedRouter.post('/modifyComment/:commentId', asyncHandler(FeedController.modifyComment))
feedRouter.post('/deleteComment/:commentId', asyncHandler(FeedController.deleteComment))




export default feedRouter