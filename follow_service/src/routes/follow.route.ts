import { Router } from "express";
import { asyncHandler } from "../utils/authKeyToken";

import authenticationToken from "../middlewares/authToken";
import FollowController from "../controllers/follow.controller";

const followRouter = Router()
followRouter.get('/getFollowing/:userId', asyncHandler(FollowController.getFollowingOfUser))
followRouter.get('/getFollowed/:userId', asyncHandler(FollowController.getFollowedOfUser))
followRouter.use(authenticationToken)
followRouter.post('/followUser/:userId',  asyncHandler(FollowController.followUser))




export default followRouter