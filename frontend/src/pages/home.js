import { useEffect, useState } from 'react';
import "aos/dist/aos.css";
import AOS from "aos";
import axios from 'axios'

import TSLlogo from '../assets/img/TSLlogo.png';

export default function HomePage() {
    useEffect(() => {
        import('../assets/font/font.css')
        import('../css/home.css')
        import('../css/sub/waveBtn.css')
        import('../css/sub/logsignForm.css')
        
        AOS.init({
            duration: 800,
            once: false,
        });

        import('../js/app-home.js')

        let mainForm = document.querySelector('.mainForm')
        let overlay = document.querySelector('#overlay-setting-container')
        let mainClick = document.querySelector('.loginClick')

        mainClick.addEventListener('click', () => {
            mainForm.style.display = 'block'
            overlay.style.display = 'block'
            setTimeout(() => {
                mainForm.style.opacity = '1'
                overlay.style.opacity = '1'
            }, 1);
        })
        window.addEventListener('click', (e) => {
            if (e.target.id == 'overlay-setting-container') {
                mainForm.style.opacity = '0'
                overlay.style.opacity = '0'
                setTimeout(() => {
                    mainForm.style.display = 'none'
                    overlay.style.display = 'none'
                }, 250);
            }
        })
    }, []);

    const [name_f, setName] = useState('')
    const [email_f, setEmail] = useState('')

    function signup(data) {
        const name = name_f;
        const email = email_f;
        const pswd = data.get("pswd");
        const name_e = document.querySelector('.signup .inputform.name')
        const email_e = document.querySelector('.signup .inputform.email')

        console.log(name);
        console.log(email);
        console.log(pswd);

        axios.post('http://localhost:5000/signinServer', {name, email, pswd})
            .then(res => {
                name_e.value = name
                email_e.value = email
                console.log(res.data)
            })
            .catch(err => {console.error(err)})
    }

    async function login(data) {
        const email = data.get("email");
        const pswd = data.get("pswd");
    }

    return (
        <>
        <header id="header">
            <div className="container">
                <img className="logo" src={TSLlogo} style={{width: 'calc(4.2em)'}}/>
                <nav>
                    <ul id="nav-list">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#why-choose-us">Why Choose Us</a></li>
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
                        <input type="password" name="pswd" placeholder="password" required className="inputform" />
                        <button id='btnFormSign' className="btnform">Sign up</button>
                    </div>
                </form>
            </div>
            <div className="login">
                <form action={login}>
                    <label htmlFor="chkFormSec" aria-hidden="true" className="handler">Already a user?</label>
                    <div className="logsignSend loginBtnGroup">
                        <input type="email" name="email" placeholder="email" required className="inputform name" onChange={e => setEmail(e.target.value)}/>
                        <input type="password" name="pswd" placeholder="password" required className="inputform email" />
                        <button id='btnFormLog' className="btnform">Login</button>
                    </div>
                </form>
            </div>
        </div>
        <section id="home" className="hero">
            <div className="container">
                <h2 data-aos="fade-up" data-aos-once="true" data-aos-duration="1200">Welcome to <span className="accent">ThSL learn place</span></h2>
                <p data-aos="fade-up" data-aos-delay="100" data-aos-once="true" data-aos-duration="1200">A fun, free and awesome way to learn languages!</p>
                <div className="social" data-aos="fade-up" data-aos-once="true" data-aos-delay="200" data-aos-duration="1200">
                    <i className="ph ph-hand-palm"></i>
                    <i className="ph ph-hand-peace"></i>
                    <i className="ph ph-hand-pointing"></i>
                    <i className="ph ph-hand-waving"></i>
                    <i className="ph ph-hands-praying"></i>
                    <i className="ph ph-hand-grabbing"></i>
                </div>
                <a className="btn loginClick" data-aos-once="true" data-aos="zoom-in-up" data-aos-delay="300" data-aos-duration="1000">Let's Start</a>
            </div>
        </section>
        <div className="sectionAbout" id="about">
            <section className="section aboutSec">
                <div className="container grid-2" data-aos="fade-left">
                    <img className='image' src="https://placehold.co/500x500" alt="Profile"/>
                    <div className="text">
                        <h3 className="whatHead" data-aos="zoom-in-right" data-aos-duration="750">What is this?</h3>
                        <p data-aos="zoom-in-right" data-aos-duration="800">Have fun learning and practicing sign language on your own through the web app, with motion detection via video camera to translate text in real time.</p>
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
                        </ul>
                    </div>
                </div>
            </section>
            <br></br>
            <section className="section aboutSec">
                <div className="container grid-2" data-aos="fade-right">
                    <div className="text">
                        <h3 className="whatHead" data-aos="zoom-in-right" data-aos-duration="750">About us</h3>
                        <p data-aos="zoom-in-right" data-aos-duration="800">We are a group of students from Nongbua Pittayakarn School who created this web application to help those interested in learning Thai Sign Language have a convenient and accessible tool. It uses motion detection technology via video cameras to translate sign language into text in real time.</p>
                        <br/>
                        <h4>Participants</h4>
                        <ul className="tech-list">
                            <li>
                                <img src="https://www.rapiddg.com/sites/default/files/imce-files/react.png"/>
                                Dontarit Haisok
                            </li>
                        </ul>
                    </div>
                    <img className='image' src="https://placehold.co/500x500" alt="Profile"/>
                </div>
            </section>
        </div>
        <section id="why-choose-us" className="section dark">
            <div className="container">
                <h3 className="section-title" data-aos="zoom-in-up" data-aos-once='true'>Why choose us?</h3>
                <div id="project-grid" className="grid-3"></div>
            </div>
        </section>
        <section id="together" className="section">
            <div className="container">
                <h3 className="section-title">
                    <p>Let's learn</p>
                    <p className='accent'>Thai Sign Language</p>
                </h3>
                <a href="#home" className="btn">Let's Start</a>
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