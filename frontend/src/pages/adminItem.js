import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'

import NotFoundPage from '../pages/notfound.js';
import getBase from '../js/getBase.js'
import openAlert from '../js/alert-box.js'
import { isTokenExpired } from '../js/tokenManipulate.js';
import { handleLogoutAcc } from '../js/page_utility/normal.js';

import TSLlogo from '../assets/img/TSLlogo.png';

export default function AdminPageItems() {
    import('../css/admin/style.css')
    import('../css/admin/side_nav.css')
    const navigate = useNavigate();
    getBase()

    const id = useParams()
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [isAdmin, setIsAdmin] = useState(null);
    const [isFetching, setFetching] = useState(false);
    const [users, setUsers] = useState([]);
    const [thsls, setThsls] = useState([]);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function checkState() {
            try {
                const res = await axios.post('/checkAdminServer', { token: authToken });
                setIsAdmin(res.data == 1 || res.data == 2); 
            } catch (err) {
                setIsAdmin(false);
            }
        }

        if (authToken) {
            checkState();
        } else {
            setIsAdmin(false);
        }

        const addedScripts = [];
        const addedStyles = [];
        let cleanupFn = null;

        const loadScript = (src) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.crossOrigin = 'anonymous';
            document.head.appendChild(script);
            addedScripts.push(script);
        };

        if (id.page === 'create') {
            import('../css/admin/create.css')
            const scripts = [
                'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils@0.6/control_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3/drawing_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5/holistic.js'
            ];
            scripts.forEach(loadScript);

            import('../js/admin-create.js').then((module) => {
                if (module && typeof module.cleanup === 'function') {
                    cleanupFn = module.cleanup;
                }
            });
        }
        else if (id.page === 'user') {
            import('../css/admin/user.css')
            user_fetchData();
        }
        else if (id.page === 'thsl') {
            import('../css/admin/user.css')
            thsl_fetchData(0);

            const fetchBtn = document.querySelector('.fetchDatatbThSLManage')
            async function hookState() {
                await axios.post('/checkHookState').then(res => {
                    // console.log(parseInt(res.data));
                    // console.log(Boolean(parseInt(res.data)));
                    if (Boolean(parseInt(res.data))) {
                        setFetching(true)
                        fetchBtn.inert = true
                        fetchBtn.innerText = 'Fetching, please wait...'
                        fetchBtn.style.backgroundColor = 'rgb(80, 75, 75)'
                        fetchBtn.style.color = '#aaaaaa'
                        return
                    }
                }).catch(err => {
                    setFetching(true)
                    fetchBtn.inert = true
                    fetchBtn.innerText = 'Something went wrong'
                    fetchBtn.style.backgroundColor = 'rgb(80, 75, 75)'
                    fetchBtn.style.color = '#aaaaaa'
                    return
                })
            }
            hookState()
        }
        if (id.page === 'model') {
            import('../css/admin/create.css')
            const scripts = [
                'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3/camera_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils@0.6/control_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3/drawing_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5/holistic.js'
            ];
            scripts.forEach(loadScript);

            import('../js/admin-create.js').then((module) => {
                if (module && typeof module.cleanup === 'function') {
                    cleanupFn = module.cleanup;
                }
            });
        }
        
        return () => {
            addedScripts.forEach(script => {
                if (script && script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            });
            if (cleanupFn) cleanupFn();
        };
    }, [authToken, id.page, isAdmin]);


    if (isAdmin === null) {
        return <div>Loading...</div>;
    }
    if (!isAdmin) {
        return <NotFoundPage />;
    }

    async function handleLogout() {
        const result = await handleLogoutAcc(authToken, setAuthToken);
        
        navigate(result.navigate, { replace: true })
        const [theme, title, content] = result.alert_value;
        openAlert(theme, title, content);
    }

    // -------- user --------

    async function user_fetchData() {
        await axios.post('/fetchUserData').then(res => {
            setUsers(res.data);
            setLoading(false);
        })
        .catch((error) => {
            openAlert('danger', 'Error', "Unable to fetch user data")
        });
    }

    async function user_handleDelete(userId, userEmail) {
        const getPrompt = prompt(`To confirm, type "${userEmail}" in the box below`)
        if (getPrompt == userEmail) {
            axios.post(`/deleteAccount`, {userId: userId}).then(res => {
                user_fetchData()
                openAlert(res.data.theme, res.data.title, res.data.content)
            })
            .catch((error) => {
                console.error(error);
                openAlert('danger', 'Error', "Unable to delete user")
            });
        } else {
            openAlert('info', 'Cancel', "Cancel account deletion")
        }
    };

    async function user_handleSetAdmin(userId, setValue) {
        axios.post(`/setUserAdmin`, {userId: userId, setTo: setValue}).then(res => {
            user_fetchData()
            openAlert(res.data.theme, res.data.title, res.data.content)
        })
        .catch((error) => {
            console.error(error);
            openAlert('danger', 'Error', "Unable to set admin state")
        });
    };

    // -------- ThSL --------

    async function handleHookThSLData(element) {
        if (isFetching) return

        const getPrompt = prompt(`This process will replaced all data with the new one. To confirm, type "fetch" in the box below`)

        if (getPrompt == 'fetch') {
            element.inert = true
            element.innerText = 'Fetching, please wait...'
            element.style.backgroundColor = 'rgb(80, 75, 75)'
            element.style.color = '#aaaaaa'

            openAlert('info', 'Called', "Trying to retrieve data, might take some time")
            
            axios.post(`/hookDataThSL`).then(res => {
                openAlert(res.data.theme, res.data.title, res.data.content)
                setFetching(false)
                element.inert = false
                element.innerText = 'Fetch data'
                element.style.backgroundColor = '#4CAF50'
                element.style.color = '#fff'
                console.log(res.data.word);
            })
            .catch((error) => {
                console.error(error);
                openAlert('danger', 'Error', "Unable to save data")
            });
        } else {
            openAlert('info', 'Canceled', "Cancel fetching data")
        }
    }
    
    async function thsl_fetchData(page) {
        await axios.post('/fetchThSLData', {page: page}).then(res => {
            setThsls(res.data.result)
            setLoading(false);

            const maxPages = Math.floor(res.data.page / 15);
            const pageOptions = [];
            for (let i = 1; i <= maxPages; i++) {
                pageOptions.push(i);
            }            
            setOptions(pageOptions);
        })
        .catch((error) => {
            openAlert('danger', 'Error', "Unable to fetch ThSL data")
            console.log(error);
        });
    }

    async function thsl_handleDelete(id, title) {
        const getPrompt = prompt(`To confirm, type "${title}" in the box below`)
        if (getPrompt == title) {
            axios.post(`/deleteThSLWord`, {wordId: id}).then(res => {
                thsl_fetchData(0)
                openAlert(res.data.theme, res.data.title, res.data.content)
            })
            .catch((error) => {
                console.error(error);
                openAlert('danger', 'Error', "Unable to delete the word")
            });
        } else {
            openAlert('info', 'Cancel', "Cancel word deletion")
        }
    };

    async function thsl_handleChange_Title(id, title) {
        const getPrompt = prompt(`The title of "${title}" will change to..`)
        if (getPrompt == undefined || getPrompt == '') {
            openAlert('info', 'Cancel', "Cancel title change")
        }
        else {
            axios.post(`/changeThSL_Title`, {wordId: id, changeTo: getPrompt}).then(res => {
                thsl_fetchData(0)
                openAlert(res.data.theme, res.data.title, res.data.content)
            })
            .catch((error) => {
                console.error(error);
                openAlert('danger', 'Error', "Unable to set title")
            });
        }
    };
    
    async function thsl_handleChange_Description(id, title) {
        const getPrompt = prompt(`The descript of "${title}" will change to..`)
        if (getPrompt == undefined) {
            openAlert('info', 'Cancel', "Cancel description change")
        }
        else {
            axios.post(`/changeThSL_Description`, {wordId: id, changeTo: getPrompt}).then(res => {
                thsl_fetchData(0)
                openAlert(res.data.theme, res.data.title, res.data.content)
            })
            .catch((error) => {
                console.error(error);
                openAlert('danger', 'Error', "Unable to set description")
            });
        }
    };

    const adminGeneralItems = [
        { id: 1, link: 'create', icon: 'ph-camera', title: 'Create Data', color: '#c4e456' },
        { id: 2, link: 'user', icon: 'ph-identification-card', title: 'User Management', color: '#6d9be4' },
        { id: 3, link: 'thsl', icon: 'ph-database', title: 'ThSL Management', color: '#f6cf55' },
        { id: 4, link: 'model', icon: 'ph ph-sphere', title: 'Model Testing', color: '#837fe4ff' },
    ];

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
    else if (id.page == 'user') {
        pageMount = (
            <>
            <div className='mainWithSidebar'>
                {asideBar}
                <div className="mainContent-container">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <table className='userAccountTable_Container'>
                            <thead className='titleTable'>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='contentTable'>
                                {users.map((user) => {
                                    return (
                                        <tr className='contentTableRow' key={user.user_id}>
                                            <td className='setWidthFixtb'>{user.user_name}</td>
                                            <td className='setWidthFixtb'>{user.user_email}</td>
                                            <td className='setWidthFixtb'>{user.admin_state == 1 || user.admin_state == 2 ? "Admin" : "User"}</td>
                                            <td className='tbActionBtn_container setWidthFixtb'>
                                                {user.admin_state == 2 ? (
                                                    <button className='tbSetadBtn tbActionBtn tdRootAdmin'>Delete</button>
                                                ) : <button className='tbDeleteBtn tbActionBtn' onClick={() => user_handleDelete(user.user_id, user.user_email)}>Delete</button>}
                                                {user.admin_state == 2 ? (
                                                    <button className='tbSetadBtn tbActionBtn tdRootAdmin'>This can't be change</button>
                                                ) : user.admin_state == 1 ? (
                                                    <button className='tbSetadBtn tdNotAdmin tbActionBtn' onClick={() => user_handleSetAdmin(user.user_id, 0)}>Remove Admin</button>
                                                ) : <button className='tbSetadBtn tdNowAdmin tbActionBtn' onClick={() => user_handleSetAdmin(user.user_id, 1)}>Set as Admin</button>}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot className='TalbeEndhere'>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    )}
                </div>
            </div>
            <div className="control-panel" style={{display: 'none'}}></div>
            </>
        );
    }
    else if (id.page == 'thsl') {        
        pageMount = (
            <>
            <div className='mainWithSidebar'>
                {asideBar}
                <div className="mainContent-container">
                    <div className='fetchDatatbThSLManage_Cont'>
                        <button className='fetchDatatbThSLManage' type="submit" onClick={(e) => {
                            handleHookThSLData(e.currentTarget)
                        }}>Fetch data</button>
                    </div>
                    {loading ? (
                        <table className='wordDataTable_Container'>
                            <thead className='titleTable'>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>GIF</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='contentTable'>
                                <tr className='contentTableRow'>
                                    <td className='setWidthFixtb'>-</td>
                                    <td className='setWidthFixtb'>-</td>
                                    <td className='setWidthFixtb'>-</td>
                                    <td className='tbActionBtn_container setWidthFixtb'></td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <>
                        <table className='wordDataTable_Container'>
                            <thead className='titleTable'>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>GIF</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='contentTable'>
                                {thsls.map((data) => {
                                    let desc_data = JSON.parse(data.thsl_desc)[0].text
                                    return (
                                        <tr className='contentTableRow' key={data.id}>
                                            <td className='setWidthFixtb'>{data.thsl_word}</td>
                                            <td className='setWidthFixtb'>{desc_data == '' ? "ไม่พบข้อมูล" : desc_data}</td>
                                            <td className='setWidthFixtb'>
                                                <a href={data.thsl_src} target="_blank" rel="noopener noreferrer">{data.thsl_src}</a>
                                            </td>
                                            <td className='tbActionBtn_container setWidthFixtb'>
                                                <button className='tbSetadBtn tbActionBtn tbChangeData' onClick={() => thsl_handleChange_Title(data.id, data.thsl_word)}>Change Title</button>
                                                <button className='tbSetadBtn tbActionBtn tbChangeData' onClick={() => thsl_handleChange_Description(data.id, data.thsl_word)}>Change Desc</button>
                                                {/* <button className='tbDeleteBtn tbActionBtn' onClick={() => thsl_handleDelete(data.id, data.thsl_word)}>Delete</button> */}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            <tfoot className='TalbeEndhere'>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                        <div className='thslToggle'>
                            <div className='toggleSelect'>
                                <label htmlFor="thslToggleId">Select Page : </label>
                                <select id="thslToggleId" className="styled-select" onChange={(e) => {thsl_fetchData(e.target.value)}}>
                                    {options.map((page) => (
                                        <option key={page} value={page}>
                                            Page {page}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        </>
                    )}
                </div>
            </div>
            </>
        );
    }
    else if (id.page == 'model') {
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
                        <div className="record-container" style={{display: 'none'}}>
                            <input type="button" value="Record" className="record-btn on" id="record"/>
                            <input type="button" value="Stop" className="record-btn disable" id="stop" disabled/>
                            <input type="button" value="Bone" className="record-btn on" id="bone"/>
                        </div>
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
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