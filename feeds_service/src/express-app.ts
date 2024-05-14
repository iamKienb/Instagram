import express, {Express, Request } from 'express';
import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan'
import compression from "compression";
import errorHandler from './middlewares/error-handle';
import feedRouter from './routes/feed.route';

export default function expressApp (app: Express) {
    app.use(cors({origin:'*'}))
    app.use(express.json());
    app.use(morgan("dev"))
    app.use(helmet())
    app.use(compression());
    app.use(express.urlencoded({ extended: true }))

    app.use('/', feedRouter)



    app.use(errorHandler)
}

