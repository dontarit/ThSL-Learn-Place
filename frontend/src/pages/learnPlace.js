import { useEffect, useState } from 'react';
import axios from 'axios'

import TSLlogo from '../assets/img/TSLlogo.png';
import blankProfile from '../assets/img/blank-profile.png';
import newStar from '../assets/img/new star.png';
import littleStar from '../assets/img/little star.png';
import fullStar from '../assets/img/full star.png';
import searchBtn from '../assets/img/searchBtn.png';
import favBtn from '../assets/img/favBtn.png';
import handPosBtn from '../assets/img/handPosBtn.png';
import handShapeBtn from '../assets/img/handShapeBtn.png';
import palmTurnBtn from '../assets/img/palmTurnBtn.png';
import daynightBtn from '../assets/img/daynightBtn.png';
import settingBtn from '../assets/img/settingBtn.png';
import mascot from '../assets/img/mascot.png';

export default function LearnPlace() {
    let searchingIdelay
    let searchController
    async function typingSearch(value) {
        clearTimeout(searchingIdelay);
        if (value == '') {
            console.log(searchController);
            cancelSearch()
            console.log(searchController);
        }else {
            searchingIdelay = setTimeout(async () => {
                searchController = new AbortController()
                const signal = searchController.signal
                console.log(searchController);
                console.log(signal);
    
                try {
                    // Make the initial request for the first page
                    const res = await axios.post('http://localhost:5000/learnServer', {
                        search_data: value,
                        search_page: 1,
                        signal: signal
                    });
                    console.log(res.data);
    
                    // Loop all pages from current to total
                    for (let i = res.data['pageNow']; i < res.data['pageAll']; i++) {
                        const pageRes = await axios.post('http://localhost:5000/learnServer', {
                            search_data: value,
                            search_page: i + 1,
                            signal: signal
                        });
                        console.log(pageRes.data);
                    }
                } catch (err) {
                    console.error('Error occurred during search:', err);
                }
            }, 1000);
        }
    }
    function cancelSearch() {
        if (searchController) {
            searchController.abort()
        }
    }
    // Activate when user press enter with search box
    function handleSearch(e) {
        e.preventDefault()
    }
    
    // Svae setting config
    const [settingStore, setSettingStore] = useState({
        setValue: {
            schedule: 4,
            streak: false,
            theme: 'dark',
            time: '00:10'
        },
        value: {
            schedule: 4,
            streak: false,
            theme: 'dark',
            time: '00:10'
        }
    })
    
    function changeStrTable(row, col) {
        const tableStr = document.querySelector('.showTableStr')
        tableStr.innerHTML = ''
        for (let i = 1; i <= row; i++) {
            let theRow = document.createElement('div')
            theRow.classList.add(`row-${i}`)
            theRow.classList.add("tableRow")

            for (let j = 1; j <= col; j++) {
                let theColumn = document.createElement('div')
                let progress = document.createElement('span')
                let i = document.createElement('i')

                theColumn.classList.add(`col-${j}`)
                theColumn.classList.add("tableColumn")
                progress.type = 'button'
                i.classList.add('ph-fill')
                i.classList.add('ph-check-circle')

                theColumn.appendChild(progress)
                theColumn.appendChild(i)
                theRow.appendChild(theColumn)
            }
            tableStr.appendChild(theRow)
        }
        document.querySelector('.tableColumn').style.width = 'calc(50% / (7 / 1.5))'
    }
    function disableStreak(disable) {
        let time = 500
        const main = document.querySelector('.mainContent-container')
        const schedule = document.querySelector('.schedule')
        main.style.transition = `${time}ms`
        schedule.style.transition = `${time}ms`
        if (disable) {
            main.style.transform = `translateY(calc(0% - clamp(1.2em, 8vw, 5em) - ${schedule.offsetHeight}px))`
            schedule.classList.add('disableSchedule')
        }else {
            main.style.transform = 'translateY(0%)'
            schedule.classList.remove('disableSchedule')
        }
    }
    function checkTheme(theme) {
        if (theme == 'dark') {
            document.querySelector('body').setAttribute('data-theme', 'dark')
        } else if (theme == 'light') {
            document.querySelector('body').setAttribute('data-theme', 'light')
        }
    }

    function comfirmSetting(apply) {
        const historyShow = document.getElementById('history-show')
        const streakShow = document.getElementById('streak-show')
        const themeShow = document.getElementById('theme-show')
        const timeShow = document.getElementById('time-show')
        if (apply) {
            Object.entries(settingStore.setValue).forEach(thevalue => {
                settingStore.value[thevalue[0]] = thevalue[1]
            })
        }
        const schedule = settingStore.value.schedule
        const streak = settingStore.value.streak
        const theme = settingStore.value.theme
        const time = settingStore.value.time

        changeStrTable(schedule, 7)
        historyShow.setAttribute('placeholder', `${schedule} week`)
        disableStreak(streak)
        streakShow.checked = streak
        checkTheme(theme)
        themeShow.value = theme
        timeShow.value = time
    }
    
    useEffect(() => { 
        import('../assets/font/font.css')
        import('../css/learnPlace.css')
        import('../css/sub/searchbox.css')
        import('../css/sub/setting_page.css')
        import('../css/sub/waveBtn.css')
        import('../js/app-learnPlace.js')
        comfirmSetting(true)
    }, []);



    return (
        <>
        <header>
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
                <div className="search-container" inert>
                    <div>
                        <form className="input-place" onSubmit={handleSearch}>
                            <button className="sideSearchSend" type='submit'>
                                <i className="ph ph-magnifying-glass"></i>
                            </button>
                            <input type="text" name="word" id="search-box" autoComplete="off" 
                                onChange={e => {typingSearch(e.target.value)}}
                            />
                        </form>
                        <div className="free-option">
                            <div className="clipboard">
                                <i className="ph ph-clipboard"></i>
                            </div>
                            <div className="history">
                                <i className="ph ph-clock-counter-clockwise"></i>
                            </div>
                            <div className="question">
                                <i className="ph ph-question"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="open-setting me-hed-btn settingIconOpen Spin-n">
                    <i className="ph-fill ph-gear-six"></i>
                </div>
            </div>
        </header>
        <div className="search-result" style={{display: 'none'}}>
            <div className="history-list">
                <div className="word-container">
                    <div>
                        <p>Hello</p>
                    </div>
                    <div>
                        <p id="meaning">The way to greeting</p>
                        <p id="group">3</p> 
                    </div>
                </div>
                <div className="word-container">
                    <div>
                        <p>Hello</p>
                    </div>
                    <div>
                        <p id="meaning">The way to greeting</p>
                        <p id="group">3</p> 
                    </div>
                </div>
                <div className="word-container">
                    <div>
                        <p>Hello</p>
                    </div>
                    <div>
                        <p id="meaning">The way to greeting</p>
                        <p id="group">3</p> 
                    </div>
                </div>
                <div className="word-container">
                    <div>
                        <p>Hello</p>
                    </div>
                    <div>
                        <p id="meaning">The way to greeting</p>
                        <p id="group">3</p> 
                    </div>
                </div>
            </div>
            <div className="search-list"></div>
        </div>
        <nav id="sideMenu" aria-hidden="true" role="navigation" aria-label="Side menu" inert>
            <div className="user-info">
                <div className="user-container">
                    <div className="user">
                        <div className="avatar">
                            <img src={blankProfile} alt='blank profile'/>
                        </div>
                        <div className="name-usetime">
                            <div className="not-signin" style={{display: 'none'}}>
                                <p>Haven't signed in yet?</p>
                                <button className="sign-button .sign-button-hover" role="button">
                                    <span id="navHead-txt">Sign In</span>
                                    <div className="liquid"></div>
                                </button>
                            </div>
                            <div className="already-signin">
                                {/* <p id="navHead-txt">USER NAME</p> */}
                                <p id="navHead-txt" title='Hello'>aaaaaaaaaaaaaaa</p>
                                <div id="usetime">
                                    <p>Time usage: </p>
                                    <p>-</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="stars">
                        <div className="newStar learn-star">
                            <img src={newStar}/>
                            <p id="newSP">0</p>
                        </div>
                        <div className="littleStar learn-star">
                            <img src={littleStar}/>
                            <p id="littleSP">0</p>
                        </div>
                        <div className="fullStar learn-star">
                            <img src={fullStar}/>
                            <p id="fullSP">0</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="nav-bar">
                <div className="first-nav typeNav">
                    <div className="searchBtn iconBtn forceCloseMenu" id="activateSearch">
                        <img src={searchBtn}/>
                        <p>Search</p>
                    </div>
                    <div className="favBtn iconBtn btnAnimate">
                        <img src={favBtn}/>
                        <p>Favorite</p>
                    </div>
                </div>
                <div className="second-nav typeNav">
                    <div className="positionBtn iconBtn btnAnimate">
                        <img src={handPosBtn}/>
                        <p>Hand Position</p>
                    </div>
                    <div className="shapeBtn iconBtn btnAnimate">
                        <img src={handShapeBtn}/>
                        <p>Hand Shape</p>
                    </div>
                    <div className="turningBtn iconBtn btnAnimate">
                        <img src={palmTurnBtn}/>
                        <p>Palm Turning</p>
                    </div>
                </div>
                <div className="third-nav typeNav">
                    <div className="daynightBtn iconBtn btnAnimate">
                        <img src={daynightBtn}/>
                        <p>Light/Dark</p>
                    </div>
                    <div className="settingBtn iconBtn forceCloseMenu open-setting">
                        <img src={settingBtn}/>
                        <p>Setting</p>
                    </div>
                </div>
            </div>
        </nav>
        <div className="mainContent-container">
            <section className="schedule">
                <div className="tell-streak">
                    <div className="streak-container stnow">
                        <p>Current streak</p>
                        <p id="dayStr">
                            <span>2</span>
                            <span>DAY</span>
                        </p>
                    </div>
                    <div className="streak-container stbest">
                        <p>Best streak</p>
                        <p id="bestStr">
                            <span>16</span>
                            <span>DAY</span>
                        </p>
                    </div>
                </div>
                <div className="showTableStr"></div>
                <div className="tell-history">
                    <p id="last-use">21/5/2025</p>
                    <p id="study-time">No History</p>
                </div>
            </section>
            <section className="lvl-review">
                <div className="charecter-box">
                    <img src={mascot}/>
                    <div className="textBox">
                        <div className="box1">
                            <div>
                                <span>You are currently studying</span>
                            </div>
                            <div>
                                <span>134</span>
                                <span>Thai Sign word.</span>
                            </div>
                        </div>
                        <div className="box2">
                            <div>
                                <span>Now you have</span>
                                <span>10</span>
                                <span>words</span>
                            </div>
                            <div>
                                <span>ready for review now</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="level-show">
                    <div className="level-current">
                        <p>
                            <span>Level</span>
                            <span>3-8</span>
                        </p>
                        <p>
                            <span>Next Level:</span>
                            <span>144</span>
                            <span>XP</span>
                        </p>
                    </div>
                    <progress id="UserLvl" value="32" max="100"></progress>
                </div>
                <div className="progress-word">
                    <div className="progress-0">
                        <p id="wordNumber">10</p>
                        <p>0% - 24%</p>
                    </div>
                    <div className="progress-1">
                        <p id="wordNumber">10</p>
                        <p>25% - 49%</p>
                    </div>
                    <div className="progress-2">
                        <p id="wordNumber">10</p>
                        <p>50% - 74%</p>
                    </div>
                    <div className="progress-3">
                        <p id="wordNumber">10</p>
                        <p>75% - 99%</p>
                    </div>
                    <div className="progress-4">
                        <p id="wordNumber">10</p>
                        <p><span>---</span>100%<span>---</span></p>
                    </div>
                </div>
                <div className="revBtn_container">
                    <button id="reviewBtn" className="btnAnimate">
                        <span>START REVIEW</span>
                        <span>(10)</span>
                    </button>
                </div>
            </section>
            <section className="Cam-Search">
                <button className="searchBoxBtn search-animate btnAnimate" id="activateSearch">
                    <p>Search for a word</p>
                    <i className="ph ph-magnifying-glass"></i>
                </button>
                <button className="cameraBoxBtn btnAnimate">
                    <p>Translate with camera</p>
                    <i className="ph-fill ph-camera"></i>
                </button>
            </section>
            <section className="To-Signin">
                <div className="Backup-info">
                    <p>Backup Info</p>
                    <div>
                        <span>You are not signed in yet.</span>
                        <span>Your information will not be saved.</span>
                    </div>
                </div>
                <button className="sign-button" role="button">
                    <span>Sign In</span>
                    <div className="liquid"></div>
                </button>
            </section>
        </div>
        <div className="setting-container">
            <div className="con-out">
                <p>Setting</p>
                <div>
                    <i className="ph ph-question-mark"></i>
                    <i className="ph ph-x closeSetting"></i>
                </div>
            </div>
            <div className="con-in">
                <div className="topSelect">
                    <p id="stcon-topic-0" className="set-at-main">Main</p>
                    <p id="stcon-topic-1" className="set-at-sub">Profile</p>
                </div>
                <div className="conFor-mainCon">
                    <div className="main main-content">
                        <section>
                            <div className="head-group">
                                <p className="head">Lession</p>
                                <span className="head-break"></span>
                            </div>
                            <div className="content">
                                <div className="sub-con valueInsert">
                                    <p title='Study history'>Study History</p>
                                    <input name="history-show" id="history-show" type="number" placeholder="4 week" autoComplete='off'
                                        onBlur={(e) => {
                                            let element = e.target
                                            let value = element.value == '' || element.value == null ? settingStore.value.schedule : element.value
                                            if (value > 100) {
                                                let time = 750
                                                let color = element.style.color
                                                element.inert = true
                                                element.setAttribute('type', 'text')
                                                element.value = 'Over limit'
                                                element.style.color = '#c32509'
                                                element.style.border = '3px solid #c32509'
                                                setTimeout(() => {
                                                    element.inert = false
                                                    element.setAttribute('type', 'number')
                                                    element.style.color = color
                                                    element.style.border = '3px solid #ccc'
                                                    element.value = ''
                                                }, time);
                                            } else {
                                                element.setAttribute('placeholder', `${value} week`)
                                                setSettingStore(prevState => ({
                                                    ...prevState,
                                                    setValue: {
                                                        ...prevState.setValue,
                                                        schedule: parseInt(value),
                                                    }
                                                }));
                                                element.value = ''
                                            }
                                        }}
                                    />
                                </div>
                                <div className="sub-con valueInsert">
                                    <p title='Show streak'>Show Streak</p>
                                    <input name="streak-show" id="streak-show" type="checkbox"
                                        onClick={(e) => {
                                            setSettingStore(prevState => ({
                                                ...prevState,
                                                setValue: {
                                                    ...prevState.setValue,
                                                    streak: e.target.checked
                                                }
                                            }));
                                        }}
                                    />
                                </div>
                                <div className="sub-con">
                                    <p title='Theme set'>Theme Set</p>
                                    <select name="theme" id="theme-show" defaultValue="dark"
                                        onChange={(e) => {
                                            if (e.target.value === 'dark') {
                                                setSettingStore(prevState => ({
                                                    ...prevState,
                                                    setValue: {
                                                        ...prevState.setValue,
                                                        theme: 'dark'
                                                    }
                                                }));
                                            }
                                            else if (e.target.value === 'light') {
                                                setSettingStore(prevState => ({
                                                    ...prevState,
                                                    setValue: {
                                                        ...prevState.setValue,
                                                        theme: 'light'
                                                    }
                                                }));
                                            }
                                        }}
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                </div>
                            </div>
                        </section>
                        <section>
                            <div className="head-group">
                                <p className="head">User Interface</p>
                                <span className="head-break"></span>
                            </div>
                            <div className="content">
                                <div className="sub-con valueInsert">
                                    <p title='Daily Goals'>Daily Goals</p>
                                    <input name="time-show" id="time-show" type="time" defaultValue='00:10' 
                                        onChange={(e) => {
                                            setSettingStore(prevState => ({
                                                ...prevState,
                                                setValue: {
                                                    ...prevState.setValue,
                                                    time: e.target.value
                                                }
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="profile main-content">
                        <section>
                            <div className="head-group">
                                <p className="head">Information</p>
                                <span className="head-break"></span>
                            </div>
                            <div className="content">
                                <div className="sub-con avata_setting">
                                    <img src={blankProfile} alt='blank profile'/>
                                    <div className='sub-upper'>
                                        <p>Name</p>
                                        <div>
                                            <input name="user-name" id="user-name" type="text" placeholder='User Name' autoComplete='off' style={{minWidth: '100%', fontSize: 'calc(clamp(48px, 4vw, 66px) / 2.5)'}}/>
                                            <i className="ph ph-pencil-simple field-icon"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="sub-con" style={{justifyContent: 'center'}}>
                                    <div className='sub-upper'>
                                        <p title='Email'>Email</p>
                                        <input type="text" placeholder='name@email.com' style={{minWidth: '100%'}} inert/>
                                    </div>
                                    <div className='sub-upper valueInsert'>
                                        <p title='Password'>Password</p>
                                        <div className="form-group">
                                            <div className="col-md-6">
                                                <input id="password-field" type="password" className="form-control" name="password" style={{minWidth: '100%'}} inert/>
                                                <button toggle="#password-field" id='toggle-password' className="ph ph-eye field-icon"></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div className="bottom-deck">
                    <input id="advance_setting" type="button" defaultValue="Advance"/>
                    <div className="inner">
                        <input id="submit_setting" type="button" defaultValue="Ok" className='closeSetting' onClick={() => {comfirmSetting(true)}}/>
                        <input id="cancle_setting" type="button" defaultValue="Cancle" className='closeSetting' onClick={()  => {comfirmSetting(false)}}/>
                    </div>
                </div>
            </div>
        </div>
        <div id="overlay-setting-container"></div>
        </>
    );
}
