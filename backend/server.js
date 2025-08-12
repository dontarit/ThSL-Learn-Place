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
const port = 4000
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
    const insertQuery = "INSERT INTO user_data(user_name, user_email, user_password, user_setting, word_score, word_fav, schedule, exp) VALUES (?, ?, ?, '{}', '[]', '[]', '[]', 0)"
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

app.post('/checkHookState', (req, res) => {
    pool.getConnection((err, connection) => {
        const query = `SELECT fetching_state FROM back_manipulate`
        if (err) {
            console.error('Error getting connection:', err)
            return res.json(false)
        }
        connection.query(query, (err, result) => {
            connection.release()
            if (err) {
                console.error('Error changing state:', err);
            } else {
                return res.json(result[0].fetching_state)
            }
        });
    })
})

const saveWordData = async (word_data) => {
    for (const data of word_data) {
        const textTitle = data.text;
        const imageUrl = data.image;
        const descript = JSON.stringify(data.description)

        try {
            const query = 'INSERT INTO thsl_words (thsl_word, thsl_src, thsl_desc) VALUES (?, ?, ?)';

            pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting connection:', err)
                    return res.json({theme: 'danger', title: 'Error', content: "Can't connect to database"})
                }
                connection.query(query, [textTitle, imageUrl, descript], (err) => {
                    connection.release()
                    if (err) {
                        console.error('Error saving data:', err);
                    } else {
                        console.log(`Fetch "${textTitle}" into database`);
                    }
                });
            })
        } catch (error) {
            console.error('Error saving data:', error);
        }

        try {
            const query = 'CREATE FULLTEXT INDEX thsl_word_fulltext_idx ON thsl_words(thsl_word)';

            pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting connection:', err)
                    return res.json({theme: 'danger', title: 'Error', content: "Can't connect to database"})
                }
                connection.query(query, (err) => {
                    connection.release()
                    if (err) {
                        console.error('Error create fulltext:', err);
                    }
                });
            })
        } catch (error) {
            console.error('Error create fulltext:', error);
        }
    }
};

app.post('/hookDataThSL', async (req, res) => {
    // Set fetching state
    pool.getConnection((err, connection) => {
        const query = `UPDATE back_manipulate SET fetching_state = 1`
        if (err) {
            console.error('Error getting connection:', err)
            return res.json({theme: 'danger', title: 'Error', content: "Can't connect to database"})
        }
        connection.query(query, (err, result) => {
            connection.release()
            if (err) {
                console.error('Error changing state:', err);
            } else {
                console.log('Set state to fetching');
            }
        });
    })

    const browser = await puppeteer.launch()

    // Get thai sign data
    const ACT_PAGE = await browser.newPage()
    await ACT_PAGE.goto(`https://www.th-sl.com/search-by-act/`)
    await ACT_PAGE.waitForSelector('#ReactiveGridView', { visible: true });
    const word_data = await ACT_PAGE.evaluate(() => {
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
        return result
    })

    // Get description from thai dictionary
    const DIC_PAGE = await browser.newPage()
    await DIC_PAGE.goto(`https://dictionary.orst.go.th/`)
    await DIC_PAGE.waitForSelector('#txt_input', { visible: true });
    for (const data of word_data) {
        const keyword = data.text.split(/[\s(]/)[0];
        
        await DIC_PAGE.evaluate((kw) => {
            document.getElementById('txt_input').value = kw;
            document.getElementById('btnSubmit').click();
        }, keyword);

        await DIC_PAGE.waitForSelector('.panel.panel-info');
        
        const description = await DIC_PAGE.evaluate((data) => {
            const result = [];
            let ele_1 = document.querySelector('.panel.panel-info');
            let ele_2 = ele_1.querySelectorAll('.panel-body .panel.panel-info')
            if (ele_2[0]) {
                ele_2.forEach(panel => {
                    const head = panel.querySelector('.panel-heading b').innerText;
                    const text = panel.querySelector('.panel-body').innerText;
                    result.push({ head, text });
                });
            } else {
                result.push({ head : data.text, text : "" });
            }
            return result;
        }, data);

        data.description = description;
        
        await Promise.all([
            DIC_PAGE.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            DIC_PAGE.click('#index a')
        ]);
        
        await DIC_PAGE.waitForSelector('#txt_input', { visible: true });
        console.log(`Fetch title, description of "${data.text}"`);
    }
    
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
    
    pool.getConnection((err, connection) => {
        const query = `UPDATE back_manipulate SET fetching_state = 0`
        if (err) {
            console.error('Error getting connection:', err)
            return res.json({theme: 'danger', title: 'Error', content: "Can't connect to database"})
        }
        connection.query(query, (err, result) => {
            connection.release()
            if (err) {
                console.error('Error changing state:', err);
            } else {
                console.log('Set state to fetched');
            }
        });
    })

    await new Promise(resolve => setTimeout(resolve, port))
    await browser.close()
    return res.json({theme: 'success', title: 'Fetched', content: 'Fetching data successfully, it may take some time to store in database', word: word_data})
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

// NOTE Main

app.post('/getSetting', (req, res) => {
    const token = req.body.token
    const query = "SELECT user_setting FROM user_data WHERE user_id = ?"
    
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting connection:', err)
            }
            connection.query(query, [user.id], (err, data) => {
                connection.release()
                if (err) {
                    console.error('Error executing query:', err)
                }else {
                    return res.json(data)
                }
            })
        })
    })
})

app.post('/saveSetting', (req, res) => {
    const token = req.body.token
    const setting = req.body.value
    const query = "UPDATE user_data SET user_setting = ? WHERE user_id = ?"
    
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting connection:', err)
            }
            connection.query(query, [setting, user.id], (err, data) => {
                connection.release()
                if (err) {
                    console.error('Error executing query:', err)
                }else {
                    return res.json(data)
                }
            })
        })
    })
})

app.post('/changeName', (req, res) => {
    const token = req.body.token
    const name = req.body.name
    const query = "UPDATE user_data SET user_name = ? WHERE user_id = ?"

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting connection:', err)
                return res.json({theme: 'danger', title: 'Error', content: "Can't connect to database"})
            }
            connection.query(query, [name, user.id], (err, data) => {
                connection.release()
                if (err) {
                    console.error('Error executing query:', err)
                    return res.json({theme: 'danger', title: 'Error', content: "Can't executing query"})
                }else {
                    return res.json({theme: 'success', title: 'Changed', content: "The new name has been signed"})
                }
            })
        })
    })
})

app.post('/searchWord', (req, res) => {
    const data = req.body.search_data
    const toSite = req.body.to_site
    let query
    if (toSite) {
        query = `SELECT * FROM thsl_words WHERE MATCH(thsl_word) AGAINST('${data}' IN NATURAL LANGUAGE MODE)`
    } else {
        query = `SELECT * FROM thsl_words WHERE thsl_word LIKE '${data}%'`
    }

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

app.post('/searchWordFirst', (req, res) => {
    let data = req.body.random_data
    const query = `SELECT * FROM thsl_words WHERE id > ${data} ORDER BY id ASC LIMIT 20`

    pool.getConnection((err, connection) => {
        if (err) { console.error('Error getting connection:', err) }
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

app.post('/searchSpecific', (req, res) => {
    let word = req.body.word
    const query = `SELECT * FROM thsl_words WHERE id = ?`

    pool.getConnection((err, connection) => {
        if (err) { console.error('Error getting connection:', err) }
        connection.query(query, [word], (err, data) => {
            connection.release()
            if (err) { console.error('Error executing query:', err) }
            else {
                return res.json(data)
            }
        })
    })
})

app.post('/getLearnData', (req, res) => {
    const token = req.body.token
    const query = "SELECT learn_id, word_score, word_fav, schedule, exp FROM user_data WHERE user_id = ?"

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting connection:', err)
            }
            connection.query(query, [user.id], (err, data) => {
                connection.release()
                if (err) {
                    console.error('Error executing query:', err)
                }else {
                    return res.json({
                        learn_id: data[0].learn_id,
                        word_score: data[0].word_score,
                        word_fav: data[0].word_fav,
                        schedule: data[0].schedule,
                        exp: data[0].exp
                    })
                }
            })
        })
    })
})

app.post('/storeLearnData', (req, res) => {
    const token = req.body.token
    const dData = req.body.new_word
    const dList = req.body.new_list
    
    const getScore = "SELECT word_score FROM user_data WHERE user_id = ?"
    const query = "UPDATE user_data SET learn_id = ?, word_score = ? WHERE user_id = ?"

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        pool.getConnection((err, connection) => {
            if (err) { console.error('Error getting connection:', err) }
            connection.query(getScore, [user.id], (err, data) => {
                if (err) { console.error('Error executing query:', err) }
                let dataList = JSON.stringify(dList.concat(JSON.parse(data[0].word_score)))

                pool.getConnection((err, connection) => {
                    if (err) { console.error('Error getting connection:', err) }
                    connection.query(query, [dData, dataList, user.id], (err, data) => {
                        if (err) { console.error('Error executing query:', err) }
                        connection.release()
                    })
                })
            })
        })
    })
})



app.get('/', (req, res) => {
    res.send('API');
});
https.createServer(credentials, app).listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
});