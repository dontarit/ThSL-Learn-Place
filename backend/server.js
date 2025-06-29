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
    const req_data = req.body.search_data
    const req_page = req.body.search_page
    console.log(`User Searching : ${req_data}`);
    
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`https://www.th-sl.com/page/${req_page}/?s=${req_data}`)

    
    const card_data = await page.evaluate(() => {
        const card_element = document.querySelectorAll('.elementor-post__card')
        const page_element = document.querySelector('.elementor-pagination')
        const card_array = []
        
        // Check if there are thumbnail or not (unavailable = not word-card)
        for (const elememt of card_element) {
            const text = elememt.querySelector('.elementor-post__title').innerText;
            const img = elememt.querySelector('.elementor-post__thumbnail')
            if (img != null) {
                card_array.push(text)
            }
        }
        
        // Send card_array again if more page still avialable
        const getPage = document.querySelector('.page-numbers.current')
        const page_now = page_element != null ? getPage.innerText.trim().replace(/\D/g, '') : 1
        const page_all = page_element != null ? page_element.childElementCount : 1
        return {card_array, page_all, page_now}
    })
    
    let word_data = card_data.card_array
    let page_all = card_data.page_all
    let page_now = card_data.page_now
    
    // Send data to user
    console.log(`Searching for "${req_data}"(${page_now}/${page_all}) : ${word_data}`);
    res.json({
        search : req_data,
        send : word_data,
        pageAll : parseInt(page_all),
        pageNow : parseInt(page_now),
    })

    await new Promise(resolve => setTimeout(resolve, port))
    await browser.close()
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})