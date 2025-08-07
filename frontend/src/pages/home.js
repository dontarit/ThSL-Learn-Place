import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

import home from '../css/home.module.css'
import logsignForm from '../css/sub/logsignForm.module.css'
import getBase from '../js/getBase.js'
import openAlert from '../js/alert-box.js'
import { refreshToken, isTokenExpired } from '../js/tokenManipulate.js';

import TSLlogo from '../assets/img/TSLlogo.png';

export default function HomePage() {
    const navigate = useNavigate();
    getBase()

    const [name_f, setName] = useState('')
    const [email_f, setEmail] = useState('')
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const didRun = useRef(false);
    const projects = [
        {
            title: "Title",
            desc: "description",
            img: "https://placehold.co/600x350?text=Image",
        }, {
            title: "Title",
            desc: "description",
            img: "https://placehold.co/600x350?text=Image",
        }, {
            title: "Title",
            desc: "description",
            img: "https://placehold.co/600x350?text=Image",
        }, {
            title: "Title",
            desc: "description",
            img: "https://placehold.co/600x350?text=Image",
        }, {
            title: "Title",
            desc: "description",
            img: "https://placehold.co/600x350?text=Image",
        }, {
            title: "Title",
            desc: "description",
            img: "https://placehold.co/600x350?text=Image",
        }
    ];
    
    async function checkState(token) {
        await axios.post('/checkAdminServer', {token}).then(res => {
            const isAdmin = (res.data == 1 || res.data == 2) ? true : false
            isAdmin ? navigate('/admin') : navigate('/learn')
            return
        }).catch(err => {
            return
        })
    }
    if (localStorage.getItem('authToken') != null) {
        checkState(authToken)
    }
        


    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;
        
        // localStorage.clear();
        
        const burger = document.getElementById("burger");
        const navList = document.getElementById("nav-list");
        burger.addEventListener("click", () => navList.classList.toggle("show"));
        
        document.getElementById("year").textContent = new Date().getFullYear();

        const grid = document.getElementById("project_grid");
        projects.forEach((p) => {
            const card = document.createElement("article");
            card.className = `${home.project_card} ${home.fade}`;
            card.innerHTML = `
                <img src="${p.img}" class="${home.img}" alt="${p.title}">
                <div class="${`${home.content} ${home.image}`}">
                <h4>${p.title}</h4>
                <p>${p.desc}</p>
                </div>
            `;
            grid.appendChild(card);
        });

        const formChk =  document.getElementById('chkFormSecId')
        const log_h = document.querySelector(`.${logsignForm.login} .${logsignForm.handler}`);
        const sign_h = document.querySelector(`.${logsignForm.signup} .${logsignForm.handler}`);
        const timing = 30;
        const formTxt = {
            sign: {
                main: 'Sign up',
                change: "Don't have an account?"
            },
            log: {
                main: 'Login',
                change: "Already a user?"
            }
        };

        let change_main, change_sub;

        formChk.addEventListener('click', () => {
            clearInterval(change_main);
            clearInterval(change_sub);

            let chgt_m = '';
            let chgt_s = '';
            let count_m = 0;
            let count_s = 0;

            const isLogin = formChk.checked;
            const mainText = isLogin ? formTxt.sign.change : formTxt.log.change;
            const subText = isLogin ? formTxt.log.main : formTxt.sign.main;
            const mainHandler = isLogin ? sign_h : log_h;
            const subHandler = isLogin ? log_h : sign_h;

            if (isLogin) {
                document.getElementById('signinBtnGroup').inert = true
                document.getElementById('loginBtnGroup').inert = false
            } else {
                document.getElementById('signinBtnGroup').inert = false
                document.getElementById('loginBtnGroup').inert = true
            }

            change_main = setInterval(() => {
                if (count_m === mainText.length) {
                    clearInterval(change_main);
                } else {
                    chgt_m += mainText[count_m];
                    mainHandler.innerHTML = chgt_m;
                    count_m += 1;
                }
            }, timing);

            change_sub = setInterval(() => {
                if (count_s === subText.length) {
                    clearInterval(change_sub);
                } else {
                    chgt_s += subText[count_s];
                    subHandler.innerHTML = chgt_s;
                    count_s += 1;
                }
            }, timing * 4);
        });


        const logsignMainForm = document.querySelector(`.${logsignForm.mainForm}`)
        const overlay = document.querySelector('#overlay-setting-container')
        const mainClick = document.querySelector('#loginClick')

        mainClick.addEventListener('click', () => {
            logsignMainForm.style.display = 'block'
            overlay.style.display = 'block'
            setTimeout(() => {
                logsignMainForm.style.opacity = '1'
                overlay.style.opacity = '1'
            }, 1);
        })
        overlay.addEventListener('click', () => {
            if (formChk.checked) {
                formChk.click()
            }
            logsignMainForm.style.opacity = '0'
            overlay.style.opacity = '0'
            setTimeout(() => {
                logsignMainForm.style.display = 'none'
                overlay.style.display = 'none'
            }, 250);
        })
    }, [authToken]);



    async function signup(e) {
        e.preventDefault();
        const name = name_f;
        const email = email_f;
        const pswd = e.target.pswd.value;
        const name_e = document.querySelector(`.${logsignForm.signup} .${logsignForm.inputform}.name`);
        const email_e = document.querySelector(`.${logsignForm.signup} .${logsignForm.inputform}.email`);
        const formChk =  document.getElementById('chkFormSecId')

        await axios.post('/signinServer', {name, email, pswd}).then(res => {
            if (res.data.theme != 'success') {
                name_e.value = name
                email_e.value = ''
                e.target.pswd.value = ''
            } else if (res.data.theme == 'success') {
                name_e.value = ''
                email_e.value = ''
                e.target.pswd.value = ''
                if (formChk.checked == false) {
                    formChk.click()
                }
            }
            openAlert(res.data.theme, res.data.title, res.data.content)
        }).catch(err => {
            console.error(err)
            openAlert('danger', 'Error', "Unable to signup via API")
        })
    }

    async function login(e) {
        e.preventDefault();
        const email = email_f;
        const pswd = e.target.pswd.value;
        const email_e = document.querySelector(`.${logsignForm.login} .${logsignForm.inputform}.email`);
        const formChk =  document.getElementById('chkFormSecId')
        const isLogin = formChk.checked;

        await axios.post('/loginServer', {email, pswd}).then(res => {
            openAlert(res.data.theme, res.data.title, res.data.content) 
            if (res.data.theme != 'success') {
                email_e.value = email
                e.target.pswd.value = ''
            } else if (res.data.theme == 'success') {
                email_e.value = ''
                e.target.pswd.value = ''
                const accessToken = res.data.token
                const user_data = res.data.user_data
                localStorage.setItem('authToken', accessToken)
                localStorage.setItem('name', user_data.name)
                localStorage.setItem('email', user_data.email)
                localStorage.setItem('profile', user_data.profile)
                checkState(accessToken)
            }
        }).catch(err => {
            console.error(err)
            openAlert('danger', 'Error', "Unable to login via API")
        })
    }



    return (
        <div className={home.body}>
        <header id='header' className={home.header}>
            <div className={home.container}>
                <img className={`${home.logo} ${home.img}`} src={TSLlogo} style={{width: 'calc(4.2em)'}}/>
                <nav className={home.nav}>
                    <ul className={home.ul}>
                        <li><a href="#home" className={home.a}>Home</a></li>
                        <li><a href="#about" className={home.a}>About</a></li>
                        <li><a href="#content" className={home.a}>Content</a></li>
                    </ul>
                    <button id='burger' className={home.burger}><i className="fa fa-bars"></i></button>
                </nav>
            </div>
        </header>
        <div className={logsignForm.mainForm}>
            <input type="checkbox" id="chkFormSecId" aria-hidden="true" className={`${logsignForm.inputform} ${logsignForm.chkFormSec}`} />
            <div className={logsignForm.signup}>
                <form onSubmit={(e) => {signup(e)}} className={logsignForm.logsign_container}>
                    <label htmlFor="chkFormSecId" aria-hidden="true" className={logsignForm.handler}>Sign up</label>
                    <div id='signinBtnGroup'>
                        <input type="text" name="name" maxLength={15} placeholder="name" required 
                            className={`${logsignForm.inputform} name`} 
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input type="email" name="email" placeholder="email" required 
                            className={`${logsignForm.inputform} email`} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input type="password" name="pswd" placeholder="password" minLength={8} required className={logsignForm.inputform} />
                        <button id="btnFormSign" type='submit' className={logsignForm.btnform}>Sign up</button>
                    </div>
                </form>
            </div>

            <div className={logsignForm.login}>
                <form onSubmit={(e) => {login(e)}} className={logsignForm.logsign_container}>
                    <label htmlFor="chkFormSecId" aria-hidden="true" className={logsignForm.handler}>Already a user?</label>
                    <div id='loginBtnGroup' inert>
                        <input type="email" name="email" placeholder="email" required 
                            className={`${logsignForm.inputform} email`} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input type="password" name="pswd" placeholder="password" required className={logsignForm.inputform} />
                        <button id="btnFormLog" type='submit' className={logsignForm.btnform}>Login</button>
                    </div>
                </form>
            </div>
        </div>


        <section id='home' className={`${home.section} ${home.hero}`}>
            <div className={home.container}>
                <h2 className={home.h2}>Welcome to <span className={home.accent}>ThSL learn place</span></h2>
                <p>A fun, free and awesome way to learn languages!</p>
                <div className={home.social}>
                    <i className="ph ph-hand-palm"></i>
                    <i className="ph ph-hand-peace"></i>
                    <i className="ph ph-hand-pointing"></i>
                    <i className="ph ph-hand-waving"></i>
                    <i className="ph ph-hands-praying"></i>
                    <i className="ph ph-hand-grabbing"></i>
                </div>
                <a className={`${home.btn} ${home.a}`} id='loginClick'>Let's Start</a>
            </div>
        </section>
        <div className={home.sectionAbout} id="about">
            <section className={`${home.section} ${home.aboutSec}`}>
                <div className={`${home.container} ${home.contentContainer} ${home.grid_2}`}>
                    <img className={home.image} src="https://placehold.co/500x500" alt="Profile"/>
                    <div className={home.text}>
                        <h3 className={home.whatHead}>What is this?</h3>
                        <p className={home.thaiSpread}>
                            Thai Sign Language is the primary language for the hearing impaired to communicate in Thailand. However, 
                            Thai society still lacks easily accessible and quality tools for learning and interpreting sign language systematically. 
                            This project aims to develop a platform that uses technology to help reduce the communication gap and increase learning opportunities for everyone in society. 
                            It is supported by funding from NSTDA and has received sign language data from the Thai Deaf Association.
                        </p>
                        <br/>
                        <h4>Powered by</h4>
                        <ul className={`${home.tech_list} ${home.ul}`}>
                            <li>
                                <i className="ph ph-atom"></i>
                                <span></span>
                                React
                            </li>
                            <li>
                                <i className="ph ph-article"></i>
                                <span></span>
                                Mediapipe
                            </li>
                            <li>
                                <i className="ph ph-heart"></i>
                                <span></span>
                                And Love
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <br></br>
            <section className={`${home.section} ${home.aboutSec}`}>
                <div className={`${home.container} ${home.contentContainer} ${home.grid_2}`}>
                    <div className={home.text}>
                        <h3 className={home.whatHead}>About us</h3>
                        <p className={home.thaiSpread}>
                            We are a group of students from Nongbua Pittayakarn School who have developed this web application to provide a convenient and accessible tool for those interested in learning Thai Sign Language. 
                            It uses motion detection technology through video cameras to translate sign language into text in real-time.
                        </p>
                        <br/>
                        <h4>Participants</h4>
                        <ul className={`${home.tech_list} ${home.ul}`}>
                            <li>
                                <i className="ph ph-user"></i>
                                <span></span>
                                Dontarit Haisok
                            </li>
                            <li>
                                <i className="ph ph-user"></i>
                                <span></span>
                                Chindanai Chaipim
                            </li>
                            <li>
                                <i className="ph ph-user"></i>
                                <span></span>
                                Tanawit Phadasri
                            </li>
                        </ul>
                    </div>
                    <img className={home.image} src="https://placehold.co/500x500" alt="Profile"/>
                </div>
            </section>
        </div>
        <section id="content" className={`${home.section} ${home.dark} ${home.heightFit}`}>
            <div className={home.container}>
                <h3 className={home.section_title}>Why choose us?</h3>
                <div id="project_grid" className={home.grid_3}></div>
            </div>
        </section>
        <section id="together" className={`${home.section} ${home.together}`}>
            <div className={home.container}>
                <h3 className={home.section_title}>
                    <p>Let's learn</p>
                    <p className={home.accent}>Thai Sign Language</p>
                </h3>
                <a href="#home" className={`${home.btn} ${home.small} ${home.a}`}>I'm ready</a>
            </div>
        </section>
        <footer className={home.footer}>
            <div className={home.container}>
                <p>© <span id="year"></span> | Crafted with <i className="ph-fill ph-heart"></i> by Dontarit</p>
            </div>
        </footer>
        <div id="overlay-setting-container" className={logsignForm.overlay_setting_container}></div>
        </div>
    )
}