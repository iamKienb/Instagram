import config from '../configs/config'
import {DataSource} from 'typeorm'

import Chat from '../entities/Chat.entity'
import Message from '../entities/Message.entity'



const AppDataSource = new DataSource({
    type:"postgres",
    host:config.db.host,
    port: +config.db.port,
    username:config.db.username,
    password:config.db.password,
    database:config.db.database,
    logging:true,
    synchronize:true,
    entities:[Chat,Message],
    subscribers:[]

})

export default AppDataSource