import { after } from "node:test";

export default{
    client:"sqlite3",
    connection:{
        filename:"./src/database/db.sqlite"
    },
    pool:{
        afterCreate:(connection:any,done:any)=>{
            connection.run("PRAGMA foreign_keys = ON",done)
            done()
        }
    },
    useNullAsDefault:true,
    migrations:{
        extensions:"ts",
        directory:"./src/database/migrations"
    },
    seeds:{
        extensions:"ts",
        directory:"./src/database/seeds"
    }

}