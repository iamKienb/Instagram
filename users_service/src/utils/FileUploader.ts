import express, { NextFunction, Response, Request } from 'express'
import cloudinary from '../configs/cloudinary';
import asyncHandler from 'express-async-handler'
import multer from 'multer';

const uploadMultipleFiles = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as any ; // Sử dụng khi các file được gửi lên là một mảng
        const userId = req.userId; // Giả sử ID người dùng được truyền qua URL hoặc một phần của request
        const folderName = `images/${userId}`; // Thư mục sẽ dựa trên ID người dùng
        const results = [] as any ;

        for (const file of files) {
            const path = file.path.toString(); // Đường dẫn tới file
            const result = await cloudinary.uploader.upload(path, {
                folder: folderName
            });
            results.push({
                image_url: result.secure_url,
                thumb_url: await cloudinary.url(result.public_id, {
                    height: 100,
                    width: 100,
                    format: 'jpg'
                })
            });
        }
        return results;
    } catch (err ) {
        console.log('Error uploading image:', err);
        // Không nên trả về error trong cùng một mảng với results vì sẽ gây rối loạn dữ liệu trả về.
        // Thay vào đó, bạn có thể xử lý lỗi ở đây hoặc trả về lỗi cho client.
        res.status(500).send(`Internal Server Error : UploadFile Error ${err}`);
    }
});
export default  uploadMultipleFiles