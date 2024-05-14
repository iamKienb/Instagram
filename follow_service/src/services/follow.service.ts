import axios from "axios";
import HttpException from "../core/httpException";
import statusCode from "../core/statusCode";
import AppDataSource from "../db/dataSource";
import { Follow } from "../entities/Follow.entity";
import { getUser } from "../utils/actions";


export default class FollowService {
    static followUser = async (targetUserId: number, currentUserId: number) => {
        try {
            if (targetUserId === currentUserId) {
            }

            const followRepo = await AppDataSource.getRepository(Follow);
            const userFollowUser = await followRepo.findOne({
                where: {
                    userFollowedId: targetUserId,
                    userFollowingId: currentUserId,
                },
            });

            if (!userFollowUser) {
                const followResult = followRepo.create({
                    userFollowedId: targetUserId,
                    userFollowingId: currentUserId,
                });
                await followRepo.save(followResult);
                const action = "follow";

                return {
                    currentUserId,
                    targetUserId,
                    action,
                };
            } else {
                await followRepo.remove(userFollowUser);
                const action = "unfollow";
                return {
                    currentUserId,
                    targetUserId,
                    action,
                };
            }
        } catch (error: any) {
            console.error('ERROR FOLLOW USER:', error);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Follow User failed: ${error.message}`
            );
        }
    };
    static getFollowingOfUser = async (currentUserId: number) => {
        //Ví dụ, nếu người dùng có ID 1 theo dõi người dùng có ID 2, userFollowingId sẽ là 1 và userFollowedId sẽ là 2.
        try {
            const followRepo = await AppDataSource.getRepository(Follow);
            const user = await getUser(currentUserId);
            const getFollowingOfUser = await followRepo
                .createQueryBuilder("follow")
                .select("follow.userFollowedId")
                .where("follow.userFollowingId = :currentUserId", { currentUserId })
                .orderBy("follow.createdDate", "DESC")
                .getMany();
            const userRequests = getFollowingOfUser.map((user) => {
                return axios
                    .get(`http://localhost:8001/getProfile/${user.userFollowedId}`, {
                        method: "GET",
                    })
                    .then((response) => ({
                        userId: response.data.id,
                        username: response.data.username,
                        firstName: response.data.firstName,
                        profilePicture: response.data.profilePicture,
                        lastName: response.data.lastName,
                    }))
                    .catch((error) => {
                        console.error(
                            `Error fetching user for userId ${user.userFollowedId}:`,
                            error
                        );
                        return { user: null }; // Trả về comment mà không có thông tin người dùng nếu gọi API thất bại
                    });
            });

            // Đợi tất cả các lời gọi API hoàn thành
            const userFollowing = await Promise.all(userRequests);
            return {
                user,
                userFollowing,
            };

        } catch (error: any) {
            console.error('ERROR GET FOLLOWING OF USER:', error);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Get Following OF User failed: ${error.message}`
            )
        }

    };

    static getFollowedOfUser = async (currentUserId: number) => {
        //Ví dụ, nếu người dùng có ID 1 theo dõi người dùng có ID 2, userFollowingId sẽ là 1 và userFollowedId sẽ là 2.
        try {
            const followRepo = await AppDataSource.getRepository(Follow);
            const user = await getUser(currentUserId);
            const getFollowedOfUser = await followRepo
                .createQueryBuilder("follow")
                .select("follow.userFollowingId")
                .where("follow.userFollowedId = :currentUserId", { currentUserId })
                .orderBy("post.createdDate", "DESC")
                .getMany();
            const userRequests = getFollowedOfUser.map((user) => {
                return axios
                    .get(`http://localhost:8001/getProfile/${user.userFollowingId}`, {
                        method: "GET",
                    })
                    .then((response) => ({
                        userId: response.data.id,
                        username: response.data.username,
                        firstName: response.data.firstName,
                        profilePicture: response.data.profilePicture,
                        lastName: response.data.lastName,
                    }))
                    .catch((error) => {
                        console.error(
                            `Error fetching user for userId ${user.userFollowedId}:`,
                            error
                        );
                        return { user: null }; // Trả về comment mà không có thông tin người dùng nếu gọi API thất bại
                    });
            });

            // Đợi tất cả các lời gọi API hoàn thành
            const userFollowed = await Promise.all(userRequests);
            return {
                user,
                userFollowed,
            };

        } catch (error: any) {
            console.error('ERROR GET FOLLOWING OF USER:', error);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Get Followed OF User failed: ${error.message}`
            )
        }

    };

    static getOrderPayload = async (data: any, event: string) => {
        if (data) {
            const payload = {
                event: event,
                data: data,
            };
            return payload;
        }
        throw new HttpException(statusCode.BAD_REQUEST, "no order is available");
    };
}
