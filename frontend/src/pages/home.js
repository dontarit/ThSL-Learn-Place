import { useEffect, useState } from 'react';
import axios from 'axios'

import getBase from '../js/getBase.js'
import openAlert from '../js/alert-box.js'

import TSLlogo from '../assets/img/TSLlogo.png';

export default function HomePage() {
    const loadCssFiles = async () => {
        await import('../assets/font/font.css');
        await import('../css/home.css');
        await import('../css/sub/waveBtn.css');
        await import('../css/sub/logsignForm.css');
        await import('../css/sub/alert_box.css');
    };
    loadCssFiles();
    getBase()

    const [name_f, setName] = useState('')
    const [email_f, setEmail] = useState('')
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [isAdmin, setIsAdmin] = useState('');

    async function checkState() {
        await axios.post('/checkAdminServer', {token: authToken})
            .then(res => {
                setIsAdmin(res.data)
                return
            }).catch(err => {
                setIsAdmin(false)
                return
            })
    }
    checkState()

    useEffect(() => {
        if (!authToken && isTokenExpired()) {
            refreshToken();
        }
        else if (authToken && !isTokenExpired() && isAdmin) {
            const linkButtonNavigate = document.createElement('a');
            linkButtonNavigate.href = '/admin'
            linkButtonNavigate.click()
            return
        }
        else if (authToken && !isTokenExpired()) {
            const linkButtonNavigate = document.createElement('a');
            linkButtonNavigate.href = '/learn'
            linkButtonNavigate.click()
            return
        }

        import('../js/app-home.js')

        const mainForm = document.querySelector('.mainForm')
        const formChk = document.querySelector('#chkFormSec')
        const overlay = document.querySelector('#overlay-setting-container')
        const mainClick = document.querySelector('#loginClick')

        mainClick.addEventListener('click', () => {
            mainForm.style.display = 'block'
            overlay.style.display = 'block'
            setTimeout(() => {
                mainForm.style.opacity = '1'
                overlay.style.opacity = '1'
            }, 1);
        })
        overlay.addEventListener('click', () => {
            if (formChk.checked) {
                formChk.click()
            }

            mainForm.style.opacity = '0'
            overlay.style.opacity = '0'
            setTimeout(() => {
                mainForm.style.display = 'none'
                overlay.style.display = 'none'
            }, 250);
        })
    }, [authToken, isAdmin]);



    async function signup(data) {
        const name = name_f;
        const email = email_f;
        const pswd = data.get("pswd");
        const name_e = document.querySelector('.signup .inputform.name')
        const email_e = document.querySelector('.signup .inputform.email')

        
        await axios.post('/signinServer', {name, email, pswd})
        .then(res => {
                if (res.data.theme !== 'success') {
                    name_e.value = name
                    email_e.value = email
                }
                openAlert(res.data.theme, res.data.title, res.data.content)
            })
            .catch(err => {
                console.error(err)
                openAlert('danger', 'Error', "Unable to signup via API")
            })
    }

    async function login(data) {
        const email = email_f;
        const pswd = data.get("pswd");
        const email_e = document.querySelector('.login .inputform.email')

        await axios.post('/loginServer', {email, pswd})
        .then(res => {
            openAlert(res.data.theme, res.data.title, res.data.content) 
            if (res.data.theme != 'success') {
                email_e.value = email
            }
            if (res.data.theme == 'success') {
                const accessToken = res.data.token
                const user_data = res.data.user_data
                localStorage.setItem('authToken', accessToken)
                localStorage.setItem('name', user_data.name)
                localStorage.setItem('email', user_data.email)
                localStorage.setItem('profile', user_data.profile)
                setAuthToken(accessToken)
            }
        })
        .catch(err => {
            console.error(err)
            openAlert('danger', 'Error', "Unable to login via API")
        })
    }

    async function refreshToken() {
        await axios.post('/tokenServer')
            .then(res => {
                const accessToken = res.data.token
                localStorage.setItem('authToken', accessToken)
                setAuthToken(accessToken)
                console.log(accessToken);
            })
            .catch(err => {
                console.error('Error refreshing token:', err);
            })
    };

    const isTokenExpired = () => {
        const token = localStorage.getItem('authToken');

        if (!token) return true;
        if (token.split('.').length !== 3) {
            console.error('Invalid token format');
            return true;
        }
        
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            return decodedToken.exp < Date.now() / 1000;
        } catch (e) {
            console.error('Error decoding token:', e);
            return true;
        }
    };



    return (
        <>
        <header id="header">
            <div className="container">
                <img className="logo" src={TSLlogo} style={{width: 'calc(4.2em)'}}/>
                <nav>
                    <ul id="nav-list">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#content">Content</a></li>
                    </ul>
                    <button id="burger"><i className="fa fa-bars"></i></button>
                </nav>
            </div>
        </header>
        <div className="mainForm">
            <input type="checkbox" id="chkFormSec" aria-hidden="true" className="inputform" />
            <div className="signup">
                <form action={signup}>
                    <label htmlFor="chkFormSec" aria-hidden="true" className="handler">Sign up</label>
                    <div className="logsignSend signinBtnGroup">
                        <input type="text" name="name" placeholder="name" required className="inputform name" onChange={e => setName(e.target.value)}/>
                        <input type="email" name="email" placeholder="email" required className="inputform email" onChange={e => setEmail(e.target.value)}/>
                        <input type="password" name="pswd" placeholder="password" minLength={8} required className="inputform" />
                        <button id='btnFormSign' className="btnform">Sign up</button>
                    </div>
                </form>
            </div>
            <div className="login">
                <form action={login}>
                    <label htmlFor="chkFormSec" aria-hidden="true" className="handler">Already a user?</label>
                    <div className="logsignSend loginBtnGroup" inert>
                        <input type="email" name="email" placeholder="email" required className="inputform email" onChange={e => setEmail(e.target.value)}/>
                        <input type="password" name="pswd" placeholder="password" required className="inputform" />
                        <button id='btnFormLog' className="btnform">Login</button>
                    </div>
                </form>
            </div>
        </div>
        <section id="home" className="hero">
            <div className="container">
                <h2>Welcome to <span className="accent">ThSL learn place</span></h2>
                <p>A fun, free and awesome way to learn languages!</p>
                <div className="social">
                    <i className="ph ph-hand-palm"></i>
                    <i className="ph ph-hand-peace"></i>
                    <i className="ph ph-hand-pointing"></i>
                    <i className="ph ph-hand-waving"></i>
                    <i className="ph ph-hands-praying"></i>
                    <i className="ph ph-hand-grabbing"></i>
                </div>
                <a className="btn" id='loginClick'>Let's Start</a>
            </div>
        </section>
        <div className="sectionAbout" id="about">
            <section className="section aboutSec">
                <div className="container grid-2">
                    <img className='image' src="https://placehold.co/500x500" alt="Profile"/>
                    <div className="text">
                        <h3 className="whatHead">What is this?</h3>
                        <p className='thaiSpread'>
                            Thai Sign Language is the primary language for the hearing impaired to communicate in Thailand. However, 
                            Thai society still lacks easily accessible and quality tools for learning and interpreting sign language systematically. 
                            This project aims to develop a platform that uses technology to help reduce the communication gap and increase learning opportunities for everyone in society. 
                            It is supported by funding from NSTDA and has received sign language data from the Thai Deaf Association.
                        </p>
                        <br/>
                        <h4>Powered by</h4>
                        <ul className="tech-list">
                            <li>
                                <img src="https://www.rapiddg.com/sites/default/files/imce-files/react.png"/>
                                React
                            </li>
                            <li>
                                <img src="https://viz.mediapipe.dev/logo.png"/>
                                Mediapipe
                            </li>
                            <li>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/800px-Heart_coraz%C3%B3n.svg.png"/>
                                And Love
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <br></br>
            <section className="section aboutSec">
                <div className="container grid-2">
                    <div className="text">
                        <h3 className="whatHead">About us</h3>
                        <p className='thaiSpread'>
                            We are a group of students from Nongbua Pittayakarn School who have developed this web application to provide a convenient and accessible tool for those interested in learning Thai Sign Language. 
                            It uses motion detection technology through video cameras to translate sign language into text in real-time.
                        </p>
                        <br/>
                        <h4>Participants</h4>
                        <ul className="tech-list">
                            <li>
                                <img src="https://www.rapiddg.com/sites/default/files/imce-files/react.png"/>
                                Dontarit Haisok
                            </li>
                            <li>
                                <img src="https://www.rapiddg.com/sites/default/files/imce-files/react.png"/>
                                Chindanai Chaipim
                            </li>
                            <li>
                                <img src="https://www.rapiddg.com/sites/default/files/imce-files/react.png"/>
                                Tanawit Phadasri
                            </li>
                        </ul>
                    </div>
                    <img className='image' src="https://placehold.co/500x500" alt="Profile"/>
                </div>
            </section>
        </div>
        <section id="content" className="section dark">
            <div className="container">
                <h3 className="section-title">Why choose us?</h3>
                <div id="project-grid" className="grid-3"></div>
            </div>
        </section>
        <section id="together" className="section">
            <div className="container">
                <h3 className="section-title">
                    <p>Let's learn</p>
                    <p className='accent'>Thai Sign Language</p>
                </h3>
                <a href="#home" className="btn small">I'm ready</a>
            </div>
        </section>
        <footer>
            <div className="container">
                <p>© <span id="year"></span> | Crafted with <i className="ph-fill ph-heart"></i> by Dontarit</p>
            </div>
        </footer>
        <div id="overlay-setting-container"></div>
        </>
    )
}