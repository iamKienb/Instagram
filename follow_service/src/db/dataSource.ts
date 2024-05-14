import config from '../configs/config'
import {DataSource} from 'typeorm'
import { Follow } from '../entities/Follow.entity'



const AppDataSource = new DataSource({
    type:"postgres",
    host:config.db.host,
    port: +config.db.port,
    username:config.db.username,
    password:config.db.password,
    database:config.db.database,
    logging:true,
    synchronize:true,
    entities:[Follow],
    subscribers:[]

})

export default AppDataSource