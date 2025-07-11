import { useEffect, useState } from 'react';

import TSLlogo from '../../assets/img/TSLlogo.png';

export default function AdminCreate() {
    useEffect(() => {
        import('../../assets/font/font.css')
        import('../../css/admin/style.css')
        import('../../css/admin/create.css')
        import('../../css/admin/side_nav.css')

        const main = document.querySelector('.mainContent-container')
        const side = document.querySelector('.naviSidebar')
        window.addEventListener('load', () => {
            main.style.width = `calc(100% - ${side.offsetWidth}px)`
        })
        
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

        import('../../js/admin/app-create.js')
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
                                <a className="sidebar__link" href="/admin" data-tooltip="Inbox">
                                    <span className="icon">
                                        <i class="ph ph-identification-badge"></i>
                                    </span>
                                    <span className="text">Admin</span>
                                </a>
                            </li>
                            <li className="sidebar__item">
                                <a className="sidebar__link selected" data-tooltip="Create Data">
                                    <span className="icon">
                                        <i className="ph ph-camera"></i>
                                    </span>
                                    <span className="text">Create Data</span>
                                </a>
                            </li>
                            <li className="sidebar__item">
                                <a className="sidebar__link" href="/admin/user" data-tooltip="User Management">
                                    <span className="icon">
                                        <i className="ph ph-identification-card"></i>
                                    </span>
                                    <span className="text">User Management</span>
                                </a>
                            </li>
                            <li className="sidebar__item">
                                <a className="sidebar__link" href="/admin/thsl" data-tooltip="Thai Sign Management">
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
                                <a className="sidebar__link" href="" data-tooltip="Logout">
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