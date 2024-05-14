import { Router } from "express";
import { asyncHandler } from "../utils/authKeyToken";

import upload from "../middlewares/multer";
import uploadMultipleFiles from "../utils/FileUploader";
import authenticationToken from "../middlewares/authToken";
import StoryController from "../controllers/story.controller";

const storyRouter = Router()
storyRouter.get('/getPostOfUser/:userId', asyncHandler(StoryController.getStoryOfUser))
storyRouter.get('/getLikeOfStory', asyncHandler(StoryController.getLikeOfStory))
storyRouter.get('/getComment',  asyncHandler(StoryController.getCommentsWithUserDetails))
storyRouter.use(authenticationToken)
storyRouter.post('/createStory', upload.array("images"), uploadMultipleFiles, asyncHandler(StoryController.createStory))
storyRouter.post('/updateStory', upload.array("images"), uploadMultipleFiles, asyncHandler(StoryController.updateStory))
storyRouter.post('/deleteStory', asyncHandler(StoryController.deleteStory))
storyRouter.post('/likeStory', asyncHandler(StoryController.likeStory))
storyRouter.post('/unlikeStory', asyncHandler(StoryController.unlikeStory))
storyRouter.post('/commentStory', asyncHandler(StoryController.commentStory))

export default storyRouter