import config from './configs/config'
import express, { Express, Request, Response, NextFunction} from "express";
import expressApp from './express-app';
import "reflect-metadata"
import AppDataSource from './db/dataSource';
const PORT = +config.port! || 8002
const startApp = (app:Express) =>{
    try{
        AppDataSource.initialize()
        .then(async() => {
            console.log("Database connection success!")
        })
        .catch((err) => {
            console.error("Error connect to database", err)
        })
        expressApp(app)
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
          });
    }catch(error:any){
        console.error(error);
        process.exit(1);
    }
}


startApp(express())