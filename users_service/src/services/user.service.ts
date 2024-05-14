import { Repository } from "typeorm"
import HttpException from "../core/httpException"
import statusCode from "../core/statusCode"
import AppDataSource from "../db/dataSource"
import { User } from "../entities/User.entity"
import { UserType } from "../typings/types"
import { hashPassword } from "../utils/handlePassword"

export default class UserService {
    static getUser = async (userId: number) =>{
        try{
            const userRepo = AppDataSource.getRepository(User)
            const user = await userRepo.findOne({where : {id: userId}})
            if(!user) throw new HttpException(statusCode.NOT_FOUND, "User not found")
            const {password, ...data} = user
            return data
        }catch(error: any){
            console.log("GET USER ERROR", error.message)
            throw new HttpException(statusCode.INTERNAL_SERVER_ERROR, `Internal Server Error Get Data Error: ${error.message}`)
        }

    }
    static getAllUsers = async () =>{
        try{
            const userRepo = AppDataSource.getRepository(User)
            const user = await userRepo.find({
                select:{
                    id: true,
                    username:true,
                    email:true,
                    firstName:true,
                    lastName:true,
                    profilePicture:true,
                    coverPicture:true
                }
            })
            if(!user) throw new HttpException(statusCode.NOT_FOUND, "User not found")
            return user
        }catch(error: any){
            console.log("GET ALL USER ERROR", error.message)
            throw new HttpException(statusCode.INTERNAL_SERVER_ERROR, `Internal Server Error Get Data Error: ${error.message}`)
        }
    }
    static updateUser = async (userId:number, userRequest: UserType) =>{
        try{
            const userRepo = await AppDataSource.getRepository(User)
            const user = await userRepo.findOne({where: {id: userId}})
            if(!user) throw new HttpException(statusCode.NOT_FOUND, "User not found")
            userRequest.password = await hashPassword(userRequest.password)
            await userRepo.merge(user, userRequest)
            await userRepo.save(user) 
            const {password, ...data} = user
            return data

        }catch(error: any){
            console.log("UPDATE USER ERROR", error.message)
            throw new HttpException(statusCode.INTERNAL_SERVER_ERROR, `Internal Server Error Update Data Error: ${error.message}`)
        }
    }
    static deleteUser = async (userId:number) =>{
        try{
            const userRepo = await AppDataSource.getRepository(User)
            const user = await userRepo.findOne({where: {id: userId}})
            if(!user) throw new HttpException(statusCode.NOT_FOUND, "User not found")
            await userRepo.delete(user.id)
            return user

        }catch(error: any){
            console.log("DELETE USER ERROR", error.message)
            throw new HttpException(statusCode.INTERNAL_SERVER_ERROR, `Internal Server Error Delete Data Error: ${error.message}`)
        }
    }
    static searchUser = async (keyWord:string) =>{
        try{
            const userRepo =  AppDataSource.getRepository(User)
            const users = userRepo.createQueryBuilder("user")
            .select(["user.firstName", "user.lastName", "user.username", "user.profilePicture"])
            .where("user.firstName LIKE :keyWord", { keyWord: `%${keyWord}%` })
            .orWhere("user.lastName LIKE :keyWord", { keyWord: `%${keyWord}%` })
            .orWhere("user.username LIKE :keyWord", { keyWord: `%${keyWord}%` })
            .getMany();
            return users
        }
        catch(error: any){
            console.log("Search USER ERROR", error.message)
            throw new HttpException(statusCode.INTERNAL_SERVER_ERROR, `Internal Server Error User Not Found: ${error.message}`)
        }
    }

    static updateFollowUserCounts  = async(data: any) =>{
        try{
            const { currentUserId, targetUserId, action } = data;

            const userRepository:Repository<User>  = await AppDataSource.getRepository(User);
            const currentUser= await userRepository.findOne({where:{ id: currentUserId }});
            if(!currentUser) throw new HttpException(statusCode.NOT_FOUND, `User Not Found`);
            const targetUser = await userRepository.findOneBy({ id: targetUserId });
            if(!targetUser) throw new HttpException(statusCode.NOT_FOUND, `User Not Found`);
        
            if (action === 'follow') {
                currentUser.followingCount += 1;
                targetUser.followerCount += 1;
            } else if (action === 'unfollow') {
                currentUser.followingCount -= 1;
                targetUser.followerCount -= 1;
            }
        
            await userRepository.save([currentUser, targetUser]);
            return currentUser
        }catch(error: any){
            console.log("UPDATE USER FOLLOW ERROR", error.message)
            throw new HttpException(statusCode.INTERNAL_SERVER_ERROR, `Internal Server Error Update User Follow Error: ${error.message}`)
        }


    }

    static async subscribeEvents(payload:string){
        console.log("User get payload from product: ",payload)
        const { event, data }: { event: string; data: any } = JSON.parse(payload)   
        switch(event){
            case 'UPDATE_FOLLOW_USER_COUNT':
                UserService.updateFollowUserCounts(data)
                break;
            default:
                break;
        }
    }
}