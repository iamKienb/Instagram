import dotenv from 'dotenv'
dotenv.config()
export default{
    port: process.env.PORT!,
    db:{
        host: process.env.DB_HOST!,
        port: process.env.DB_PORT!,
        username: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_DATABASE!
    },
    jwt: {
        private_key:process.env.KEY_SECRET!,
    },
    kafka:{
        userTopic: process.env.USER_TOPIC!
    }
}