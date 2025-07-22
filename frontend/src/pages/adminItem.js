import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'

import NotFoundPage from '../pages/notfound.js';
import getBase from '../js/getBase.js'

import TSLlogo from '../assets/img/TSLlogo.png';

export default function AdminPageItems() {
    const navigate = useNavigate();
    const loadCssFiles = async () => {
        await import('../assets/font/font.css')
        await import('../css/admin/style.css')
        await import('../css/admin/side_nav.css')
    };
    loadCssFiles();
    getBase()

    const id = useParams()
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [isAdmin, setIsAdmin] = useState();

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
            // const linkButtonNavigate = document.createElement('a');
            // linkButtonNavigate.href = '/home'
            // linkButtonNavigate.click()
            navigate('/home')
        }
        if (id.page == 'create') {
            import('../css/admin/create.css')
            const script = [
                "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js",
                "https://cdn.jsdelivr.net/npm/@mediapipe/control_utils@0.6/control_utils.js",
                "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3/drawing_utils.js",
                "https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5/holistic.js"
            ];
            script.forEach(srcJs => {
                const script = document.createElement('script');
                script.src = srcJs;
                script.async = true;
                script.crossOrigin = "anonymous";
                document.head.appendChild(script);
            })
            import('../js/admin-create.js')
        }
    }, [authToken, isAdmin]);
    
    if (!isAdmin) {
        return <NotFoundPage />;
    }

    async function handleLogout() {
        localStorage.removeItem('authToken')
        localStorage.setItem('name', '')
        localStorage.setItem('email', '')
        localStorage.setItem('profile', '')
        setAuthToken(false);
        await axios.post('/logoutServer')
            .then(res => {
                if (authToken && isTokenExpired()) {
                    // const linkButtonNavigate = document.createElement('a');
                    // linkButtonNavigate.href = '/home'
                    // linkButtonNavigate.click()
                    navigate('/home')
                    return
                }
            })
            .catch(err => {
                console.log('error')
            })
    }

    const adminGeneralItems = [
        {
            id: 1,
            link: 'create',
            icon: 'ph-camera',
            title: 'Create Data'
        },
        {
            id: 2,
            link: 'user',
            icon: 'ph-identification-card',
            title: 'User Management'
        },
        {
            id: 3,
            link: 'thsl',
            icon: 'ph-database',
            title: 'ThSL Management'
        },
    ]

    let pageMount
    let asideBar = (
        <aside className="vertical-sidebar">
            <input type="checkbox" role="switch" id="checkbox-input" className="checkbox-input" defaultChecked/>
            <nav className="naviSidebar">
                <header className="headerSidebar">
                    <figure className="figsidebar-container">
                        <img className="codepen-logo" src={TSLlogo}/>
                        <figcaption className="figsidebar">
                            <p className="user-id">Thai Sign Language</p>
                            <p className="user-role">Admin</p>
                        </figcaption>
                    </figure>
                </header>
                <section className="sidebar__wrapper">
                    <ul className="sidebar__list list--primary">
                        <li className="sidebar__item item--heading">
                            <h2 className="sidebar__item--heading textSetupSide">general</h2>
                        </li>
                        <li className="sidebar__item">
                            <a className="sidebar__link" href='/admin' data-tooltip='Admin'>
                                <span className="icon">
                                    <i className="ph ph-identification-badge"></i>
                                </span>
                                <span className="text">Admin</span>
                            </a>
                        </li>
                        {
                            adminGeneralItems.map((item) => (
                                <li className="sidebar__item" key={item.id}>
                                    <a href={item.link} data-tooltip={item.title}
                                        className={
                                            `sidebar__link  ${id.page == item.link ? 'selected' : null}`
                                        }
                                    >
                                        <span className="icon">
                                            <i className={`ph ${item.icon}`}></i>
                                        </span>
                                        <span className="text">{item.title}</span>
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                    <ul className="sidebar__list list--secondary">
                        <li className="sidebar__item item--heading">
                            <h2 className="sidebar__item--heading textSetupSide">page</h2>
                        </li>
                        <li className="sidebar__item">
                            <a className="sidebar__link" href="/home" data-tooltip="Home">
                                <span className="icon">
                                    <i className="ph ph-house-line"></i>
                                </span>
                                <span className="text">To Home</span>
                            </a>
                        </li>
                        <li className="sidebar__item">
                            <a className="sidebar__link" href="/learn" data-tooltip="Main">
                                <span className="icon">
                                    <i className="ph ph-lightbulb"></i>
                                </span>
                                <span className="text">To Main</span>
                            </a>
                        </li>
                    </ul>
                    <ul className="sidebar__list list--secondary">
                        <li className="sidebar__item item--heading">
                            <h2 className="sidebar__item--heading textSetupSide">profile</h2>
                        </li>
                        <li className="sidebar__item">
                            <a className="sidebar__link" href="" data-tooltip="Profile">
                                <span className="icon">
                                    <i className="ph ph-user"></i>
                                </span>
                                <span className="text">Profile</span>
                            </a>
                        </li>
                        <li className="sidebar__item">
                            <a className="sidebar__link" href="" data-tooltip="Settings">
                                <span className="icon">
                                    <i className="ph ph-gear-six"></i>
                                </span>
                                <span className="text">Settings</span>
                            </a>
                        </li>
                        <li className="sidebar__item">
                            <a className="sidebar__link" href="" data-tooltip="Logout" onClick={handleLogout}>
                                <span className="icon">
                                    <i className="ph ph-sign-out"></i>
                                </span>
                                <span className="text">Logout</span>
                            </a>
                        </li>
                    </ul>
                </section>
            </nav>
        </aside>
    )

    if (id.page == 'create') {
        pageMount = (
            <>
            <div className='mainWithSidebar'>
                {asideBar}
                <div className="mainContent-container">
                    <video className="input_video"></video>
                    <section className="canvas-container">
                        <div className="output-container">
                            <canvas className="output_canvas" width="720px" height="960px"></canvas>
                            {/* <canvas className="output_canvas" width="240px" height="320px"></canvas> */}
                        </div>
                        <div className="informationRec">
                            <div className='filerec'>
                                <p>File :</p>
                                <p id="fileRec">&nbsp;0/0</p>
                            </div>
                            <div className='framerec'>
                                <p>Frame : </p>
                                <p id="frameRec">&nbsp;0/0</p>
                            </div>
                        </div>
                        <div className="record-container">
                            <input type="button" value="Record" className="record-btn on" id="record"/>
                            <input type="button" value="Stop" className="record-btn disable" id="stop" disabled/>
                            <input type="button" value="Bone" className="record-btn on" id="bone"/>
                        </div>
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    </section>
                    <section className="download-container">
                        <p id="head">Download</p>
                        <div className="file-list"></div>
                    </section>
                </div>
            </div>
            <div className="control-panel" style={{display: 'none'}}></div>
            </>
        );
    }
    else {
        return (
            <NotFoundPage/>
        )
    }

    return pageMount
}