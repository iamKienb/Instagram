import { Repository } from "typeorm";
import HttpException from "../core/httpException";
import statusCode from "../core/statusCode";
import AppDataSource from "../db/dataSource";
import Like from "../entities/Like.entity";
import Comment from "../entities/Comment.entity";
import axios from "axios";
import { getUser } from "../utils/actions";
import Story from "../entities/Story.entity";

export default class StoryService {
    static createStory = async (captions: string, images: any, userId: number) => {
        try {
            const StoryRepo: Repository<Story> = await AppDataSource.getRepository(
                Story
            );
            const newStory: Story = await new Story();
            newStory.captions = captions;
            newStory.images = images;
            newStory.userId = userId;
            await StoryRepo.save(newStory);
            return newStory;
        } catch (error: any) {
            console.log("CREATE Story ERROR", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Create Story failed: ${error.message}`
            );
        }
    };

    static updateStory = async (captions: string, images: any, userId: number, storyId:number) => {
        try {
            const StoryRepo: Repository<Story> = await AppDataSource.getRepository(
                Story
            );
            
            const findStory = await StoryRepo.findOne({where:{id: storyId, userId: userId}})
            if(!findStory)throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const result = await AppDataSource.transaction(async (tw) =>{
                await tw.createQueryBuilder()
                    .update(Story)
                    .set({
                        captions: captions,
                        images: images,
                    })
                    .where("id = :storyId", {storyId})
                    .execute();
                
                const storyUpdate = await tw.createQueryBuilder()
                    .select(["story.cations", "story.images", "story.likeCounts", "story.commentCounts", "story.createdDate"])
                    .from(Story,"story")
                    .where("id = :storyId", {storyId})
                    .getOne();
                return storyUpdate
            })

            return result
        } catch (error: any) {
            console.log("UPDATE STORY ERROR", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Update Story failed: ${error.message}`
            );
        }
    };

    static deleteStory = async (userId: number, storyId:number) => {
        try{
            const StoryRepo = await AppDataSource.getRepository(Story)
            const findStory = await StoryRepo.findOne({where: {id: storyId}})
            if (!findStory) throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const deleteStory = await StoryRepo.createQueryBuilder("Story")
            .delete()
            .from(Story)
            .where("id = :storyId AND userId = :userId", {storyId,userId})
            .execute()
            return deleteStory
        }catch(error: any) {
            console.log("DELETE STORY ERROR", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Delete Story failed: ${error.message}`
            );
        }
    }

    
    static getStoryOfUser = async (userId: number) => {
        try {
            const StoryRepo = AppDataSource.getRepository(Story);
            const stories = await StoryRepo
            .createQueryBuilder("story")
            .select(["story.cations", "story.images", "story.likeCounts", "story.commentCounts", "story.createdDate"])
            .where("story.userId = :userId", { userId })
            .orderBy("story.createdDate", "DESC")
            .getMany();
            const userRequests = stories.map(story => {
                return axios.get(`http://localhost:8001/getProfile/${story.userId}`, {
                    method: "GET"
                }).then(response => ({
                    ...story,
                    userId: response.data.id,
                    username: response.data.username,
                    firstName: response.data.firstName,
                    profilePicture: response.data.profilePicture,
                    lastName: response.data.lastName
                })).catch(error => {
                    console.error(`Error fetching user for userId ${story.userId}:`, error);
                    return { ...story, user: null }; // Trả về comment mà không có thông tin người dùng nếu gọi API thất bại
                });
            });
    
            // Đợi tất cả các lời gọi API hoàn thành
            const getStoryWithUsers = await Promise.all(userRequests);
            
            return getStoryWithUsers;
        } catch (error: any) {
            console.log("GET STORY OF USERS", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Create Story failed: ${error.message}`
            );
        }
    };




    static getLikeOfStory = async (storyId: number) =>{
        try{
            const StoryRepo = AppDataSource.getRepository(Story).find({ where: { id: storyId } });
            if (!StoryRepo) throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const likeRepo = AppDataSource.getRepository(Like)
            const likeOfStory = await likeRepo.createQueryBuilder('like')
            .select(["like.userId, like.StoryId"])
            .where("like.storyId = :storyId", {storyId})
            .getMany()

            const userRequests = await likeOfStory.map(like => {
                return axios.get(`http://localhost:8001/getProfile/${like.userId}`,{
                    method: 'GET',
                })
                .then(response =>({
                    ...like,
                    userId: response.data.id,
                    username: response.data.username,
                    firstName: response.data.firstName,
                    profilePicture: response.data.profilePicture,
                    lastName: response.data.lastName
                })).catch(error => {
                    console.error(`Error fetching user for userId ${like.userId}:`, error);
                    return { ...like, user: null }; // Trả về comment mà không có thông tin người dùng nếu gọi API thất bại
                })
            })
            const likeStoryWithUsers = await Promise.all(userRequests);
            return likeStoryWithUsers
        } catch (error :any) {
            console.log("GET Like OF USERS In STORY", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error GET Like OF USERS In Story failed: ${error.message}`
            );
        }
    }


    static likeStory = async (userId: number, storyId: number) => {
        try {
            const StoryRepo = AppDataSource.getRepository(Story).find({ where: { id: storyId } });
            if (!StoryRepo) throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const likeRepo:Repository<Like> = AppDataSource.getRepository(Like);
            const existingLike = await likeRepo.findOne({
                where: { userId, storyId },
            });
            if (existingLike) throw new HttpException(statusCode.OK, "đã like ");
            const user = await getUser(userId);
            await AppDataSource.transaction(async (tw) => {
                await tw
                    .createQueryBuilder()
                    .insert()
                    .into(Like)
                    .values({ userId, storyId })
                    .execute();
                await tw
                    .createQueryBuilder()
                    .update(Story)
                    .set({
                        likeCounts: () => "likeCounts + 1",
                        // lastLikedBy: userId,  // Giá trị người dùng vừa thích bài viết
                        // lastLikedAt: new Date()  // Ngày giờ thích bài viết} )
                    })
                    .where("id = :storyId", { storyId })
                    .execute();
            });
            return {
                story:StoryRepo,
                userLikeStory: user
            }
        } catch (error: any) {
            console.log("LIKE STORY FAIL", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Like Story failed: ${error.message}`
            );
        }
    };

    static unLikeStory = async (userId: number, storyId: number) => {
        try {
            const StoryRepo = AppDataSource.getRepository(Story).find({ where: { id: storyId } });
            if (!StoryRepo) throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const likeRepo = AppDataSource.getRepository(Like);
            const existingLike = await likeRepo.findOne({
                where: { userId, storyId },
            });
            if (!existingLike) throw new HttpException(statusCode.OK, "chưa like ");
            const user = await getUser(existingLike.userId);
            await AppDataSource.transaction(async (tw) => {
                await tw
                    .createQueryBuilder()
                    .delete()
                    .from(Like)
                    .where("userId = :userId AND storyId = :storyId", { userId, storyId })
                    .execute();

                await tw
                    .createQueryBuilder()
                    .update(Story)
                    .set({
                        likeCounts: () => "GREATEST(likeCounts - 1, 0)",
                        // lastLikedBy: userId,  // Giá trị người dùng vừa thích bài viết
                        // lastLikedAt: new Date()  // Ngày giờ thích bài viết} )
                    })
                    .where("id = :storyId", { storyId })
                    .execute();
            });

            return {
                Story:StoryRepo,
                userUnLikeStory: user
            }
        } catch (error: any) {
            console.log("UN LIKE STORY FAIL", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error UN Like Story failed: ${error.message}`
            );
        }
    };


   
    static getCommentsWithUserDetails = async (storyId: number) => {
        try {
            const commentRepository = AppDataSource.getRepository(Comment);
            const comments = await commentRepository
                .createQueryBuilder('c')
                .select(['c.id', 'c.text', 'c.createdAt', 'c.userId'])
                .where('c.storyId = :storyId', { storyId })
                .getMany();
            // Bây giờ, lấy thông tin người dùng cho mỗi bình luận
            const userRequests = comments.map(comment => {
                return axios.get(`http://localhost:8001/getProfile/${comment.userId}`, {
                    method: "GET"
                }).then(response => ({
                    ...comment,
                    userId: response.data.id,
                    username: response.data.username,
                    firstName: response.data.firstName,
                    profilePicture: response.data.profilePicture,
                    lastName: response.data.lastName
                })).catch(error => {
                    console.error(`Error fetching user for userId ${comment.userId}:`, error);
                    return { ...comment, user: null }; // Trả về comment mà không có thông tin người dùng nếu gọi API thất bại
                });
            });
    
            // Đợi tất cả các lời gọi API hoàn thành
            const commentsWithUsers = await Promise.all(userRequests);
    
            return commentsWithUsers
        } catch (error : any) {
            console.error('Error fetching comments:', error);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Get Comment of  Post failed: ${error.message}`
            );
        }
    }

    static commentStory = async (userId: number, storyId: number, text:string) => {
        try{
            const getStory = AppDataSource.getRepository(Story).findOne({ where: { id: storyId } })
            if (!getStory) throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const result =await AppDataSource.transaction( async (tw) =>{
                const newComment = await tw.createQueryBuilder()
                .insert()
                .into(Comment)
                .values({userId, storyId , text})
                .returning("*")
                .execute();
                
    
                await tw.createQueryBuilder()
                .update(Story)
                .set({
                    commentCounts : () => "commentCounts + 1"
                })
                .where("id = :storyId" ,{storyId})
                .execute();
                const getStoryUpdate = await tw.createQueryBuilder()
                .select(["story.cations", "story.images", "story.likeCounts", "story.commentCounts", "story.createdDate"])
                .from(Story, "story")
                .where("id = :storyId", { storyId })
                .getOne()
                return {
                    newComment,
                    getStoryUpdate
                }
            })
          
            return {
                Story: result.getStoryUpdate,
                userComment: result.newComment.generatedMaps[0]
            }

        }catch(error:any){
            console.error('COMMENT STORY ERROR:', error);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error  Comment  Story failed: ${error.message}`
            );
        }


    }



    


}
