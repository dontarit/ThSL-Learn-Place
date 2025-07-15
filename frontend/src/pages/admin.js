import { useEffect, useState } from 'react';
import axios from 'axios'

import NotFoundPage from '../pages/notfound.js';
import getBase from '../js/getBase.js'

import TSLlogo from '../assets/img/TSLlogo.png';

export default function AdminPage() {
    getBase()
    
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [isAdmin, setIsAdmin] = useState('');

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
        const checkState = async () => {
            try {
                const res = await axios.post('/checkAdminServer', { token: authToken });
                setIsAdmin(res.data);
            } catch (err) {
                setIsAdmin(false);
            }
        };
        checkState();
        if (isAdmin) {
            const main = document.querySelector('.mainContent-container');
            const side = document.querySelector('.naviSidebar');
            window.addEventListener('load', () => {
                main.style.width = `calc(100% - ${side.offsetWidth}px)`;
            });
        }
        if (!isAdmin) {
            return <NotFoundPage />;
        }
    }, [authToken]);

    if (isAdmin) {
        import('../css/admin.css')
        import('../css/admin/style.css')
        import('../assets/font/font.css')
        import('../css/admin/side_nav.css')
    }
    if (!isAdmin) {
        return <NotFoundPage />;
    }

    async function handleLogout() {
        localStorage.setItem('authToken', 'none');
        localStorage.setItem('name', '')
        localStorage.setItem('email', '')
        localStorage.setItem('profile', '')
        setAuthToken(false);
        await axios.post('/logoutServer')
            .then(res => {
                if (authToken && isTokenExpired()) {
                    const linkButtonNavigate = document.createElement('a');
                    linkButtonNavigate.href = '/home'
                    linkButtonNavigate.click()
                    return
                } else {
                    console.log('welcome');
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
            title: 'Create Data',
            color: '#c4e456',
        },
        {
            id: 2,
            link: 'user',
            icon: 'ph-identification-card',
            title: 'User Management',
            color: '#6d9be4',
        },
        {
            id: 3,
            link: 'thsl',
            icon: 'ph-database',
            title: 'ThSL Management',
            color: '#f6cf55',
        },
    ]

    return (
        <>
        <div className='mainWithSidebar'>
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
                                <a className="sidebar__link selected" data-tooltip='Admin'>
                                    <span className="icon">
                                        <i className="ph ph-identification-badge"></i>
                                    </span>
                                    <span className="text">Admin</span>
                                </a>
                            </li>
                            {
                                adminGeneralItems.map((item) => (
                                    <li className="sidebar__item" key={item.id}>
                                        <a className="sidebar__link" href={`admin/${item.link}`} data-tooltip={item.title}>
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
                                <a className="sidebar__link" href="/home" data-tooltip="Home" target="_blank">
                                    <span className="icon">
                                        <i className="ph ph-house-line"></i>
                                    </span>
                                    <span className="text">To Home</span>
                                </a>
                            </li>
                            <li className="sidebar__item">
                                <a className="sidebar__link" href="/learn" data-tooltip="Main" target="_blank">
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
                                <a className="sidebar__link" data-tooltip="Logout" onClick={handleLogout}>
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
            <div className="mainContent-container">
                <section className="IntroText">
                    <h1>Welcome to <div>TSL</div> admin page</h1>
                    <p>This is the monitor to control whole of TSL website</p>
                </section>
                <section className="menuSelect">
                    <h1 className='topic'>Select where to go</h1>
                    <div className='container'>
                        <a href='/home' className='btnSlc' target="_blank">
                            <i className="ph ph-house-line"></i>
                            <h1>To Home</h1>
                        </a>
                        <a href='/learn' className='btnSlc' target="_blank">
                            <i className="ph ph-lightbulb"></i>
                            <h1>To Main</h1>
                        </a>
                        {
                            adminGeneralItems.map((item) => (
                                <a href={`admin/${item.link}`} className='btnSlc' key={item.id} style={{backgroundColor: item.color}}>
                                    <i className={`ph ${item.icon}`}></i>
                                    <h1>{item.title}</h1>
                                </a>
                            ))
                        }
                    </div>
                </section>
            </div>
        </div>
        </>
    );
}