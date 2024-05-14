import { Repository } from "typeorm";
import HttpException from "../core/httpException";
import statusCode from "../core/statusCode";
import AppDataSource from "../db/dataSource";
import Post from "../entities/Post.entity";
import Like from "../entities/Like.entity";
import Share from "../entities/Share.entity";
import Comment from "../entities/Comment.entity";
import axios from "axios";
import { getUser } from "../utils/actions";

export default class FeedService {
    static createPost = async (captions: string, images: any, userId: number) => {
        try {
            const postRepo: Repository<Post> = await AppDataSource.getRepository(
                Post
            );
            const newPost: Post = await new Post();
            newPost.captions = captions;
            newPost.images = images;
            newPost.userId = userId;
            await postRepo.save(newPost);
            return newPost;
        } catch (error: any) {
            console.log("CREATE POST ERROR", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Create Post failed: ${error.message}`
            );
        }
    };

    static UpdatePost = async (captions: string, images: any, userId: number, postId:number) => {
        try {
            const postRepo: Repository<Post> = await AppDataSource.getRepository(
                Post
            );
            
            const findPost = await postRepo.findOne({where:{id: postId, userId: userId}})
            if(!findPost)throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const result = await AppDataSource.transaction(async (tw) =>{
                await tw.createQueryBuilder()
                    .update(Post)
                    .set({
                        captions: captions,
                        images: images,
                    })
                    .where("id = :postId", {postId})
                    .execute();
                
                const postUpdate = await tw.createQueryBuilder()
                    .select(["post.cations", "post.images", "post.likeCounts", "post.commentCounts", "post.createdDate"])
                    .from(Post,"post")
                    .where("id = :postId", {postId})
                    .getOne();

                return postUpdate
            })

            return result
        } catch (error: any) {
            console.log("UPDATE POST ERROR", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Update Post failed: ${error.message}`
            );
        }
    };

    static deletePost = async (userId: number, postId:number) => {
        try{
            const postRepo = await AppDataSource.getRepository(Post)
            const findPost = await postRepo.findOne({where: {id: postId}})
            if (!findPost) throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const deletePost = await postRepo.createQueryBuilder("post")
            .delete()
            .from(Post)
            .where("id = :postId AND userId = :userId", {postId,userId})
            .execute()
            return deletePost
        }catch(error: any) {
            console.log("DELETE POST ERROR", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Delete Post failed: ${error.message}`
            );
        }
    }

    
    static getPostsOfUser = async (userId: number) => {
        try {
            const postRepo = AppDataSource.getRepository(Post);
            const posts = await postRepo
            .createQueryBuilder("post")
            .select(["post.cations", "post.images", "post.likeCounts", "post.commentCounts", "post.createdDate"])
            .where("post.userId = :userId", { userId })
            .orderBy("post.createdDate", "DESC")
            .getMany();
            const userRequests = posts.map(post => {
                return axios.get(`http://localhost:8001/getProfile/${post.userId}`, {
                    method: "GET"
                }).then(response => ({
                    ...post,
                    user: response.data
                })).catch(error => {
                    console.error(`Error fetching user for userId ${post.userId}:`, error);
                    return { ...post, user: null }; // Trả về comment mà không có thông tin người dùng nếu gọi API thất bại
                });
            });
    
            // Đợi tất cả các lời gọi API hoàn thành
            const getPostsWithUsers = await Promise.all(userRequests);
            
            return getPostsWithUsers;
        } catch (error: any) {
            console.log("GET POST OF USERS", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Create Post failed: ${error.message}`
            );
        }
    };




    static getLikeOfPost = async (postId: number) =>{
        try{
            const postRepo = AppDataSource.getRepository(Post).find({ where: { id: postId } });
            if (!postRepo) throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const likeRepo = AppDataSource.getRepository(Like)
            const likeOfPost = await likeRepo.createQueryBuilder('like')
            .select(["like.userId, like.postId"])
            .where("like.postId = :postId", {postId})
            .getMany()

            const userRequests = await likeOfPost.map(like => {
                return axios.get(`http://localhost:8001/getProfile/${like.userId}`,{
                    method: 'GET',
                })
                .then(response =>({
                    ...like,
                    user: response.data
                })).catch(error => {
                    console.error(`Error fetching user for userId ${like.userId}:`, error);
                    return { ...like, user: null }; // Trả về comment mà không có thông tin người dùng nếu gọi API thất bại
                })
            })
            const likePostWithUsers = await Promise.all(userRequests);
            return likePostWithUsers
        } catch (error :any) {
            console.log("GET Like OF USERS In Post", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error GET Like OF USERS In Post failed: ${error.message}`
            );
        }
    }


    static likePost = async (userId: number, postId: number) => {
        try {
            const postRepo = AppDataSource.getRepository(Post).find({ where: { id: postId } });
            if (!postRepo) throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const likeRepo:Repository<Like> = AppDataSource.getRepository(Like);
            const existingLike = await likeRepo.findOne({
                where: { userId, postId },
            });
            if (existingLike) throw new HttpException(statusCode.OK, "đã like ");
            
            await AppDataSource.transaction(async (tw) => {
                await tw
                    .createQueryBuilder()
                    .insert()
                    .into(Like)
                    .values({ userId, postId })
                    .execute();
                await tw
                    .createQueryBuilder()
                    .update(Post)
                    .set({
                        likeCounts: () => "likeCounts + 1",
                        // lastLikedBy: userId,  // Giá trị người dùng vừa thích bài viết
                        // lastLikedAt: new Date()  // Ngày giờ thích bài viết} )
                    })
                    .where("id = :postId", { postId })
                    .execute();
            });
            return {
                post:postRepo,
                userLikePost: existingLike
            }
        } catch (error: any) {
            console.log("LIKE POST FAIL", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Like Post failed: ${error.message}`
            );
        }
    };

    static unLikePost = async (userId: number, postId: number) => {
        try {
            const postRepo = AppDataSource.getRepository(Post).find({ where: { id: postId } });
            if (!postRepo) throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const likeRepo = AppDataSource.getRepository(Like);
            const existingLike = await likeRepo.findOne({
                where: { userId, postId },
            });
            if (!existingLike) throw new HttpException(statusCode.OK, "chưa like ");
            await AppDataSource.transaction(async (tw) => {
                await tw
                    .createQueryBuilder()
                    .delete()
                    .from(Like)
                    .where("userId = :userId AND postId = :postId", { userId, postId })
                    .execute();

                await tw
                    .createQueryBuilder()
                    .update(Post)
                    .set({
                        likeCounts: () => "GREATEST(likeCounts - 1, 0)",
                        // lastLikedBy: userId,  // Giá trị người dùng vừa thích bài viết
                        // lastLikedAt: new Date()  // Ngày giờ thích bài viết} )
                    })
                    .where("id = :postId", { postId })
                    .execute();
            });

            return {
                post:postRepo,
                userUnLikePost: existingLike.userId
            }
        } catch (error: any) {
            console.log("UN LIKE POST FAIL", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error UN Like Post failed: ${error.message}`
            );
        }
    };


    static sharePost = async (userId: number, postId: number) => {
        try {
            const getPost = AppDataSource.getRepository(Post).findOne({ where: { id: postId } })
            if (!getPost) throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const shareRepo = await AppDataSource.getRepository(Share)
            const newShare = await shareRepo.create({ userId, postId, createdDate: new Date() })
            await shareRepo.save(newShare)
            return {
                post: getPost,
                userSharePost: newShare.userId
            }
        } catch (error: any) {
            console.log("SHARE  POST FAIL", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Share  Post failed: ${error.message}`
            );
        }
    }

    static UnSharePost = async (userId: number, postId: number) => {
        try {
            const getPost = AppDataSource.getRepository(Post).findOne({ where: { id: postId } })
            if (!getPost) throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const shareRepo = AppDataSource.getRepository(Share)
            const SharePost = await shareRepo.findOne({ where: { postId, userId } })
            if (!SharePost) {
                throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            }

            await AppDataSource.transaction(async (tm) => {
                // Xóa bản ghi chia sẻ bài viết
                await tm
                    .createQueryBuilder()
                    .delete()
                    .from(Share)
                    .where("userId = :userId AND postId = :postId", { userId, postId })
                    .execute();
            });
            return {
                post: getPost,
                userUnSharePost: SharePost.userId
            }
        } catch (error: any) {
            console.log("UN SHARE  POST FAIL", error.message);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Un Share  Post failed: ${error.message}`
            );
        }
    }

    static getCommentsWithUserDetails = async (postId: number) => {
        try {
            const commentRepository = AppDataSource.getRepository(Comment);
            const comments = await commentRepository
                .createQueryBuilder('c')
                .select(['c.id', 'c.text', 'c.createdAt', 'c.userId'])
                .where('c.postId = :postId', { postId })
                .getMany();
            // Bây giờ, lấy thông tin người dùng cho mỗi bình luận
            const userRequests = comments.map(comment => {
                return axios.get(`http://localhost:8001/getProfile/${comment.userId}`, {
                    method: "GET"
                }).then(response => ({
                    ...comment,
                    user: response.data
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

    static commentPost = async (userId: number, postId: number, text:string) => {
        try{
            const getPost = AppDataSource.getRepository(Post).findOne({ where: { id: postId } })
            if (!getPost) throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const result =await AppDataSource.transaction( async (tw) =>{
                const newComment = await tw.createQueryBuilder()
                .insert()
                .into(Comment)
                .values({userId, postId , text})
                .returning("*")
                .execute();
                
    
                await tw.createQueryBuilder()
                .update(Post)
                .set({
                    commentCounts : () => "commentCounts + 1"
                })
                .where("id = :postId" ,{postId})
                .execute();

                const getPostUpdate = await tw.createQueryBuilder()
                .select(["post.cations", "post.images", "post.likeCounts", "post.commentCounts", "post.createdDate"])
                .from(Post, "post")
                .where("id = :postId", { postId })
                .getOne()

                return {
                    newComment,
                    getPostUpdate
                }
            })
          
            return {
                post: result.getPostUpdate,
                userComment: result.newComment.generatedMaps[0]
            }

        }catch(error:any){
            console.error('COMMENT POST ERROR:', error);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error  Comment  Post failed: ${error.message}`
            );
        }


    }

    static modifyComment = async (commentId:number, userId: number, postId: number, text:string) => {
        try{
            const getPost = AppDataSource.getRepository(Post).findOne({ where: { id: postId } })
            if (!getPost) throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const commentRepo = await AppDataSource.getRepository(Comment)
            const updateComment = await commentRepo.findOne({where:{id: commentId, userId:userId}});
            if(!updateComment) throw new HttpException(  statusCode.NOT_FOUND, "Comment not found")
            updateComment.text = text
            const user = await getUser(updateComment.userId)
            await commentRepo.save(updateComment)
            return {
                post: getPost,
                user: user,
                comment: updateComment.text
            }    

        }catch(error: any){
            console.error('MODIFY COMMENT IN POST ERROR:', error);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Modify Comment in Post failed: ${error.message}`
            );
        }
       
    }

    static deleteComment = async (commentId:number, userId: number, postId: number) => {
        try{
            const post = await AppDataSource.getRepository(Post).findOne({where : {id: postId}})
            if (!post) throw new HttpException(statusCode.NOT_FOUND, "không có bài viết ");
            const comment = await AppDataSource.getRepository(Comment).findOne({where : {id: commentId}})
            if (!comment) throw new HttpException(statusCode.NOT_FOUND, "không có comment");
            await AppDataSource.transaction(async (tw) =>{
                await tw.createQueryBuilder()
                .delete()
                .from(Comment)
                .where("id = :commentId", {commentId})
                .execute();
                
                await tw.createQueryBuilder()
                .update(Post)
                .set({
                    commentCounts : () => "GREATEST(likeCounts - 1, 0)",
                })
                .execute();
            })
            return post
        }catch(error : any){
            console.error('DELETE COMMENT IN POST ERROR:', error);
            throw new HttpException(
                statusCode.INTERNAL_SERVER_ERROR,
                `Internal Server Error Delete Comment in Post failed: ${error.message}`
            );
        }
    }


}
