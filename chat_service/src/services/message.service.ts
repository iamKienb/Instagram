import axios from "axios";
import HttpException from "../core/httpException";
import statusCode from "../core/statusCode";
import AppDataSource from "../db/dataSource";
import { getUser } from "../utils/actions";
import Message from "../entities/Message.entity";
import { Repository } from "typeorm";


export default class MessageService {
    static addMessage = async (messageRequest:{text:string, chatId:number}, userId: number) => {
        try {
            const messageRepo: Repository<Message> = await AppDataSource.getRepository(Message);
            const newMessage: Message = await messageRepo.create({
                chatId: messageRequest.chatId,
                senderId: userId,
                text: messageRequest.text
            })
            await messageRepo.save(newMessage);
            return newMessage
        } catch (error: any) {
            console.error('ERROR CREATE MESSAGE USER:', error);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Create Message User failed: ${error.message}`
            );
        }
    };

    static getMessage = async (userId: number) => {
        try {
            const messageRepo: Repository<Message> = await AppDataSource.getRepository(Message);
            const newMessage: Message[] = await messageRepo.find({where: {chatId: userId}})
            if(newMessage.length === 0) throw new HttpException(statusCode.NOT_FOUND, "message not found")
            return newMessage
        } catch (error: any) {
            console.error('ERROR GET MESSAGE USER:', error);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Get Message User failed: ${error.message}`
            );
        }
    };
    
    
}
