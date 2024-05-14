import config from '../configs/config'
import {DataSource} from 'typeorm'
import Like from '../entities/Like.entity'


import Comment from '../entities/Comment.entity'
import Story from '../entities/Story.entity'



const AppDataSource = new DataSource({
    type:"postgres",
    host:config.db.host,
    port: +config.db.port,
    username:config.db.username,
    password:config.db.password,
    database:config.db.database,
    logging:true,
    synchronize:true,
    entities:[Like, Story, Comment],
    subscribers:[]

})

export default AppDataSource