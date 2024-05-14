import config from "../configs/config"
import HttpException from "../core/httpException"
import statusCode from "../core/statusCode"
import AppDataSource from "../db/dataSource"
import { User } from "../entities/User.entity"
import { Roles, UserType } from "../typings/types"
import { generateToken } from "../utils/authKeyToken"
import { hashPassword, validatePassword } from "../utils/handlePassword"

export default class AuthService {
    static signUp = async (confirmPassword:string, body: UserType) =>{
        try{
            const userRepo = AppDataSource.getRepository(User)
            const existingUser = await userRepo.findOneBy({username: body.username})
            if(existingUser) throw new HttpException(statusCode.BAD_REQUEST, "Tên đăng nhập đã tồn tại")
            const existingEmail  = await userRepo.findOneBy({email: body.email})
            if(existingEmail) throw new HttpException(statusCode.BAD_REQUEST, "Email đã tồn tại")
            const existingPhone  = await userRepo.findOneBy({phone: body.phone})
            if(existingPhone) throw new HttpException(statusCode.BAD_REQUEST, "Email đã tồn tại")
            if(body.password !== confirmPassword) throw new HttpException(statusCode.BAD_REQUEST, "Xác nhận mật khẩu không chính xác")
            body.password = await hashPassword(body.password)
            const newUser = await userRepo.create({
                ...body,
                role:Roles.USER
            })
            console.log("NEW USER",newUser)
            if(!newUser) throw new HttpException(statusCode.NOT_FOUND, "User created fail")
            await userRepo.save(newUser)
            return newUser

        }catch(error : any){
            console.log("CREATE USER ERROR", error.message)
            throw new HttpException(statusCode.INTERNAL_SERVER_ERROR, `Internal Server Error Create User Error: ${error.message}`)
        }
    }
    static signIn = async(username:string, password:string) =>{
        try{
            if(!username || !password){
                throw new HttpException(statusCode.FORBIDDEN, "Username or password is required")
            }
            const userRepo = await AppDataSource.getRepository(User)
            const user = await userRepo.findOne({ where: {username}})
            if(!user) throw new HttpException(statusCode.NOT_FOUND , "Tên đăng nhập không đúng")
            if(user.isDeleted === true) throw new HttpException(statusCode.NOT_FOUND , "Tên đăng nhập không đúng")
            const checkPassword = await validatePassword(password, user.password)
            if(!checkPassword) throw new HttpException(statusCode.BAD_REQUEST, "Mật khẩu không đúng")
            const tokens = await generateToken({id: user.id, email: user.email}, config.jwt.private_key)
            if(!tokens){
                throw new HttpException(statusCode.FORBIDDEN, "Token Forbidden")
            }
            return {
                user,
                token:{
                    accessToken : tokens.accessToken,
                    refreshToken : tokens.refreshToken
                }
            }


        }catch(error : any){
            console.log("LOGIN USER ERROR", error.message)
            throw new HttpException(statusCode.INTERNAL_SERVER_ERROR, `Internal Server Error Login User Error: ${error.message}`)
        }
    }
}