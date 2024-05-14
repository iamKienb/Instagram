import config from '../configs/config'
import {DataSource} from 'typeorm'
import Like from '../entities/Like.entity'
import Post from '../entities/Post.entity'
import Share from '../entities/Share.entity'
import Comment from '../entities/Comment.entity'



const AppDataSource = new DataSource({
    type:"postgres",
    host:config.db.host,
    port: +config.db.port,
    username:config.db.username,
    password:config.db.password,
    database:config.db.database,
    logging:true,
    synchronize:true,
    entities:[Like, Post, Share, Comment],
    subscribers:[]

})

export default AppDataSource