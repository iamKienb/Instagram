import { Router } from "express";

import AuthController from "../controllers/auth.controller";
import { asyncHandler } from "../utils/authKeyToken";


const authRouter = Router()

authRouter.post('/signUp', asyncHandler(AuthController.signUp))
authRouter.post('/signIn', asyncHandler(AuthController.signIn))


export default authRouter