import express, {Express, Request } from 'express';
import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan'
import compression from "compression";
import errorHandler from './middlewares/error-handle';
import authRouter from './routes/auth.route'
import userRouter from './routes/user.route';
import KafkaConfig from './utils/kafka';
import UserService from './services/user.service';
export default function expressApp (app: Express) {
    app.use(cors({origin:'*'}))
    app.use(express.json());
    app.use(morgan("dev"))
    app.use(helmet())
    app.use(compression());
    app.use(express.urlencoded({ extended: true }))

    app.use('/auth', authRouter)
    app.use('/', userRouter)
    KafkaConfig.startKafkaConsumer(UserService)
    
    app.use(errorHandler)
}

