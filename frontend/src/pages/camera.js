import { useEffect, useState } from 'react';
import axios from 'axios'

import openAlert from '../js/alert-box.js'
import getBase from '../js/getBase.js'

import TSLlogo from '../assets/img/TSLlogo.png';

export default function CameraTranslate() {
    getBase()
    import('../assets/font/font.css')
    import('../css/learnPlace.css')
    import('../css/sub/searchbox.css')
    import('../css/sub/alert_box.css')
    
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [settingStore, setSettingStore] = useState({
        setValue: {
            schedule: 4,
            streak: false,
            theme: 'light',
            time: '00:10'
        },
        value: {
            schedule: 4,
            streak: false,
            theme: 'light',
            time: '00:10'
        }
    })

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

    useEffect(() => {
        if (!authToken && isTokenExpired()) {
            const linkButtonNavigate = document.createElement('a');
            linkButtonNavigate.href = '/home'
            linkButtonNavigate.click()
            return
        }
        import('../css/camera.css')
        import('../css/sub/sub-camera.css')
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
        checkTheme(settingStore.value.theme)
    }, [authToken]);
    
    function checkTheme(theme) {
        const validThemes = ['light', 'dark', 'ocean'];
        if (validThemes.includes(theme)) {
            document.querySelector('body').setAttribute('data-theme', theme);
        }
    }



    return (
        <>
        <header className='headerSection'>
            <div className="con-header">
                <div className="open-menu me-hed-btn" id="menuBtn">
                        <span className="menu-btn-out"></span>
                        <div className="menu-btn-gruop">
                            <span className="menu-btn-in"></span>
                            <span className="menu-btn-in"></span>
                        </div>
                        <span className="menu-btn-out"></span>
                </div>
                <div className="main-logo">
                    <img src={TSLlogo} alt='logo'/>
                </div>
                <div className="open-setting me-hed-btn settingIconOpen Spin-n">
                    <i className="ph-fill ph-gear-six"></i>
                </div>
            </div>
        </header>
        <div className="mainContent-container">
            {/* <div className="Cam-Search">
                <button className="searchBoxBtn search-animate btnAnimate" id="activateSearch">
                    <p>Search for a word</p>
                    <i className="ph ph-magnifying-glass"></i>
                </button>
                <button className="cameraBoxBtn btnAnimate" 
                    onClick={() => {
                        const linkButtonNavigate = document.createElement('a');
                        linkButtonNavigate.href = '/learn'
                        linkButtonNavigate.click()
                    }}
                >
                    <p>Translate with camera</p>
                    <i className="ph-fill ph-camera"></i>
                </button>
            </div> */}
            <video className="input_video"></video>
            <section className="canvas-container">
                <div className="output-container">
                    <canvas className="output_canvas" width="720px" height="960px"></canvas>
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
        </div>
        <div className="control-panel"></div>
        {/* <div className="control-panel" style={{display: 'none'}}></div> */}
        </>
    )
}