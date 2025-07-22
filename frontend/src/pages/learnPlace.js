import { useEffect, useState } from 'react';
import { matchPath, useNavigate } from 'react-router-dom';
import axios from 'axios'

import lpMain from '../css/learnPlace.module.css'
import lpSearch from '../css/sub/searchbox.module.css'
import lpSetting from '../css/sub/setting_page.module.css'
import getBase from '../js/getBase.js'
import openAlert from '../js/alert-box.js'

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
import logoutBtn from '../assets/img/logoutBtn.png';
import settingBtn from '../assets/img/settingBtn.png';
import mascot from '../assets/img/mascot.png';

export default function LearnPlace() {
    const navigate = useNavigate();
    getBase()
    
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

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
            // const linkButtonNavigate = document.createElement('a');
            // linkButtonNavigate.href = '/home'
            // linkButtonNavigate.click()
            navigate('/home')
            return
        }

        // Button animation on click
        console.log(document.querySelector(`.${lpMain.btnAnimate}`));
        const append_btnAnimate = document.querySelectorAll(`.${lpMain.btnAnimate}`)
        append_btnAnimate.forEach(element => {
            element.addEventListener('click', () => {
                element.transition = 'transform 100ms'
                element.style.transform = 'translateY(-5%) scale(1.02)'
                setTimeout(() => {
                    element.style.transform = 'translateY(0%) scale(1)'
                }, 100);
            })
        });

        // Menu toggle button
        const sideMenu = document.getElementById("sideMenu");
        const menuBtn = document.getElementById("menuBtn");
        const menuBtn_out = document.querySelectorAll(`.${lpMain.open_menu} .${lpMain.menu_btn_out}`);
        const menuBtn_in = document.querySelector(`.${lpMain.open_menu} .${lpMain.menu_btn_in}`)
        const sideItem = document.querySelectorAll(`.${lpMain.nav_bar} .${lpMain.typeNav} div`)

        function openMenu() {
            sideMenu.inert = false
            sideMenu.style.transform = "translateX(0%)";
            sideMenu.setAttribute("aria-hidden", "false");
            menuBtn.classList.remove('hdrmnbtn_close')
            menuBtn.classList.add('hdrmnbtn_open')
            menuBtn_in.style.transform = 'rotate(90deg)'
            menuBtn_out.forEach(element => {
                element.style.opacity = 0
            });
            let itemCount = 0
            sideItem.forEach(element => {
                setTimeout(() => {
                    element.style.transform = 'translateX(0%)'
                }, itemCount);
                itemCount += 50
            })
        }
        function closeMenu() {
            sideMenu.inert = true
            sideMenu.style.transform = "translateX(-100%)";
            sideMenu.setAttribute("aria-hidden", "true");
            menuBtn.classList.remove('hdrmnbtn_open')
            menuBtn.classList.add('hdrmnbtn_close')
            menuBtn_in.style.transform = 'rotate(0deg)'
            menuBtn_out.forEach(element => {
                element.style.opacity = 1
            });
            sideItem.forEach(element => {
                element.style.transform = 'translateX(-50%)'
            })
        }

        menuBtn.addEventListener("click", () => {
            if (sideMenu.getAttribute('aria-hidden') == 'true') {
                openMenu()
            }else {
                closeMenu()
            }
        });

        const forceCloseMenu = document.querySelector('.forceCloseMenu')
        forceCloseMenu.addEventListener('click', () => {
            closeMenu()
        })

        // Search button animation
        const searchBtn = document.querySelectorAll('#activateSearch')
        const searchCon = document.querySelector(`.${lpMain.search_container}`)
        const searchInput = document.getElementById('search-box')
        const mainLogo = document.querySelector(`.${lpMain.main_logo}`)
        const headBtn = document.querySelectorAll(`.${lpMain.me_hed_btn}`)

        function openSearch() {
            if (window.innerWidth < 768) {
                headBtn.forEach(elememt => {
                    elememt.inert = true
                    elememt.style.transition = 'opacity 300ms'
                    elememt.style.opacity = '0'
                });
                mainLogo.style.transition = 'opacity 300ms'
                mainLogo.style.opacity = '0'
            }
            searchCon.inert = false
            searchCon.style.transition = 'ease top 300ms'
            searchCon.style.top = '50%'
            searchInput.focus()
        }
        function closeSearch() {
            headBtn.forEach(element => {
                element.inert = false
                element.style.transition = 'opacity 300ms'
                element.style.opacity = '1'
            });
            mainLogo.style.transition = 'opacity 300ms'
            mainLogo.style.opacity = '1'
            searchCon.inert = true
            searchCon.style.transition = 'ease top 300ms'
            searchCon.style.top = '-50%'
            searchInput.value = ''
        }

        searchBtn.forEach(element => {
            element.addEventListener('click', () => {
                openSearch()
            })
        });

        // Change setting option
        const settingBody = document.querySelector(`.${lpMain.setting_container}`)
        const openSetting = document.querySelectorAll(`.${lpMain.open_setting}`)
        const overlaySetting = document.getElementById('overlay-setting-container')
        const closeStBtn = document.querySelector(`.${lpMain.setting_container} .${lpMain.con_out} .ph-x`)
        const quesStBtn = document.querySelector(`.${lpMain.setting_container} .${lpMain.con_out} .ph-question-mark`)

        const slideContent = document.querySelector(`.${lpMain.conFor_mainCon}`)
        const contentOption = document.querySelectorAll(`.${lpMain.main_content}`)
        const topSelect = document.querySelectorAll(`.${lpMain.topSelect} p`)

        let option_numberID = ""
        let option_Value = '0'

        topSelect.forEach(element => {
            element.addEventListener('click', () => {
                option_numberID = element.id
                let option_Value = parseInt(option_numberID.match(/\d+/)[0])
                slideContent.style.transform = `translateX(${option_Value * -100}%)`
                topSelect.forEach(inner => {
                    inner.classList.add('set-at-sub')
                    inner.classList.remove('set-at-main')
                })

                topSelect[option_Value].classList.add('set-at-main')
                topSelect[option_Value].classList.remove('set-at-sub')
                if (option_Value == 0) {
                    contentOption[option_Value].style.opacity = '1'
                    contentOption[option_Value + 1].style.opacity = '0'
                }
                else if (option_Value + 1 == topSelect.length) {
                    contentOption[option_Value].style.opacity = '1'
                    contentOption[option_Value - 1].style.opacity = '0'
                }
                else {
                    contentOption[option_Value].style.opacity = '1'
                    contentOption[option_Value + 1].style.opacity = '0'
                    contentOption[option_Value - 1].style.opacity = '0'
                }
            })
        });

        // Open and Close setting
        const overlaySettingTime = 250
        openSetting.forEach(element => {
            element.addEventListener('click', () => {
                topSelect[0].click()
                overlaySetting.style.transition = `opacity ${overlaySettingTime}ms`
                overlaySetting.style.display = 'block'
                setTimeout(() => {
                    overlaySetting.style.opacity = '1'
                }, overlaySettingTime);
                settingBody.classList.remove('setting-container-close')
                settingBody.classList.add('setting-container-open')
                settingBody.inert = false
            })
        });

        function closeSettingFunc() {
            overlaySetting.style.transition = `opacity ${overlaySettingTime}ms`
            overlaySetting.style.opacity = '0'
            setTimeout(() => {
                overlaySetting.style.display = 'none'
            }, overlaySettingTime);
            settingBody.classList.remove('setting-container-open')
            settingBody.classList.add('setting-container-close')
            settingBody.inert = true
        }

        const advanceSetting = document.getElementById('advance_setting')
        const submitSetting = document.getElementById('submit_setting')
        const closeSetting = document.querySelectorAll(`.closeSetting`)

        closeSetting.forEach(element => {
            element.addEventListener('click', () => {
                closeSettingFunc()
            })
        });

        // // Window event
        // window.addEventListener("keydown", (e) => {
        //     if (e.key === "Escape" && sideMenu.getAttribute('aria-hidden') == 'false') {
        //         closeMenu()   
        //     }
        //     if (e.key === "Escape" && settingBody.getAttribute('aria-hidden') == 'false') {
        //         closeSettingFunc()
        //     }
        // });
        // window.addEventListener("click", (e) => {
        //     if (
        //         sideMenu.getAttribute('aria-hidden') == 'false' &&
        //         !sideMenu.contains(e.target) &&
        //         e.target !== menuBtn
        //     ) {
        //         closeMenu();
        //     }
        //     if (!searchCon.contains(e.target) && e.target.id !== 'activateSearch') {
        //         closeSearch();
        //     }
        // });
        // window.addEventListener('scroll', () => {
        //     if (sideMenu.ariaHidden == 'false') {
        //         closeMenu()
        //     }
        // })
        // window.addEventListener('load', () => {
        //     document.body.style.transition = 'background-color 500ms ease-in-out';
        //     document.querySelector('.headerSection').style.transition = '500ms ease-in-out';
        //     document.getElementById('sideMenu').style.transition = 'transform 300ms';
            
        //     const transitions = [
        //         { selector: '.tableColumn span', style: 'scale 1s' },
        //         { selector: '.tableColumn i', style: 'opacity 1s' },
        //         { selector: '.open-menu .menu-btn-out', style: '500ms' },
        //         { selector: '.open-menu .menu-btn-in', style: '500ms' }
        //     ];

        //     transitions.forEach(({ selector, style }) => {
        //         document.querySelectorAll(selector).forEach(element => {
        //             element.style.transition = style;
        //         });
        //     });
        // });
        comfirmSetting(true)
    }, [authToken]);

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
                openAlert(res.data.theme, res.data.title, res.data.content)
            })
            .catch(err => {
                console.log('error')
            })
    }

    let searchingIdelay
    let searchController
    function cancelSearch() {
        if (searchController) {
            searchController.abort()
        }
    }

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
    // Activate when user press enter while focus in searchbox
    function handleSearch(e) {
        e.preventDefault()
    }
    
    // Svae setting config
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
    
    function changeStrTable(row, col) {
        const tableStr = document.querySelector(`.${lpMain.showTableStr}`)
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
        document.querySelector(`.${lpMain.tableColumn}`).style.width = 'calc(50% / (7 / 1.5))'
    }
    function disableStreak(disable) {
        let time = 500
        const main = document.querySelector(`.${lpMain.mainContent_container}`)
        const schedule = document.querySelector(`.${lpMain.schedule}`)
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
        const validThemes = ['light', 'dark', 'ocean'];
        if (validThemes.includes(theme)) {
            document.querySelector(`.${lpMain.body}`).setAttribute('data-theme', theme);
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

        // table
        changeStrTable(schedule, 7)
        historyShow.setAttribute('placeholder', `${schedule} week`)
        // streak
        disableStreak(streak)
        streakShow.checked = streak
        // theme
        checkTheme(theme)
        themeShow.value = theme
        // time
        timeShow.value = time
    }

    function SpinCheck(elememt) {
        if (elememt.classList.contains('Spin-n')) {
            elememt.classList.add('Spin-y')
            elememt.classList.remove('Spin-n')
            elememt.style.transform = 'rotate(0deg)'
            elememt.style.transition = 'transform 500ms'
        }
        else if (elememt.classList.contains('Spin-y')) {
            elememt.classList.add('Spin-n')
            elememt.classList.remove('Spin-y')
            elememt.style.transform = 'rotate(360deg)'
            elememt.style.transition = 'transform 500ms'
        }
    }
    
    const [use_hour, setUse_hour] = useState(0)
    const [use_min, setUse_min] = useState(0)
    function countRecord() {
        // setInterval(() => {
        //     setInterval
        // }, 1000);
    }
    


    return (
        <div className={lpMain.body}>
        <header className={lpMain.headerSection}>
            <div className={lpMain.con_header}>
                <div className={`${lpMain.open_menu} ${lpMain.me_hed_btn}`} id="menuBtn">
                        <span className={lpMain.menu_btn_out}></span>
                        <div className={lpMain.menu_btn_gruop}>
                            <span className={lpMain.menu_btn_in}></span>
                            <span className={lpMain.menu_btn_in}></span>
                        </div>
                        <span className={lpMain.menu_btn_out}></span>
                </div>
                <div className={lpMain.main_logo}>
                    <img src={lpMain.TSLlogo} alt='logo'/>
                </div>
                <div className={lpMain.search_container} inert>
                    <div>
                        <form className={lpMain.input_place} onSubmit={handleSearch}>
                            <button className={lpMain.sideSearchSend} type='submit'>
                                <i className="ph ph-magnifying-glass"></i>
                            </button>
                            <input type="text" name="word" id="search-box" className={lpMain.search_box} autoComplete="off" 
                                onChange={e => {typingSearch(e.target.value)}}
                            />
                        </form>
                        <div className={lpMain.free_option}>
                            <div className={lpMain.clipboard}>
                                <i className="ph ph-clipboard"></i>
                            </div>
                            <div className={lpMain.history}>
                                <i className="ph ph-clock-counter-clockwise"></i>
                            </div>
                            <div className={lpMain.question}>
                                <i className="ph ph-question"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`${lpMain.open_setting} ${lpMain.open_setting_to_animate} ${lpMain.me_hed_btn} ${lpMain.settingIconOpen} ${lpMain.Spin_n}`}
                    onClick={e => { SpinCheck(e.target) }}
                >
                    <i className="ph-fill ph-gear-six"></i>
                </div>
            </div>
        </header>
        <div className={lpMain.search_result} style={{display: 'none'}}>
            <div className={lpMain.history_list}>
                <div className={lpMain.word_container}>
                    <div>
                        <p>Hello</p>
                    </div>
                    <div>
                        <p id="meaning">The way to greeting</p>
                        <p id="group">3</p> 
                    </div>
                </div>
                <div className={lpMain.word_container}>
                    <div>
                        <p>Hello</p>
                    </div>
                    <div>
                        <p id="meaning">The way to greeting</p>
                        <p id="group">3</p> 
                    </div>
                </div>
                <div className={lpMain.word_container}>
                    <div>
                        <p>Hello</p>
                    </div>
                    <div>
                        <p id="meaning">The way to greeting</p>
                        <p id="group">3</p> 
                    </div>
                </div>
            </div>
            {/* <div className="search-list"></div> */}
        </div>
        <nav id="sideMenu" className={lpMain.sideMenu} aria-hidden="true" role="navigation" aria-label="Side menu" inert>
            <div className={lpMain.user_info}>
                <div className={lpMain.user_container}>
                    <div className={lpMain.user}>
                        <div className={lpMain.avatar}>
                            <img src={blankProfile} alt='blank profile'/>
                        </div>
                        <div className={lpMain.name_usetime}>
                            <div className={lpMain.already_signin}>
                                <p id="navHead_txt" className={lpMain.navHead_txt} title='Hello'>{localStorage.getItem('name')}</p>
                                <div id="usetime" className={`${lpMain.make_text_gap} ${lpMain.usetime}`}>
                                    <span>Time usage</span>
                                    <span className={lpMain.usage_number}>0</span>
                                    <span>h</span>
                                    <span className={lpMain.usage_number}>0</span>
                                    <span>m</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={lpMain.stars}>
                        <div className={`${lpMain.newStar} ${lpMain.learn_star}`}>
                            <img src={newStar}/>
                            <p id="newSP">0</p>
                        </div>
                        <div className={`${lpMain.littleStar} ${lpMain.learn_star}`}>
                            <img src={littleStar}/>
                            <p id="littleSP">0</p>
                        </div>
                        <div className={`${lpMain.fullStar} ${lpMain.learn_star}`}>
                            <img src={fullStar}/>
                            <p id="fullSP">0</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={lpMain.nav_bar}>
                <div className={`${lpMain.first_nav} ${lpMain.typeNav}`}>
                    <div className={`${lpMain.searchBtn} ${lpMain.iconBtn} ${lpMain.forceCloseMenu} ${lpMain.activateSearch}`} id="activateSearch">
                        <img src={searchBtn}/>
                        <p>Search</p>
                    </div>
                    <div className={`${lpMain.favBtn} ${lpMain.iconBtn} ${lpMain.btnAnimate}`}>
                        <img src={favBtn}/>
                        <p>Favorite</p>
                    </div>
                </div>
                <div className={`${lpMain.second_nav} ${lpMain.typeNav}`}>
                    <div className={`${lpMain.positionBtn} ${lpMain.iconBtn} ${lpMain.btnAnimate}`}>
                        <img src={handPosBtn}/>
                        <p>Hand Position</p>
                    </div>
                    <div className={`${lpMain.shapeBtn} ${lpMain.iconBtn} ${lpMain.btnAnimate}`}>
                        <img src={handShapeBtn}/>
                        <p>Hand Shape</p>
                    </div>
                    <div className={`${lpMain.turningBtn} ${lpMain.iconBtn} ${lpMain.btnAnimate}`}>
                        <img src={palmTurnBtn}/>
                        <p>Palm Turning</p>
                    </div>
                </div>
                <div className={`${lpMain.third_nav} ${lpMain.typeNav}`}>
                    <div className={`${lpMain.settingBtn} ${lpMain.iconBtn} ${lpMain.forceCloseMenu} ${lpMain.open_setting}`}>
                        <img src={settingBtn}/>
                        <p>Setting</p>
                    </div>
                    <div className={`${lpMain.daynightBtn} ${lpMain.iconBtn} ${lpMain.btnAnimate}`} id='logoutBtnFnc' onClick={handleLogout}>
                        <img src={logoutBtn}/>
                        <p>Logout</p>
                    </div>
                </div>
            </div>
        </nav>
        <div className={lpMain.mainContent_container}>
            <section className={lpMain.schedule}>
                <div className={lpMain.tell_streak}>
                    <div className={`${lpMain.streak_container} ${lpMain.stnow}`}>
                        <p>Current streak</p>
                        <p id="dayStr" className={lpMain.make_text_gap}>
                            <span>2</span>
                            <span>DAY</span>
                        </p>
                    </div>
                    <div className={`${lpMain.streak_container} ${lpMain.stbest}`}>
                        <p>Best streak</p>
                        <p id="bestStr" className={lpMain.make_text_gap}>
                            <span>16</span>
                            <span>DAY</span>
                        </p>
                    </div>
                </div>
                <div className={lpMain.showTableStr}></div>
                <div className={lpMain.tell_history}>
                    <p id="last-use">21/5/2025</p>
                    <p id="study-time">No History</p>
                </div>
            </section>
            <section className={lpMain.lvl_review}>
                <div className={lpMain.charecter_box}>
                    <img src={mascot}/>
                    <div className={lpMain.textBox}>
                        <div className={lpMain.box1}>
                            <div>
                                <span>You are currently studying</span>
                            </div>
                            <div className={lpMain.make_text_gap}>
                                <span className={lpMain.txthilig} id='txthilig'>134</span>
                                <span>Thai Sign word.</span>
                            </div>
                        </div>
                        <div className={lpMain.box2}>
                            <div className={lpMain.make_text_gap}>
                                <span>Now you have</span>
                                <span className={lpMain.txthilig} id='txthilig'>10</span>
                                <span>word</span>
                            </div>
                            <div>
                                <span>ready for review now</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={lpMain.level_show}>
                    <div className={lpMain.level_current}>
                        <p className={lpMain.make_text_gap}>
                            <span>Level</span>
                            <span className={lpMain.levamt} id='levamt'>3-8</span>
                        </p>
                        <p className={lpMain.make_text_gap}>
                            <span>Next Level</span>
                            <span className={lpMain.levamt} id='levamt'>144</span>
                            <span>XP</span>
                        </p>
                    </div>
                    <progress className={lpMain.UserLvl} id="UserLvl" value="32" max="100"></progress>
                </div>
                <div className={lpMain.progress_word}>
                    <div className={lpMain.progress_0}>
                        <p id="wordNumber">10</p>
                        <p>0% - 24%</p>
                    </div>
                    <div className={lpMain.progress_1}>
                        <p id="wordNumber">10</p>
                        <p>25% - 49%</p>
                    </div>
                    <div className={lpMain.progress_2}>
                        <p id="wordNumber">10</p>
                        <p>50% - 74%</p>
                    </div>
                    <div className={lpMain.progress_3}>
                        <p id="wordNumber">10</p>
                        <p>75% - 99%</p>
                    </div>
                    <div className={lpMain.progress_4}>
                        <p id="wordNumber">10</p>
                        <p><span>---</span>100%<span>---</span></p>
                    </div>
                </div>
                <div className={lpMain.revBtn_container}>
                    <button id="reviewBtn" className={`${lpMain.btnAnimate} ${lpMain.reviewBtn}`}>
                        <span>START REVIEW</span>
                        <span>(10)</span>
                    </button>
                </div>
            </section>
            <section className={lpMain.Cam_Search}>
                <button className={`${lpMain.searchBoxBtn} ${lpMain.search_animate} ${lpMain.btnAnimate} ${lpMain.activateSearch}`} id="activateSearch">
                    <p>Search for a word</p>
                    <i className="ph ph-magnifying-glass"></i>
                </button>
                <button className={`${lpMain.cameraBoxBtn} ${lpMain.btnAnimate}`}
                    onClick={() => {
                        navigate('/camera')
                    }}
                >
                    <p>Translate with camera</p>
                    <i className="ph-fill ph-camera"></i>
                </button>
            </section>
            {/* <section className="To-Signin">
                <div className="Backup-info">
                    <p>Backup Info</p>
                    <div>
                        <span>You are not signed in yet.</span>
                        <span>Your information will not be saved.</span>
                    </div>
                </div>
                <button className="sign-button btnAnimate" role="button">
                    <span>Sign In</span>
                    <div className="liquid"></div>
                </button>
            </section> */}
        </div>
        <div className={lpSetting.setting_container}>
            <div className={lpSetting.con_out}>
                <p>Setting</p>
                <div>
                    <i className="ph ph-question-mark"></i>
                    <i className="ph ph-x closeSetting"></i>
                </div>
            </div>
            <div className={lpSetting.con_in}>
                <div className={lpSetting.topSelect}>
                    <p id="stcon-topic-0" className={lpSetting.set_at_main}>Main</p>
                    <p id="stcon-topic-1" className={lpSetting.set_at_sub}>Profile</p>
                </div>
                <div className={lpSetting.conFor_mainCon}>
                    <div className={`${lpSetting.main} ${lpSetting.main_content}`}>
                        <section>
                            <div className={lpSetting.head_group}>
                                <p className={lpSetting.head}>Lession</p>
                                <span className={lpSetting.head_break}></span>
                            </div>
                            <div className={lpSetting.content}>
                                <div className={`${lpSetting.sub_con} ${lpSetting.valueInsert}`}>
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
                                <div className={`${lpSetting.sub_con} ${lpSetting.valueInsert}`}>
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
                                <div className={lpSetting.sub_con}>
                                    <p title='Theme set'>Theme Set</p>
                                    <select name="theme" id="theme-show" defaultValue="light"
                                        onChange={(e) => {
                                            const theme = e.target.value;
                                            if (['light', 'dark', 'ocean'].includes(theme)) {
                                                setSettingStore(prevState => ({
                                                    ...prevState,
                                                    setValue: {
                                                        ...prevState.setValue,
                                                        theme
                                                    }
                                                }));
                                            }
                                        }}
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="ocean">Ocean</option>
                                    </select>
                                </div>
                            </div>
                        </section>
                        <section>
                            <div className={lpSetting.head_group}>
                                <p className={lpSetting.head}>User Interface</p>
                                <span className={lpSetting.head_break}></span>
                            </div>
                            <div className={lpSetting.content}>
                                <div className={`${lpSetting.sub_con} ${lpSetting.valueInsert}`}>
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
                    <div className={`${lpSetting.profile} ${lpSetting.main_content}`}>
                        <section>
                            <div className={lpSetting.head_group}>
                                <p className={lpSetting.head}>Information</p>
                                <span className={lpSetting.head_break}></span>
                            </div>
                            <div className={lpSetting.content}>
                                <div className={`${sub_con} ${avata_setting}`}>
                                    <img src={blankProfile} alt='blank profile'/>
                                    <div className={lpSetting.sub_upper}>
                                        <p>Name</p>
                                        <div>
                                            <input name="user-name" id="user-name" type="text" placeholder='User Name' defaultValue={localStorage.getItem('name')} autoComplete='off' style={{minWidth: '100%', fontSize: 'calc(clamp(48px, 4vw, 66px) / 2.5)'}}/>
                                            <i className={`ph ph-pencil-simple ${lpSettingfield_icon}`}></i>
                                        </div>
                                    </div>
                                </div>
                                <div className={lpSetting.field_icon} style={{justifyContent: 'center'}}>
                                    <div className='sub_upper'>
                                        <p title='Email'>Email</p>
                                        <input type="text" placeholder='name@email.com' defaultValue={localStorage.getItem('email')} style={{minWidth: '100%'}} inert/>
                                    </div>
                                    <div className='sub_upper valueInsert'>
                                        <p title='Password'>Password</p>
                                        <div className="form_group">
                                            <div className="col_md_6">
                                                <input id="password-field" type="password" className="form_control" defaultValue="........" name="password" style={{minWidth: '100%'}} inert/>
                                                {/* <button toggle="#password-field" id='toggle-password' className="ph ph-eye field-icon"></button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="sub_con pswdChange">
                                    <input id="changepswd_setting" type="button" defaultValue="Change password"/>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div className="bottom_deck">
                    <input id="advance_setting" type="button" defaultValue="Advance"/>
                    <div className="inner">
                        <input id="submit_setting" type="button" defaultValue="Ok" className='closeSetting' onClick={() => {comfirmSetting(true)}}/>
                        <input id="cancle_setting" type="button" defaultValue="Cancle" className='closeSetting' onClick={()  => {comfirmSetting(false)}}/>
                    </div>
                </div>
            </div>
        </div>
        <div id="overlay-setting-container" className='overlay_setting_container'></div>
        </div>
    );
}
