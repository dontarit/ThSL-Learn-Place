import { useEffect, useState } from 'react';
import axios from 'axios'

import TSLlogo from '../assets/img/TSLlogo.png';

export default function AdminPage() {
    function setDarkMode() {
        document.querySelector('body').setAttribute('data-theme', 'dark');
    }
    function setLightMode() {
        document.querySelector('body').setAttribute('data-theme', 'light');
    }
    setDarkMode()
    
    useEffect(() => { 
        import('../assets/font/font.css')
        import('../css/adminPage.css')
    }, []);

    return (
        <>
        <header>
            <div className="con-header" style={{justifyContent: 'center'}}>
                <div className="main-logo">
                    <img src={TSLlogo} alt='logo'/>
                </div>
            </div>
        </header>
        
        <div className="mainContent-container">
            <section className="IntroText">
                <h1>Welcome to <div>TSL</div> admin page</h1>
                <p>This is monitor to control whole of TSL website</p>
            </section>
            <section className="menuSelect">
                <div className='btnSlc' style={{backgroundColor: '#62c2c1'}}>
                    <i className="ph-fill ph-camera"></i>
                    <h1>Create Training Data</h1>
                </div>
                <div className='btnSlc' style={{backgroundColor: '#f6cf55'}}>
                    <i className="ph-fill ph-user"></i>
                    <h1>User Management</h1>
                </div>
                <div className='btnSlc' style={{backgroundColor: '#c4e456'}}>
                    <i class="ph ph-database"></i>
                    <h1>ThSl Management</h1>
                </div>
            </section>
        </div>
        </>
    );
}