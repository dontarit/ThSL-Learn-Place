import { useEffect, useState } from 'react';
import axios from 'axios'

import TSLlogo from '../assets/img/TSLlogo.png';

export default function AdminPage() {
    useEffect(() => { 
        import('../assets/font/font.css')
        import('../css/admin/style.css')
        import('../css/admin.css')
        import('../css/admin/side_nav.css')

        const main = document.querySelector('.mainContent-container')
        const side = document.querySelector('.naviSidebar')
        window.addEventListener('load', () => {
            main.style.width = `calc(100% - ${side.offsetWidth}px)`
        })
    }, []);

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
                                <a className="sidebar__link selected" data-tooltip="Inbox">
                                    <span className="icon">
                                        <i class="ph ph-identification-badge"></i>
                                    </span>
                                    <span className="text">Admin</span>
                                </a>
                            </li>
                            <li className="sidebar__item">
                                <a className="sidebar__link" href="/admin/create" data-tooltip="Inbox">
                                    <span className="icon">
                                        <i className="ph ph-camera"></i>
                                    </span>
                                    <span className="text">Create Data</span>
                                </a>
                            </li>
                            <li className="sidebar__item">
                                <a className="sidebar__link" href="#" data-tooltip="Favourite">
                                    <span className="icon">
                                        <i className="ph ph-identification-card"></i>
                                    </span>
                                    <span className="text">User Management</span>
                                </a>
                            </li>
                            <li className="sidebar__item">
                                <a className="sidebar__link" href="#" data-tooltip="Favourite">
                                    <span className="icon">
                                        <i className="ph ph-database"></i>
                                    </span>
                                    <span className="text">ThSL Management</span>
                                </a>
                            </li>
                        </ul>
                        <ul className="sidebar__list list--secondary">
                            <li className="sidebar__item item--heading">
                                <h2 className="sidebar__item--heading textSetupSide">page</h2>
                            </li>
                            <li className="sidebar__item">
                                <a className="sidebar__link" href="/home" data-tooltip="Inbox">
                                    <span className="icon">
                                        <i className="ph ph-house-line"></i>
                                    </span>
                                    <span className="text">To Home</span>
                                </a>
                            </li>
                            <li className="sidebar__item">
                                <a className="sidebar__link" href="/learn" data-tooltip="Inbox">
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
                                <a className="sidebar__link" href="#" data-tooltip="Profile">
                                    <span className="icon">
                                        <i className="ph ph-user"></i>
                                    </span>
                                    <span className="text">Profile</span>
                                </a>
                            </li>
                            <li className="sidebar__item">
                                <a className="sidebar__link" href="#" data-tooltip="Settings">
                                    <span className="icon">
                                        <i className="ph ph-gear-six"></i>
                                    </span>
                                    <span className="text">Settings</span>
                                </a>
                            </li>
                            <li className="sidebar__item">
                                <a className="sidebar__link" href="#" data-tooltip="Logout">
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
                        <a href='/home' className='btnSlc'>
                            <i className="ph ph-house-line"></i>
                            <h1>To Home</h1>
                        </a>
                        <a href='/learn' className='btnSlc'>
                            <i className="ph ph-lightbulb"></i>
                            <h1>To Main</h1>
                        </a>
                        <a href='/admin/Create' className='btnSlc'>
                            <i className="ph-fill ph-camera"></i>
                            <h1>Create Data</h1>
                        </a>
                        <a href='/admin/User' className='btnSlc'>
                            <i className="ph-fill ph-user"></i>
                            <h1>User Management</h1>
                        </a>
                        <a href='/admin/ThSL' className='btnSlc'>
                            <i className="ph ph-database"></i>
                            <h1>ThSl Management</h1>
                        </a>
                    </div>
                </section>
            </div>
        </div>
        </>
    );
}