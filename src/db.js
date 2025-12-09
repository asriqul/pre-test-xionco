const mysql = require('mysql2');

const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    database:"adminToko_db",
    password:"",
});

const promisePool = pool.promise();

promisePool.getConnection()
    .then(connection => {
        console.log('Database connected');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed', err.message);

    });

module.exports = promisePool;