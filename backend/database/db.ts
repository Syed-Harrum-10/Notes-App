const {Pool} = require("pg")
require('dotenv').config()


const pool = new Pool({
    host: process.env.hostname,
    database: process.env.database,
    port: process.env.port,
    user: process.env.username,
    password: process.env.password
})

pool.on('connect', ()=>{
    console.log('Postgres is connted')
})

pool.on('error', ()=> {
    console.log('Something went wrong in the postgres')
})

module.exports = pool