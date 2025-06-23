import { useEffect } from 'react';

import './font/font.css';
import './css/learnPlace.css';
import './css/sub/searchbox.css';
import './css/sub/setting_page.css';
import './css/sub/waveBtn.css';

import TSLlogo from './img/TSLlogo.png';
import blankProfile from './img/blank-profile.png';
import newStar from './img/new star.png';
import littleStar from './img/little star.png';
import fullStar from './img/full star.png';
import searchBtn from './img/searchBtn.png';
import favBtn from './img/favBtn.png';
import handPosBtn from './img/handPosBtn.png';
import handShapeBtn from './img/handShapeBtn.png';
import palmTurnBtn from './img/palmTurnBtn.png';
import daynightBtn from './img/daynightBtn.png';
import settingBtn from './img/settingBtn.png';
import mascot from './img/mascot.png';

function LearnPlace() {
    useEffect(() => { 
        import('./js/app-learnPlace.js') 
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
                <div className="search-container">
                    <div>
                        <div className="input-place">
                            <input type="text" name="word" id="search-box" placeholder="Search for..." autoComplete="off"/>
                        </div>
                        <div className="free-option">
                            <div className="clipboard btnAnimate">
                                <i className="ph ph-clipboard"></i>
                            </div>
                            <div className="history btnAnimate">
                                <i className="ph ph-clock-counter-clockwise"></i>
                            </div>
                            <div className="question btnAnimate">
                                <i className="ph ph-question"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="open-setting me-hed-btn setingOpen">
                    <i className="ph-fill ph-gear-six" id="settingBtn"></i>
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
                                <p id="navHead-txt">aaaaaaaaaaaaaaa</p>
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
                    <div className="settingBtn iconBtn btnAnimate">
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
                <div className="showTableStr row-4 col-7"></div>
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
                    <button id="reviewBtn" className="btn-animate btnAnimate">
                        <span>START REVIEW</span>
                        <span>(10)</span>
                    </button>
                </div>
            </section>
            <section className="Cam-Search">
                <button className="searchBoxBtn btn-animate search-animate btnAnimate" id="activateSearch">
                    <p>Search for a word</p>
                    <i className="ph ph-magnifying-glass"></i>
                </button>
                <button className="cameraBoxBtn btn-animate btnAnimate">
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
                    <i className="ph ph-x"></i>
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
                                <div className="sub-con">
                                    <p>Weeks of study history</p>
                                    <input name="history-show" id="history-show" type="text" defaultValue="4 week"/>
                                </div>
                                <div className="sub-con">
                                    <p>Show study streak</p>
                                    <input name="streak-show" id="streak-show" type="checkbox"/> 
                                </div>
                                <div className="sub-con">
                                    <p>Theme</p>
                                    <select name="theme" id="theme" defaultValue="dark">
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
                                <div className="sub-con">
                                    <p>Dialy study target</p>
                                    <input type="text" defaultValue="5 minute"/>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="profile main-content">
                        <section>
                            <div className="head-group">
                                <p className="head">Lession</p>
                                <span className="head-break"></span>
                            </div>
                            <div className="content">
                                <div className="sub-con">
                                    <p>Weeks of study history</p>
                                    <input name="history-show" id="history-show" type="text" defaultValue="4 week"/>
                                </div>
                                <div className="sub-con">
                                    <p>Show study streak</p>
                                    <input name="streak-show" id="streak-show" type="checkbox"/>
                                </div>
                                <div className="sub-con">
                                    <p>Theme</p>
                                    <select name="theme" id="theme" defaultValue="dark">
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
                                <div className="sub-con">
                                    <p>Dialy study target</p>
                                    <input type="text" defaultValue="5 minute"/>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div className="bottom-deck">
                    <input id="advance_setting" type="button" defaultValue="Advance"/>
                    <div className="inner">
                        <input id="submit_setting" type="button" defaultValue="Ok"/>
                        <input id="cancle_setting" type="button" defaultValue="Cancle"/>
                    </div>
                </div>
            </div>
        </div>
        <div id="overlay-setting-container"></div>
        </>
    );
}

export default LearnPlace;
