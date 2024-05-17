import axios from "axios";
import HttpException from "../core/httpException";
import statusCode from "../core/statusCode";
import AppDataSource from "../db/dataSource";
import { getUser } from "../utils/actions";
import Chat from "../entities/Chat.entity";


export default class ChatService {
    static createChat = async (targetUserId: number, currentUserId: number) => {
        try {
            if (targetUserId === currentUserId) throw new HttpException(statusCode.FORBIDDEN, "access denied");
            const currentUser = await getUser(currentUserId);
            if(!currentUser) throw new HttpException(statusCode.NOT_FOUND, "USER not found");
            const targetUser = await getUser(targetUserId);
            if(!targetUser) throw new HttpException(statusCode.NOT_FOUND, "USER not found");
            const chatRepo = await AppDataSource.getRepository(Chat);
            const bothChat = await chatRepo.findOne({
                where: {
                    user1Id: currentUserId,
                    user2Id: targetUserId,
                },
            });

            if (!bothChat) {
                const createChat = chatRepo.create({
                    user1Id: currentUserId,
                    user2Id: targetUserId,
                });
                await chatRepo.save(createChat);


                return {
                    currentUser,
                    targetUser,
                    createChat,
                };
            } 
            throw new HttpException(statusCode.FORBIDDEN, "access denied");
        } catch (error: any) {
            console.error('CREATE CHAT USER ERROR:', error);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Create Chat User failed: ${error.message}`
            );
        }
    };

    static getChat = async (targetUserId: number, currentUserId: number) => {
        try {
            if (targetUserId === currentUserId) throw new HttpException(statusCode.FORBIDDEN, "access denied");
            const currentUser = await getUser(currentUserId);
            if(!currentUser) throw new HttpException(statusCode.NOT_FOUND, "USER not found");
            const targetUser = await getUser(targetUserId);
            if(!targetUser) throw new HttpException(statusCode.NOT_FOUND, "USER not found");
            const chatRepo = await AppDataSource.getRepository(Chat);
            const bothChat = await chatRepo.findOne({
                where: {
                    user1Id: currentUserId,
                    user2Id: targetUserId,
                },
            });

            if (!bothChat)  throw new HttpException(statusCode.NOT_FOUND, "USER NO CHAT");
            return bothChat
        } catch (error: any) {
            console.error('GET CHAT USER ERROR:', error);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Get Chat User failed: ${error.message}`
            );
        }
    };
    
}
