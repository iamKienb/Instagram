import { Router } from "express";

import AuthController from "../controllers/auth.controller";
import { asyncHandler } from "../utils/authKeyToken";
import authenticationToken from "../middlewares/authToken";
import UserController from "../controllers/user.controller";


const userRouter = Router()
userRouter.get('/getProfile/:userId', asyncHandler(UserController.getUser))
userRouter.get('/', asyncHandler(UserController.getAllUsers))
userRouter.get('/search-user', asyncHandler(UserController.searchUser))
userRouter.use(authenticationToken)
userRouter.patch('/update/:userId', asyncHandler(UserController.updateUser))
userRouter.delete('/delete/:userId', asyncHandler(UserController.deleteUser))



export default userRouter