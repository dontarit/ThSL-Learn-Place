import { useRef, useEffect, useState } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'

import lpMain from '../css/learnPlace.module.css'
import lpSearch from '../css/sub/searchbox.module.css'
import lpSetting from '../css/sub/setting_page.module.css'
import lpWave from '../css/sub/waveBtn.module.css'
import getBase from '../js/getBase.js'
import openAlert from '../js/alert-box.js'
import { isTokenExpired } from '../js/tokenManipulate.js';

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
    const location = useLocation();
    getBase()
    
    const didRun = useRef(false);
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [searchRes, setSearchRes] = useState([]);
    // Svae setting config
    const [validSetting, setValidSetting] = useState(true)
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

    async function handleLogout() {
        localStorage.removeItem('authToken')
        localStorage.setItem('name', 'Unknow')
        localStorage.setItem('email', '')
        localStorage.setItem('profile', '')
        setAuthToken(false);
        await axios.post('/logoutServer').then(res => {
            if (authToken && isTokenExpired()) {
                navigate('/home')
                return
            }
            openAlert(res.data.theme, res.data.title, res.data.content)
        }).catch(err => {
            console.log('error')
            openAlert('danger', 'Error', "Unable to logout")
        })
    }
    
    async function typingSearch(value) {
        showSearchResult(true)
        if (value != '') {
            await axios.post('/searchWord', {search_data: value}).then(res => {
                console.log(res.data);
                if (res.data[0] != undefined) {
                    setSearchRes(res.data)
                }
            }).catch(err => {
                console.log('error')
                showSearchResult(false)
            })
        }else {
            firstOpenSearch()
        }
    }
    async function firstOpenSearch() {
        const min = 1;
        const max = 1000;
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(rand);

        showSearchResult(true)
        await axios.post('/searchWordFirst', {random_data: rand}).then(res => {
            setSearchRes(res.data)
        }).catch(err => {
            console.log('error')
            showSearchResult(false)
        })
    }
    function handleSearch(e) {
        e.preventDefault()
        let value = document.getElementById('search-box').value
        showSearchResult(false)
        navigate(`/learn/search/${value}`)
    }
    
    function showSearchResult(toShow) {
        const element = document.querySelector(`.${lpMain.search_result}`)
        element.style.transition = 'all 250ms'
        if (!element) return
        if (toShow) {
            element.style.transform = 'translate(-50%, 0%)'
            element.inert = false
        }else {
            element.style.transform = 'translate(-50%, -150%)'
            element.inert = true
        }
    }
    
    function changeStrTable(row, col) {
        const tableStr = document.querySelector(`.${lpMain.showTableStr}`)
        tableStr.innerHTML = ''
        for (let i = 1; i <= row; i++) {
            let theRow = document.createElement('div')
            theRow.classList.add(`row-${i}`)
            theRow.classList.add(lpMain.tableRow)

            for (let j = 1; j <= col; j++) {
                let theColumn = document.createElement('div')
                let progress = document.createElement('span')
                let i = document.createElement('i')

                theColumn.classList.add(`col-${j}`)
                theColumn.classList.add("tableColumn")
                theColumn.classList.add(lpMain.tableColumn)
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
        } else {
            Object.entries(settingStore.value).forEach(thevalue => {
                settingStore.setValue[thevalue[0]] = thevalue[1]
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
        const setting = document.getElementById('open_setting_to_animate')
        const settime = 250
        console.log(setting);

        if (elememt.classList.contains('Spin_n')) {
            elememt.classList.add('Spin_y')
            elememt.classList.remove('Spin_n')
            setting.style.transition = `all ${settime}`
            setting.style.rotate = '0deg'
        }
        else if (elememt.classList.contains('Spin_y')) {
            elememt.classList.add('Spin_n')
            elememt.classList.remove('Spin_y')
            setting.style.transition = `all ${settime}`
            setting.style.rotate = '360deg'
        }
    }

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        if (!authToken && isTokenExpired()) {
            navigate('/home')
            return
        }

        // Button animation on click
        const append_btnAnimate = document.querySelectorAll('.btnAnimate')
        append_btnAnimate.forEach(element => {
            element.addEventListener('click', () => {
                element.transition = 'transform 100ms'
                element.style.transform = 'translateY(-5%) scale(1.02)'
                element.ontransitionend = () => {
                    element.style.transform = 'translateY(0%) scale(1)'
                }
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
            menuBtn.classList.remove(lpMain.hdrmnbtn_close)
            menuBtn.classList.add(lpMain.hdrmnbtn_open)
            menuBtn_in.style.transform = 'rotate(90deg)'
            menuBtn_out.forEach(element => {
                element.style.opacity = 0
            });
            let itemCount = 0
            sideItem.forEach(element => {
                setTimeout(() => {
                    element.style.transform = 'translateX(0%)'
                }, itemCount += 50);
            })
        }
        function closeMenu() {
            sideMenu.inert = true
            sideMenu.style.transform = "translateX(-100%)";
            sideMenu.setAttribute("aria-hidden", "true");
            menuBtn.classList.remove(lpMain.hdrmnbtn_open)
            menuBtn.classList.add(lpMain.hdrmnbtn_close)
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
        const searchCon = document.getElementById('search-container')
        const searchInput = document.getElementById('search-box')
        const mainLogo = document.querySelector(`.${lpMain.main_logo}`)
        const headBtn = document.querySelectorAll('.me_hed_btn')

        function openSearch() {
            showSearchResult(true)
            firstOpenSearch()
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
            showSearchResult(false)
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
        const settingBody = document.querySelector(`.${lpSetting.setting_container}`)
        const openSetting = document.querySelectorAll(`.${lpMain.open_setting}`)
        const overlaySetting = document.getElementById('overlay-setting-container')
        const quesStBtn = document.querySelector(`.${lpSetting.setting_container} .${lpSetting.con_out} .${lpSetting.topSettingBtn_Question}`)
        const closeStBtn = document.querySelector(`.${lpSetting.setting_container} .${lpSetting.con_out} .${lpSetting.topSettingBtn_Close}`)
        const slideContent = document.querySelector(`.${lpSetting.conFor_mainCon}`)
        const contentOption = document.querySelectorAll(`.${lpSetting.main_content}`)
        const topSelect = document.querySelectorAll(`.${lpSetting.topSelect} p`)

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
                settingBody.classList.remove(lpSetting.setting_container_close)
                settingBody.classList.add(lpSetting.setting_container_open)
                settingBody.inert = false
            })
        });
        function closeSettingFunc() {
            overlaySetting.style.transition = `opacity ${overlaySettingTime}ms`
            overlaySetting.style.opacity = '0'
            setTimeout(() => {
                overlaySetting.style.display = 'none'
            }, overlaySettingTime);
            settingBody.classList.remove(lpSetting.setting_container_open)
            settingBody.classList.add(lpSetting.setting_container_close)
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

        // Window event
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && sideMenu.getAttribute('aria-hidden') == 'false') {
                closeMenu()   
            }
            if (e.key === "Escape" && settingBody.getAttribute('aria-hidden') == 'false') {
                closeSettingFunc()
            }
        });
        window.addEventListener("click", (e) => {
            if (
                sideMenu.getAttribute('aria-hidden') == 'false' &&
                !sideMenu.contains(e.target) &&
                e.target !== menuBtn
            ) {
                closeMenu();
            }
            if (!searchCon.contains(e.target) && e.target.id !== 'activateSearch') {
                closeSearch();
            }
        });
        window.addEventListener('scroll', () => {
            if (sideMenu.ariaHidden == 'false') {
                closeMenu()
            }
        })
        window.addEventListener('load', () => {
            document.querySelector(`.${lpMain.body}`).style.transition = 'background-color 500ms ease-in-out';
            document.querySelector(`.${lpMain.headerSection}`).style.transition = '500ms ease-in-out';
            document.getElementById('sideMenu').style.transition = 'transform 300ms';
            const transitions = [
                { selector: '.tableColumn span', style: 'scale 1s' },
                { selector: '.tableColumn i', style: 'opacity 1s' },
                { selector: '.open-menu .menu-btn-out', style: '500ms' },
                { selector: '.open-menu .menu-btn-in', style: '500ms' }
            ];

            transitions.forEach(({ selector, style }) => {
                document.querySelectorAll(selector).forEach(element => {
                    element.style.transition = style;
                });
            });
        });
        setTimeout(() => {
            document.querySelector(`.${lpMain.body}`).style.transition = 'background-color 500ms ease-in-out';
            document.querySelector(`.${lpMain.headerSection}`).style.transition = '500ms ease-in-out';
            document.getElementById('sideMenu').style.transition = 'transform 300ms';
        }, 1500);
        comfirmSetting(true)
    }, [authToken, location]);



    return (
        <div className={lpMain.body}>
        <header className={lpMain.headerSection}>
            <div className={lpMain.con_header}>
                <div className={`${lpMain.open_menu} me_hed_btn`} id="menuBtn">
                    <span className={lpMain.menu_btn_out}></span>
                    <div className={lpMain.menu_btn_gruop}>
                        <span className={lpMain.menu_btn_in}></span>
                        <span className={lpMain.menu_btn_in}></span>
                    </div>
                    <span className={lpMain.menu_btn_out}></span>
                </div>
                <div className={lpMain.main_logo}>
                    <img src={TSLlogo} alt='logo'/>
                </div>
                <div id='search-container' className={`${lpMain.search_container_mainModule} ${lpSearch.search_container_subModule}`} inert>
                    <div>
                        <form className={lpSearch.input_place} onSubmit={handleSearch}>
                            <button className={lpSearch.sideSearchSend} type='submit'>
                                <i className="ph ph-magnifying-glass"></i>
                            </button>
                            <input type="text" name="word" id="search-box" className={lpSearch.search_box} autoComplete="off" 
                                onChange={e => {typingSearch(e.target.value)}}
                            />
                        </form>
                        <div className={lpSearch.free_option}>
                            <div className={lpSearch.clipboard}>
                                <i className="ph ph-clipboard"></i>
                            </div>
                            <div className={lpSearch.history}>
                                <i className="ph ph-clock-counter-clockwise"></i>
                            </div>
                            <div className={lpSearch.question}>
                                <i className="ph ph-question"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='open_setting_to_animate' className={`${lpMain.open_setting} ${lpMain.open_setting_to_animate} Spin_n me_hed_btn`}
                    onClick={e => { SpinCheck(e.currentTarget) }}
                >
                    <i className="ph-fill ph-gear-six"></i>
                </div>
            </div>
        </header>
        <div className={lpMain.search_result}>
            <div className={lpMain.history_list}>
                {searchRes.slice(0, 10).map(data => {
                    const parsed = JSON.parse(data.thsl_desc);
                    const definitions = parsed[0].text.split('\n')[0]
                    const compoundWordsMatch = parsed[0].text.match(/ลูกคำของ.*คือ\s+(.+)$/);
                    const compoundWords = compoundWordsMatch ? compoundWordsMatch[1].trim().split(/\s+/) : [];

                    const result = {
                        head: parsed[0].head,
                        meanings: definitions == '' ? "ไม่พบคำอธิบาย" : definitions,
                        compound_words: compoundWords
                    };
                    return (
                        <div className={lpMain.word_container} key={data.id} onClick={(e) => {
                            navigate(`/learn/search/${e.target.querySelector('div p').innerHTML}`);
                        }}>
                            <div>
                                <p>{data.thsl_word}</p>
                            </div>
                            <div>
                                <p id="meaning">{result.meanings}</p>
                                <p id="group">{data.group}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
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
                    <div className={`${lpMain.searchBtn} ${lpMain.iconBtn} ${lpMain.activateSearch} forceCloseMenu`} id="activateSearch">
                        <img src={searchBtn}/>
                        <p>Search</p>
                    </div>
                    <div className={`${lpMain.favBtn} ${lpMain.iconBtn} btnAnimate`}>
                        <img src={favBtn}/>
                        <p>Favorite</p>
                    </div>
                </div>
                <div className={`${lpMain.second_nav} ${lpMain.typeNav}`}>
                    <div className={`${lpMain.positionBtn} ${lpMain.iconBtn} btnAnimate`}>
                        <img src={handPosBtn}/>
                        <p>Hand Position</p>
                    </div>
                    <div className={`${lpMain.shapeBtn} ${lpMain.iconBtn} btnAnimate`}>
                        <img src={handShapeBtn}/>
                        <p>Hand Shape</p>
                    </div>
                    <div className={`${lpMain.turningBtn} ${lpMain.iconBtn} btnAnimate`}>
                        <img src={palmTurnBtn}/>
                        <p>Palm Turning</p>
                    </div>
                </div>
                <div className={`${lpMain.third_nav} ${lpMain.typeNav}`}>
                    <div className={`${lpMain.settingBtn} ${lpMain.iconBtn} ${lpMain.open_setting} forceCloseMenu`}>
                        <img src={settingBtn}/>
                        <p>Setting</p>
                    </div>
                    <div className={`${lpMain.daynightBtn} ${lpMain.iconBtn} btnAnimate`} id='logoutBtnFnc' onClick={handleLogout}>
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
                    <button id="reviewBtn" className={`${lpMain.reviewBtn} btnAnimate`}>
                        <span>START REVIEW</span>
                        <span>(10)</span>
                    </button>
                </div>
            </section>
            <section className={lpMain.Cam_Search}>
                <button className={`${lpMain.camsearchInside} ${lpMain.searchBoxBtn} ${lpMain.activateSearch} btnAnimate`} id="activateSearch">
                    <p>Search for a word</p>
                    <i className="ph ph-magnifying-glass"></i>
                </button>
                <button className={`${lpMain.camsearchInside} ${lpMain.cameraBoxBtn} btnAnimate`}
                    onClick={() => {navigate('/camera')}}
                >
                    <p>Translate with camera</p>
                    <i className="ph-fill ph-camera"></i>
                </button>
            </section>
            <section className={lpMain.To_Signin}>
                <div className={lpMain.Backup_info}>
                    <p>Backup Info</p>
                    <div>
                        <span>You are not signed in yet.</span>
                        <span>Your information will not be saved.</span>
                    </div>
                </div>
                <button className={`${lpWave.sign_button} ${lpWave.btnAnimate}`} role="button">
                    <span>Sign In</span>
                    <div className={lpWave.liquid}></div>
                </button>
            </section>
        </div>
        <div className={lpSetting.setting_container}>
            <div className={lpSetting.con_out}>
                <p>Setting</p>
                <div>
                    <i className={`ph ph-question-mark ${lpSetting.topSettingBtn} ${lpSetting.topSettingBtn_Question}`}></i>
                    <i className={`ph ph-x closeSetting ${lpSetting.topSettingBtn} ${lpSetting.topSettingBtn_Close}`}></i>
                </div>
            </div>
            <div className={lpSetting.con_in}>
                <div className={lpSetting.topSelect}>
                    <p id="stcon-topic-0" className={lpSetting.set_at_main}>Main</p>
                    <p id="stcon-topic-1" className={lpSetting.set_at_sub}>Profile</p>
                </div>
                <div className={lpSetting.conFor_mainCon}>
                    <div className={`${lpSetting.main_content}`}>
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
                                                }, 750);
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
                    <div className={`${lpSetting.main_content}`}>
                        <section>
                            <div className={lpSetting.head_group}>
                                <p className={lpSetting.head}>Information</p>
                                <span className={lpSetting.head_break}></span>
                            </div>
                            <div className={lpSetting.content}>
                                <div className={`${lpSetting.sub_con} ${lpSetting.avata_setting}`}>
                                    <img src={blankProfile} alt='blank profile'/>
                                    <div className={lpSetting.sub_upper}>
                                        <p>Name</p>
                                        <div>
                                            <input name="user-name" id="user-name" type="text" placeholder='User Name' defaultValue={localStorage.getItem('name')} autoComplete='off' style={{minWidth: '100%', fontSize: 'calc(clamp(48px, 4vw, 66px) / 2.5)'}}/>
                                            <i className={`ph ph-pencil-simple ${lpSetting.field_icon}`}></i>
                                        </div>
                                    </div>
                                </div>
                                <div className={lpSetting.field_icon} style={{justifyContent: 'center'}}>
                                    <div className={lpSetting.sub_upper}>
                                        <p title='Email'>Email</p>
                                        <input type="text" placeholder='name@email.com' defaultValue={localStorage.getItem('email')} style={{minWidth: '100%'}} inert/>
                                    </div>
                                    <div className={`${lpSetting.sub_upper} ${lpSetting.valueInsert}`}>
                                        <p title='Password'>Password</p>
                                        <div className={lpSetting.form_group}>
                                            <div className={lpSetting.col_md_6}>
                                                <input id="password-field" type="password" className={lpSetting.form_control} defaultValue="........" name="password" style={{minWidth: '100%'}} inert/>
                                                {/* <button toggle="#password-field" id='toggle-password' className="ph ph-eye field-icon"></button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${lpSetting.sub_con} ${lpSetting.pswdChange}`}>
                                    <input id="changepswd_setting" type="button" defaultValue="Change password"/>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div className={lpSetting.bottom_deck}>
                    <input id="advance_setting" type="button" defaultValue="Advance"/>
                    <div className={lpSetting.inner}>
                        <input id="submit_setting" type="button" defaultValue="Ok" className="closeSetting" onClick={() => {comfirmSetting(true)}}/>
                        <input id="cancle_setting" type="button" defaultValue="Cancle" className="closeSetting" onClick={()  => {comfirmSetting(false)}}/>
                    </div>
                </div>
            </div>
        </div>
        <div id="overlay-setting-container" className={lpSetting.overlay_setting_container}></div>
        </div>
    );
}