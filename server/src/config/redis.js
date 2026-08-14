import IORedis from "ioredis"

const connection = new IORedis({
    host : "127.0.0.1" ,
    port : 6379 ,
    maxRetriesPerRequest :null
})

connection.on("connect" ,() => {
    console.log("Redis connected")
})

connection.on("error", (err) => {
    console.log("Reddis error : ", err)
})

export default connection ;