const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
// const socketIo = require('socket.io')
// const puppeteer = require('puppeteer')

const app = express()
app.use(express.json())
app.use(cors())

const pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'thsl_learn',
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM user_data WHERE user_email = ? AND user_password = ?"
    pool.getConnection((err, connection) => {
        if (err) {
            res.json("Connection Failed")
            console.error('Error getting connection:', err)
            return
        }
        connection.query(sql, [req.body.email, req.body.password], (err, data) => {
            connection.release()
            if (err) {
                res.json("Login Failed")
                console.error('Error executing query:', err)
                return
            }
            if (data.length > 0) {
                return res.json(true)
            } else {
                return res.json(false)
            }
        })
    })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/login`)
})