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
const axios = require('axios')

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

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.user_id, username: user.user_name, isAdmin: user.admin_state }, ACCESS_TOKEN_SECRET);
};
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, isAdmin: user.admin_state }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
// let user = { id: 1, username: 'user1', password: bcrypt.hashSync('password123', 10) }

const pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'thsl_learn',
})

// NOTE Home

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

// NOTE Admin 

app.post('/fetchUserData', (req, res) => {
    const query = "SELECT * FROM user_data"

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err)
            return res.json({theme: 'danger', title: 'Error', content: "Can't connect to database"})
        }
        connection.query(query, (err, data) => {
            connection.release()
            if (err) {
                console.error('Error executing query:', err)
                return res.json({theme: 'danger', title: 'Error', content: 'Error executing query'})
            }
            else {
                return res.json(data)
            }
        })
    })
})

app.post('/deleteAccount', (req, res) => {
    const user = req.body.userId
    const query = "DELETE FROM user_data WHERE user_id = ?"

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err)
            return res.json({theme: 'danger', title: 'Error', content: "Can't connect to database"})
        }
        connection.query(query, [user], (err, data) => {
            connection.release()
            if (err) {
                console.error('Error executing query:', err)
                return res.json({theme: 'danger', title: 'Error', content: 'Error executing query'})
            } else {
                return res.json({theme: 'success', title: 'Success', content: 'Remove account successfully'})
            }
        })
    })
})

app.post('/setUserAdmin', (req, res) => {
    const user = req.body.userId
    const value = req.body.setTo
    const query = "UPDATE user_data SET admin_state = ? WHERE user_id = ?"

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err)
            return res.json({theme: 'danger', title: 'Error', content: "Can't connect to database"})
        }
        connection.query(query, [value, user], (err, data) => {
            connection.release()
            if (err) {
                console.error('Error executing query:', err)
                return res.json({theme: 'danger', title: 'Error', content: 'Error executing query'})
            } else {
                if (value == 0) {
                    return res.json({theme: 'success', title: 'New Admin!', content: 'Remove Admin successfully'})
                }
                else if (value == 1) {
                    return res.json({theme: 'success', title: 'Removed', content: 'Set Admin successfully'})
                }
            }
        })
    })
})


const downloadImage = async (imageUrl) => {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        return Buffer.from(response.data);
    } catch (error) {
        console.error('Error downloading image:', error);
        throw error;
    }
};

const saveWordData = async (word_data) => {
    for (const data of word_data) {
        const textTitle = data.text;
        const imageUrl = data.image;

        try {
            const query = 'INSERT INTO thsl_words (thsl_word, thsl_src) VALUES (?, ?)';

            pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting connection:', err)
                    return res.json({theme: 'danger', title: 'Error', content: "Can't connect to database"})
                }
                connection.query(query, [textTitle, imageUrl], (err, result) => {
                    connection.release()
                    if (err) {
                        console.error('Error saving image to database:', err);
                    } else {
                        console.log(`Fetch "${textTitle}" to database`);
                    }
                });
            })
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    }
};

app.post('/hookDataThSL', async (req, res) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(`https://www.th-sl.com/search-by-act/`)
    await page.waitForSelector('#ReactiveGridView', { visible: true });

    const word_data = await page.evaluate(() => {
        const ftc_1 = document.getElementById('ReactiveGridView')
        const ftc_2 = ftc_1.querySelectorAll('div')
        const ftc_3 = ftc_2[Object.entries(ftc_2).length - 1].querySelector('button')
        ftc_3.id = 'FetchItems'

        let result = [];

        const fetchMoreData = async () => {
            const fetchMore = async () => {
                const fetch_more = document.getElementById('FetchItems');
                
                if (fetch_more !== null && fetch_more !== undefined) {
                    fetch_more.click();
                    await fetchMore();
                }
                else {
                    document.querySelectorAll('.reactive-property-listing-item').forEach(element => {
                        let img = element.querySelector('.property-image-wrapper img').src;
                        let text = element.querySelector('.title a').innerHTML;
                        result.push({
                            text: text,
                            image: img
                        });
                    });
                    return result;
                }
            };
            await fetchMore();
        };
        fetchMoreData();
        console.log(result);
        return result
    })
    
    pool.getConnection((err, connection) => {
        const query = `TRUNCATE TABLE thsl_words`
        if (err) {
            console.error('Error getting connection:', err)
            return res.json({theme: 'danger', title: 'Error', content: "Can't connect to database"})
        }
        connection.query(query, (err, result) => {
            connection.release()
            if (err) {
                console.error('Error removing data:', err);
            } else {
                console.log('Remove data from "thsl_words"');
                saveWordData(word_data);
            }
        });
    })
    
    await new Promise(resolve => setTimeout(resolve, port))
    await browser.close()
    return res.json({theme: 'info', title: 'Fetching', content: 'Data fetching don\'t closing or leave the site, you can see more details in the backend terminal.', word: word_data})
})

app.post('/fetchThSLData', (req, res) => {
    const page = req.body.page;
    const snap = 15;
    const query = `SELECT * FROM thsl_words WHERE id > ${page * snap} ORDER BY id ASC LIMIT ${snap}`;
    let resultData;
    let resultPage;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return res.status(500).json({ error: 'Database connection error' });
        }
        
        const fetchDataPromise = new Promise((resolve, reject) => {
            connection.query(query, (err, data) => {
                if (err) {
                    reject('Error executing fetch data query');
                } else {
                    resolve(data);
                }
            });
        });

        const fetchCountPromise = new Promise((resolve, reject) => {
            connection.query("SELECT COUNT(*) AS total FROM thsl_words", (err, data) => {
                if (err) {
                    reject('Error executing count query');
                } else {
                    resolve(data[0].total);
                }
            });
        });
        
        Promise.all([fetchDataPromise, fetchCountPromise])
            .then(results => {
                resultData = results[0];
                resultPage = results[1];
                res.json({ result: resultData, page: resultPage });
                connection.release();
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({ error: 'Error fetching data from the database' });
                connection.release();
            });
    });
});

app.post('/deleteThSLWord', (req, res) => {
    const word = req.body.wordId
    const query = "DELETE FROM thsl_words WHERE id = ?"

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err)
            return res.json({theme: 'danger', title: 'Error', content: "Can't connect to database"})
        }
        connection.query(query, [user], (err, data) => {
            connection.release()
            if (err) {
                console.error('Error executing query:', err)
                return res.json({theme: 'danger', title: 'Error', content: 'Error executing query'})
            } else {
                return res.json({theme: 'success', title: 'Success', content: 'Deleted successfully'})
            }
        })
    })
})

app.post('/changeThSL_Title', (req, res) => {
    const id = req.body.wordId
    const value = req.body.changeTo
    const query = "UPDATE thsl_words SET thsl_word = ? WHERE id = ?"

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err)
            return res.json({theme: 'danger', title: 'Error', content: "Can't connect to database"})
        }
        connection.query(query, [value, id], (err, data) => {
            connection.release()
            if (err) {
                console.error('Error executing query:', err)
                return res.json({theme: 'danger', title: 'Error', content: 'Error executing query'})
            } else {
                return res.json({theme: 'success', title: 'Success', content: 'Change title successfully'})
            }
        })
    })
})

app.post('/changeThSL_Description', (req, res) => {
    const id = req.body.wordId
    const value = req.body.changeTo
    const query = "UPDATE thsl_words SET thsl_desc = ? WHERE id = ?"

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err)
            return res.json({theme: 'danger', title: 'Error', content: "Can't connect to database"})
        }
        connection.query(query, [value, id], (err, data) => {
            connection.release()
            if (err) {
                console.error('Error executing query:', err)
                return res.json({theme: 'danger', title: 'Error', content: 'Error executing query'})
            } else {
                return res.json({theme: 'success', title: 'Success', content: 'Change decsription successfully'})
            }
        })
    })
})

// app.get('/image/:id', (req, res) => {
//     console.log('got');
//     const imageId = req.params.id;
//     const sql = 'SELECT thsl_image FROM thsl_words WHERE id = ?'

//     pool.getConnection((err, connection) => {
//         if (err) {
//             console.error('Error getting connection:', err)
//             return
//         }
//         connection.query(query, [imageId], (err, data) => {
//             connection.release()
//             if (err) {
//                 console.error('Error executing query:', err)
//             } else {
//                 const imageBuffer = data[0]?.thsl_image;
//                 if (imageBuffer) {
//                     res.setHeader('Content-Type', 'image/gif');
//                     res.send(imageBuffer);
//                 } else {
//                     res.status(404).send('Image not found');
//                 }
//             }
//         })
//     })
// });

// NOTE Main

app.post('/searchWord', async (req, res) => {
    const data = req.body.search_data
    const query = `SELECT * FROM thsl_words WHERE MATCH(thsl_word) AGAINST('${data}' IN NATURAL LANGUAGE MODE)`

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err)
        }
        connection.query(query, (err, data) => {
            connection.release()
            if (err) {
                console.error('Error executing query:', err)
            }else {
                return res.json(data)
            }
        })
    })
})

app.post('/searchWordFirst', async (req, res) => {
    let data = req.body.random_data
    const query = `SELECT * FROM thsl_words WHERE id > ${data} ORDER BY id ASC LIMIT 10`

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err)
        }
        connection.query(query, (err, data) => {
            connection.release()
            if (err) {
                console.error('Error executing query:', err)
            }else {
                return res.json(data)
            }
        })
    })
})



app.get('/', (req, res) => {
    res.send('Hello World');
});
https.createServer(credentials, app).listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
});