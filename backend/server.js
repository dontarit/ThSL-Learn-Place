const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const puppeteer = require('puppeteer')

// const port = process.env.PORT || 5000
const port = 5000
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

app.post('/loginServer', (req, res) => {
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

app.post('/learnServer', async (req, res) => {
    console.log(`Searching for : ${req.body.data}`);
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`https://www.th-sl.com/?s=${req.body.data}`)
    // await page.goto('https://www.th-sl.com/page/2/?s=ภาษา')
    
    const card_data = await page.evaluate(() => {
        const card_element = document.querySelectorAll('.elementor-post__title')
        const card_array = []

        for (const elememt of card_element) {
            const text = elememt.querySelector('a').innerText;
            if (
                text != 'ไม่พบผลการค้นหา' &&
                text != 'ฐานข้อมูลภาษามือไทย' &&
                text != 'ค้นหาด้วยภาษามือไทย' &&
                text != 'ค้นหาด้วยคำศัพท์ภาษามือไทย'
            ) {
                card_array.push(text)
            }
        }

        return card_array
    })
    
    console.log(`Search(${req.body.data}) : ${card_data}`);
    res.json(card_data)

    await new Promise(resolve => setTimeout(resolve, port))
    await browser.close()
})

// app.post('/recomentWord', async (req, res) => {
//     const browser = await puppeteer.launch()
//     const page = await browser.newPage()
    
//     const data = []

//     // Fetch data from console and send to website
//     page.on('console', async (msg) => {
//         const args = msg.args()

//         for (let i = 0; i < args.length; ++i) {
//             try {
//                 const val = await args[i].jsonValue()
//                 data.push(val)
//             } catch (e) {
//                 console.log(`[ARG ${i}] <unserializable>`)
//             }
//         }
//     })
    
//     await page.goto('https://www.th-sl.com/search-by-act/')
//     await new Promise(resolve => setTimeout(resolve, port))
//     await browser.close()
    
//     res.json({data})
// })

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})