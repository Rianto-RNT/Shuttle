
const dotenv = require('dotenv').config({ path: './config/config.env' })
module.exports = 
{
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": "Sprint-2",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "port" : 8888,
    "dialectOptions": {
      "useUTC": false, // for reading from database
    },
    "timezone": '+07:00', // for writing to database
  },
  
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "use_env_variable" :"DATABASE_URL",
    "dialect" : "postgres",
    "protocol" : "postgres",
    "dialectOptions" : {
      "useUTC": false,
      "ssl":{
        "rejectUnauthorized" : false,
      }
    },
    "timezone": '+07:00', // for writing to database
  }
}
