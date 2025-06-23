const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
// const http = require('http')
// const socketIo = require('socket.io')
// const path = require('path')
// const puppeteer = require('puppeteer')

const app = express()
const port = process.env.PORT || 5000

app.use(cors())

const pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'thsl_learn',
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM user_data WHRER user_name = ? AND user_password = ?"
    const value = [
        req.body.name,
        req.body.password
    ]
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return;
        }
        connection.query(sql, (err, data) => {
            connection.release()
            if (err) {
                console.error('Error executing query:', err);
                return
            }
            res.json(data)
        })
    })
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})