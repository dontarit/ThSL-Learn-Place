const express = require('express')
const mysql = require('mysql')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const puppeteer = require('puppeteer')
const https = require('https');
const fs = require('fs');

// const port = process.env.PORT || 5000
const port = 5000
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())

const privateKey = fs.readFileSync('../mysite.key', 'utf8');
const certificate = fs.readFileSync('../mysite.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate};

const ACCESS_TOKEN_SECRET = crypto.randomBytes(32).toString('hex');
const REFRESH_TOKEN_SECRET = crypto.randomBytes(32).toString('hex');
console.log('ACCESS_TOKEN_SECRET:', ACCESS_TOKEN_SECRET);
console.log('REFRESH_TOKEN_SECRET:', REFRESH_TOKEN_SECRET);

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.user_id, username: user.user_name, isAdmin: user.admin_state }, ACCESS_TOKEN_SECRET);
};
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, isAdmin: user.admin_state }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

let user = { id: 1, username: 'user1', password: bcrypt.hashSync('password123', 10) }
console.log(generateAccessToken(user));
console.log(generateRefreshToken(user));

const pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'thsl_learn',
})

app.post('/signinServer', (req, res) => {
    const { name, email, pswd } = req.body
    const insertQuery = "INSERT INTO user_data(user_name, user_email, user_password) VALUES (?, ?, ?)"
    const checkEmailQuery = "SELECT * FROM user_data WHERE user_email = ?"
    
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err)
            return res.json({theme: 'danger', title: 'Error', content: "Can't connect to database"})
        } else {
            connection.query(checkEmailQuery, [email], (err, data) => {
                connection.release()
                if (err) {
                    console.error('Error executing query:', err)
                    return res.json({theme: 'danger', title: 'Error', content: "Can't executing query"})
                }
                if (data.length > 0) {
                    return res.json({theme: 'warning', title: 'Warning', content: 'That email already exists. Enter a different account'})
                }
    
                connection.query(insertQuery, [name, email, pswd], (err) => {
                    if (err) {
                        console.error('Error inserting data:', err)
                        return res.json({theme: 'danger', title: 'Error', content: "Can't inserting data"})
                    }
                    return res.json({theme: 'success', title: 'Signed', content: 'Sign up successfully'})
                })
            })
        }
    })
})

app.post('/loginServer', (req, res) => {
    const { email, pswd } = req.body
    const checkUserQuery = "SELECT * FROM user_data WHERE user_email = ? AND user_password = ?"

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err)
            return res.json({theme: 'danger', title: 'Error', content: "Can't connect to database"})
        }
        connection.query(checkUserQuery, [email, pswd], (err, data) => {
            connection.release()
            if (err) {
                console.error('Error executing query:', err)
                return res.json({theme: 'danger', title: 'Error', content: 'Error executing query'})
            }
            if (data.length > 1) {
                console.error('Error database conflict :', err)
                return res.json({theme: 'danger', title: 'Error', content: "Database conflict"})
            } else if (data.length == 1) {
                const accessToken = generateAccessToken(data[0]);
                const refreshToken = generateRefreshToken(data[0]);

                res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });

                return res.json({
                    theme: 'success', 
                    title: 'Loged', 
                    content: 'Login successfully', 
                    token: accessToken,
                    user_data: {
                        name: data[0].user_name,
                        email: data[0].user_email,
                        profile: data[0].user_profile,
                    }
                })
            } else {
                return res.json({theme: 'danger', title: 'Warning', content: "Wrong email or password"})
            }
        })
    })
})

app.post('/checkAdminServer', (req, res) => {
    const token = req.body.token
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        if (user.isAdmin) {
            return res.json(true)
        }
        else {
            return res.json(false)
        }
    })
});

app.post('/logoutServer', (req, res) => {
    res.clearCookie('refreshToken');
    return res.json({theme: 'success', title: 'Done', content: "Logged out successfully"})
});

app.post('/tokenServer', (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token found' });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });

        // Generate new access token for the user
        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
    });
});

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

app.get('/', (req, res) => {
    res.send('Hello HTTPS');
});
https.createServer(credentials, app).listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
});