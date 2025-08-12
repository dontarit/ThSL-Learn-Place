import { useRef, useEffect, useState } from 'react';
import { data, matchPath, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'

import lpMain from '../css/learnPlace.module.css'
import lpSearch from '../css/sub/searchbox.module.css'
import lpSetting from '../css/sub/setting_page.module.css'
import lpNavC from '../css/sub/navigate_circle.module.css'
import lpInfor from '../css/learnPlace_informate.module.css'
import lpWave from '../css/sub/waveBtn.module.css'
import getBase from '../js/getBase.js'
import openAlert from '../js/alert-box.js'
import { isTokenExpired } from '../js/tokenManipulate.js';
import { handleLogoutAcc } from '../js/page_utility/normal.js';
import comfirmSetting from '../js/page_utility/confirmSetting.js'

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
    const [loading, setLoading] = useState(true);
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [searchRes, setSearchRes] = useState([]);
    const [pageCurrent, setPageCurrent] = useState(0);
    const [searchSpecific, setSearchSpecific] = useState({});

    const [data_word_score, setData_word_score] = useState([]);
    const [data_word_fav, setData_word_fav] = useState([]);
    const [data_schedule, setData_schedule] = useState([]);

    const [settingStore, setSettingStore] = useState({
        setValue: {
            schedule: 4,
            streak: false,
            theme: 'light',
            time: '00:10',
            lang: 'english'
        },
        value: {
            schedule: 4,
            streak: false,
            theme: 'light',
            time: '00:10',
            lang: 'english'
        }
    })
    
    async function handleLogout() {
        const result = await handleLogoutAcc(authToken, setAuthToken);
        
        navigate(result.navigate, { replace: true })
        const [theme, title, content] = result.alert_value;
        openAlert(theme, title, content);
    }
    
    async function typingSearch(value) {
        showSearchResult(true)
        if (value != '') {
            await axios.post('/searchWord', {search_data: value}).then(res => {
                if (res.data[0] != undefined) {
                    setSearchRes(res.data)
                }
            }).catch(err => {
                console.log('error: ', err)
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

        showSearchResult(true)
        await axios.post('/searchWordFirst', {random_data: rand}).then(res => {
            setSearchRes(res.data)
        }).catch(err => {
            console.log('error: ', err)
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
    
    async function handleNameChange(name) {
        await axios.post('/changeName', {name: name, token: authToken}).then(res => {
            openAlert(res.data.theme, res.data.title, res.data.content)
            localStorage.setItem('name', name)
        }).catch(err => {
            console.log('error: ', err)
            openAlert('danger', 'Error', "Enable change name")
        })
    }

    async function callConfirmSetting(apply, firstload = false) {
        comfirmSetting(apply, firstload, settingStore, setSettingStore, authToken)
    }

    function SpinCheck(elememt) {
        const setting = document.getElementById('open_setting_to_animate')
        const settime = 500

        if (elememt.classList.contains('Spin_n')) {
            elememt.classList.add('Spin_y')
            elememt.classList.remove('Spin_n')
            setting.style.transition = `all ${settime}ms`
            setting.style.transform = 'rotate(360deg)'
        }
        else if (elememt.classList.contains('Spin_y')) {
            elememt.classList.add('Spin_n')
            elememt.classList.remove('Spin_y')
            setting.style.transition = `all ${settime}ms`
            setting.style.transform = 'rotate(0deg)'
        }
    }

    function openMiniNav(element) {
        const sign = element.querySelector(`.${lpNavC.show_over}`)
        const butt = element.querySelectorAll(`.${lpNavC.data_drop} .${lpNavC.dataContainer}`)
        const state = element.getAttribute('current-state')
        let count = 0

        if (state == 'close') {
            element.setAttribute('current-state', 'open')
            sign.style.transform = 'rotate(135deg)'
            butt.forEach(sub => {
                sub.inert = false
                sub.style.opacity = '1'
                sub.style.transform = `translate(0%, -${110 + (count * 110)}%)`
                count += 1
            });
        }
        if (state == 'open') {
            element.setAttribute('current-state', 'close')
            sign.style.transform = 'rotate(0deg)'
            butt.forEach(sub => {
                sub.inert = true
                sub.style.opacity = '0'
                sub.style.transform = `translate(0, 0)`
            });
        }
    }

    async function search_word_specific(word) {
        await axios.post('/searchSpecific', {word: word}).then(res => {
            let data = res.data[0]
            setSearchSpecific({
                id: data.id,
                word: data.thsl_word,
                meaning: JSON.parse(res.data[0].thsl_desc),
                src: data.thsl_src
            })
        }).catch(err => { console.log('error: ', err) })
    }
    
    async function getLearnData() {
        let learn_id, exp
        await axios.post('/getLearnData', {token: authToken}).then(res => {
            let data = res.data
            learn_id = data.learn_id
            exp = data.exp
            setData_word_score(JSON.parse(data.word_score))
            setData_word_fav(JSON.parse(data.word_fav))
            setData_schedule(JSON.parse(data.schedule))
        }).catch(err => {
            console.log('error: ', err)
            openAlert('danger', 'Error', "Something went wrong")
        })
        
        localStorage.setItem("learn_id", learn_id)
        localStorage.setItem("exp", exp)

        setLoading(false)
    }
    
    const limitSpaceChange = 5
    let searchId = parseInt(localStorage.getItem('learn_id'))
    let limit4Learn = parseInt(localStorage.getItem('learn_id')) + limitSpaceChange
    let have4Learn = limit4Learn - limitSpaceChange == 0 ? limitSpaceChange : Math.abs(((limit4Learn - limitSpaceChange) - limit4Learn) - 1)
    if (searchId == 0 || searchId == undefined || searchId == null) {searchId = 1}

    function toNextLernWord(e, toNext = 1) {
        let searchId = parseInt(localStorage.getItem('learn_id'))
        let limit4Learn = parseInt(localStorage.getItem('learn_id')) + limitSpaceChange
        
        localStorage.setItem('pageSaving', limit4Learn + 1)
        
        let parent = e.parentElement.parentElement
        let left = parent.querySelectorAll('div')[0]
        let right = parent.querySelectorAll('div')[1]
        
        if (toNext) {
            let pageNow = parseInt(document.getElementById('specific_page_id').innerText) + 1
            searchId = pageNow
            setPageCurrent(pageCurrent + 1)
            localStorage.setItem("page_current", pageNow)
            if (searchId >= limit4Learn) {
                setPageCurrent(pageCurrent + 1)
                localStorage.setItem("page_current", pageNow)
                right.querySelectorAll('i')[0].style.display = 'flex'
                right.querySelectorAll('i')[1].style.display = 'none'
            }
            search_word_specific(searchId)
            left.querySelectorAll('i')[0].style.display = 'none'
            left.querySelectorAll('i')[1].style.display = 'flex'
        }else {
            let pageNow = parseInt(document.getElementById('specific_page_id').innerText) - 1
            searchId = pageNow
            let trueLimit = (limit4Learn - limitSpaceChange) == 0 ? 1 : limit4Learn - limitSpaceChange
            if (pageNow == trueLimit) {
                search_word_specific(searchId)
                setPageCurrent(searchId)
                localStorage.setItem("page_current", pageNow)
                left.querySelectorAll('i')[0].style.display = 'flex'
                left.querySelectorAll('i')[1].style.display = 'none'
            } else {
                search_word_specific(searchId)
                setPageCurrent(searchId)
                localStorage.setItem("page_current", pageNow)
                right.querySelectorAll('i')[0].style.display = 'none'
                right.querySelectorAll('i')[1].style.display = 'flex'
            }
        }
    }

    async function storeNewLearn(data, listData) {
        await axios.post('/storeLearnData', {token: authToken, new_word: data, new_list: listData}).catch(err => {
            console.log(err);
            openAlert('danger', 'Error', "Something went wrong")
        })
    }

    function toggleScroll() {
        if (document.body.style.overflow === 'hidden') {
            document.body.style.overflow = '';
        } else {
            document.body.style.overflow = 'hidden';
        }
    }

    function handle_learnNewWordBtn() {
        const learn_container = document.querySelector(`.${lpMain.learn_appear_information}`)
        const overlayLearn = document.getElementById('overlay-new-word-learn')
        const btnNavCon = document.getElementById('btnManageContaner')
        
        search_word_specific(searchId)
        searchId += pageCurrent
        setPageCurrent(pageCurrent + 1)
        toggleScroll()
        learn_container.style.display = 'flex'
        overlayLearn.style.display = 'block'
        btnNavCon.style.display = 'flex'
        overlayLearn.setAttribute('aria-hidden', 'false')
        learn_container.ontransitionend = () => {}
        setTimeout(() => {
            learn_container.style.opacity = '1'
            overlayLearn.style.opacity = '.76'
            btnNavCon.style.opacity = '1'
        }, 10);
    }

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        if (!authToken && isTokenExpired()) {
            navigate('/home', { replace: true })
            return
        }

        // Button animation on click
        const append_btnAnimate = document.querySelectorAll('.btnAnimate')
        if (append_btnAnimate != undefined) {
            append_btnAnimate.forEach(element => {
                element.addEventListener('click', () => {
                    element.transition = 'transform 100ms'
                    element.style.transform = 'translateY(-5%) scale(1.02)'
                    element.ontransitionend = () => {
                        element.style.transform = 'translateY(0%) scale(1)'
                    }
                })
            });
        }

        // Menu toggle button
        const sideMenu = document.getElementById("sideMenu");
        const menuBtn = document.getElementById("menuBtn");
        const menuBtn_in = document.getElementById('menu_btn_in_first')
        const menuBtn_out = document.querySelectorAll(`.${lpMain.menu_btn_out}`);
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
                    elememt.style.transition = 'all 300ms'
                    elememt.style.opacity = '0'
                });
                mainLogo.style.transition = 'all 300ms'
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
                element.style.transition = 'all 300ms'
                element.style.opacity = '1'
            });
            mainLogo.style.transition = 'all 300ms'
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
                option_numberID = element.id;
                option_Value = parseInt(option_numberID.match(/\d+/)[0]);
                
                if (option_Value >= 0 && option_Value < contentOption.length) {
                    slideContent.style.transform = `translateX(${option_Value * -100}%)`;
                    topSelect.forEach(inner => {
                        inner.classList.remove(lpSetting.set_as_main);
                        inner.classList.add(lpSetting.set_as_sub);
                    });

                    topSelect[option_Value].classList.remove(lpSetting.set_as_sub);
                    topSelect[option_Value].classList.add(lpSetting.set_as_main);

                    if (contentOption[option_Value]) {
                        contentOption[option_Value].style.opacity = '1';
                        if (option_Value + 1 < contentOption.length) {
                            contentOption[option_Value + 1].style.opacity = '0';
                        }
                        if (option_Value - 1 >= 0) {
                            contentOption[option_Value - 1].style.opacity = '0';
                        }
                    }
                }
            });
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
            document.getElementById('user-name').value = localStorage.getItem('name')
            document.querySelector(`.ph.ph-pencil-simple.${lpSetting.field_icon_name}`).style.transform = 'scale(1) rotate(0deg)'
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
        
        // Learn new word
        const learnNewWordBtn = document.getElementById('learnNewWordBtn')
        const learn_container = document.querySelector(`.${lpMain.learn_appear_information}`)
        const overlayLearn = document.getElementById('overlay-new-word-learn')
        const btnNavCon = document.getElementById('btnManageContaner')

        const toNextBtn = document.getElementById('toTheNext-word')
        const toPrevBtn = document.getElementById('toPrevous-word')
        const toFinish = document.getElementById('endAnd-Finish')
        const toClose = document.getElementById('closeThisProce')
        
        if (learnNewWordBtn != null && overlayLearn != null) {
            let closeProcess = () => {
                if (overlayLearn.getAttribute('aria-hidden') == 'false') {
                    toggleScroll()
                    toClose.style.display = 'flex'
                    toNextBtn.style.display = 'flex'
                    toPrevBtn.style.display = 'none'
                    toFinish.style.display = 'none'
                    learn_container.style.opacity = '0';
                    overlayLearn.style.opacity = '0';
                    btnNavCon.style.opacity = '0';
                    overlayLearn.setAttribute('aria-hidden', 'true');
                    learn_container.ontransitionend = () => {
                        learn_container.style.display = 'none';
                        overlayLearn.style.display = 'none';
                        btnNavCon.style.display = 'none';
                    };
                }
            }
            
            document.getElementById('closeThisProce').addEventListener('click', closeProcess)
            overlayLearn.addEventListener('click', closeProcess);
            toFinish.addEventListener('click', () => {
                closeProcess()
                localStorage.setItem('learn_id', parseInt(localStorage.getItem('page_current')) + 1)
                
                let word_score = []
                for (let i = searchId; i < limit4Learn + 1; i++) {
                    let obj = {[i] : 0}
                    word_score.push(obj)
                }

                searchId = parseInt(localStorage.getItem('learn_id'))
                limit4Learn = parseInt(localStorage.getItem('learn_id')) + limitSpaceChange - 1
                
                let data_save =  parseInt(localStorage.getItem('pageSaving'))
                storeNewLearn(data_save, word_score)
            });
            
            // learnNewWordBtn.addEventListener('click', () => {
            //     searchId += pageCurrent
            //     setPageCurrent(pageCurrent + 1)
            //     search_word_specific(searchId)
            //     toggleScroll()
            //     learn_container.style.display = 'flex'
            //     overlayLearn.style.display = 'block'
            //     btnNavCon.style.display = 'flex'
            //     overlayLearn.setAttribute('aria-hidden', 'false')
            //     learn_container.ontransitionend = () => {}
            //     setTimeout(() => {
            //         learn_container.style.opacity = '1'
            //         overlayLearn.style.opacity = '.76'
            //         btnNavCon.style.opacity = '1'
            //     }, 10);
            // })
        }

        // Window event
        window.addEventListener("keydown", (e) => {
            const sideMenu = document.getElementById("sideMenu");
            if (sideMenu == null) return
            if (e.key === "Escape" && sideMenu.getAttribute('aria-hidden') == 'false') {
                closeMenu()
            }
            if (e.key === "Escape" && settingBody.getAttribute('aria-hidden') == 'false') {
                closeSettingFunc()
            }
        });
        window.addEventListener("click", (e) => {
            const sideMenu = document.getElementById("sideMenu");
            const menuBtn = document.getElementById("menuBtn");
            const searchCon = document.getElementById('search-container')
            const overlayLearn = document.getElementById('overlay-new-word-learn')
            if (sideMenu == null || menuBtn == null || searchCon == null || overlayLearn == null) return
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
            const sideMenu = document.getElementById("sideMenu");
            if (sideMenu == null) return
            if (sideMenu.ariaHidden == 'false') {
                closeMenu()
            }
        })
        window.addEventListener('load', () => {
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
        callConfirmSetting(true, true)
        getLearnData()
        // search_word_specific(1426)
    }, [authToken, location]);



    // return loading ? <p>Loading...</p> : ()
    return (
        <div className={lpMain.body}>
        <header className={lpMain.headerSection}>
            <div className={lpMain.con_header}>
                <div className={`${lpMain.open_menu} me_hed_btn`} id="menuBtn">
                    <span className={lpMain.menu_btn_out}></span>
                    <div className={lpMain.menu_btn_gruop}>
                        <span id='menu_btn_in_first' className={lpMain.menu_btn_in}></span>
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
                                onChange={e => {typingSearch(e.currentTarget.value)}}
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
                            navigate(`/learn/search/${e.target.querySelector('div p').innerHTML.split('/')[0]}`);
                        }}>
                            <div className={lpMain.icontentContainer}>
                                <i className="ph ph-magnifying-glass"></i>
                            </div>
                            <div className={lpMain.titleContainer}>
                                <p>{data.thsl_word}</p>
                            </div>
                            <div className={lpMain.descriptContainer}>
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
                <div className={`${lpMain.typeNav}`}>
                    <div className={`${lpMain.iconBtn} ${lpMain.activateSearch} forceCloseMenu`} id="activateSearch">
                        <img src={searchBtn}/>
                        <p>Search</p>
                    </div>
                    <div className={`${lpMain.iconBtn}`}>
                        <img src={favBtn}/>
                        <p>Favorite</p>
                    </div>
                </div>
                <div className={`${lpMain.typeNav}`}>
                    <div className={`${lpMain.iconBtn}`}>
                        <img src={handPosBtn}/>
                        <p>Hand Position</p>
                    </div>
                    <div className={`${lpMain.iconBtn}`}>
                        <img src={handShapeBtn}/>
                        <p>Hand Shape</p>
                    </div>
                    <div className={`${lpMain.iconBtn}`}>
                        <img src={palmTurnBtn}/>
                        <p>Palm Turning</p>
                    </div>
                </div>
                <div className={`${lpMain.typeNav}`}>
                    <div className={`${lpMain.iconBtn} ${lpMain.open_setting} forceCloseMenu`}>
                        <img src={settingBtn}/>
                        <p>Setting</p>
                    </div>
                    <div className={`${lpMain.iconBtn}`} id='logoutBtnFnc' onClick={handleLogout}>
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
                            <span>0</span>
                            <span>DAY</span>
                        </p>
                    </div>
                    <div className={`${lpMain.streak_container} ${lpMain.stbest}`}>
                        <p>Best streak</p>
                        <p id="bestStr" className={lpMain.make_text_gap}>
                            <span>0</span>
                            <span>DAY</span>
                        </p>
                    </div>
                </div>
                <div className={lpMain.showTableStr}></div>
                <div className={lpMain.tell_history}>
                    <p id="last-use">0/0/0</p>
                    <p id="study-time">0</p>
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
                                <span className={lpMain.txthilig} id='txthilig'>0</span>
                                <span>Thai Sign word.</span>
                            </div>
                        </div>
                        <div className={lpMain.box2}>
                            <div className={lpMain.make_text_gap}>
                                <span>Now you have</span>
                                <span className={lpMain.txthilig} id='txthilig'>0</span>
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
                            <span className={lpMain.levamt} id='levamt'>0</span>
                        </p>
                        <p className={lpMain.make_text_gap}>
                            <span>Next Level</span>
                            <span className={lpMain.levamt} id='levamt'>100</span>
                            <span>XP</span>
                        </p>
                    </div>
                    <progress className={lpMain.UserLvl} id="UserLvl" value="0" max="100"></progress>
                </div>
                <div className={lpMain.progress_word}>
                    <div className={lpMain.progress_0}>
                        <p id="wordNumber">0</p>
                        <p>0% - 24%</p>
                    </div>
                    <div className={lpMain.progress_1}>
                        <p id="wordNumber">0</p>
                        <p>25% - 49%</p>
                    </div>
                    <div className={lpMain.progress_2}>
                        <p id="wordNumber">0</p>
                        <p>50% - 74%</p>
                    </div>
                    <div className={lpMain.progress_3}>
                        <p id="wordNumber">0</p>
                        <p>75% - 99%</p>
                    </div>
                    <div className={lpMain.progress_4}>
                        <p id="wordNumber">0</p>
                        <p><span>---</span>100%<span>---</span></p>
                    </div>
                </div>
                <div className={lpMain.revBtn_container}>
                    {(() => {
                        return data_word_score[0] === undefined ? (
                            <button id="learnNewWordBtn" className={`${lpMain.reviewBtn} btnAnimate`}
                                onClick={() => {handle_learnNewWordBtn()}}
                            >
                                <span>Learn new word!!</span>
                            </button>
                        ) : (
                            <button id="reviewBtn" className={`${lpMain.reviewBtn} btnAnimate`}>
                                <span>START</span>
                                <span>(10)</span>
                            </button>
                        );
                    })()}
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
                                            if (value >= 100 || value <= 0) {
                                                let color = element.style.color
                                                element.inert = true
                                                element.setAttribute('type', 'text')
                                                element.value = 'Invalid'
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
                                <div className={lpSetting.sub_con}>
                                    <p title='language'>Language</p>
                                    <select name="language-show" id="language-show" defaultValue="english"
                                        onChange={(e) => {
                                            const lang = e.target.value;
                                            if (['thai', 'english'].includes(lang)) {
                                                setSettingStore(prevState => ({
                                                    ...prevState,
                                                    setValue: {
                                                        ...prevState.setValue,
                                                        lang
                                                    }
                                                }));
                                            }
                                        }}
                                    >
                                        <option value="thai">Thai</option>
                                        <option value="english">English</option>
                                    </select>
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
                                        <div className={lpSetting.sub_upper_container}>
                                            <input name="user-name" id="user-name" type="text" placeholder='User Name' defaultValue={localStorage.getItem('name')} autoComplete='off'
                                                style={{minWidth: '100%', fontSize: 'calc(clamp(48px, 4vw, 66px) / 2.5)'}}
                                                onChange={e => {
                                                    let value = e.currentTarget.value.replace(/\s/g, '')
                                                    let sub = e.currentTarget.parentElement.querySelector('i')
                                                    if (value == localStorage.getItem('name') || value == '') {
                                                        sub.inert = true
                                                        sub.style.transform = 'scale(1) rotate(0deg)'
                                                    } else {
                                                        sub.inert = false
                                                        sub.style.transform = 'scale(1.5) rotate(360deg)'
                                                    }
                                                }}
                                            />
                                            <i className={`ph ph-pencil-simple ${lpSetting.field_icon_name}`} inert
                                                onClick={e => {
                                                    let element = e.currentTarget.parentElement.querySelector('input')
                                                    let value = element.value.replace(/\s/g, '')
                                                    if (value == localStorage.getItem('name') || value == '') {
                                                        e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
                                                        e.currentTarget.inert = true
                                                        element.inert = true
                                                        element.value = 'Invalid'
                                                        element.style.color = '#c32509'
                                                        element.style.border = '3px solid #c32509'
                                                        setTimeout(() => {
                                                            e.currentTarget.inert = false
                                                            element.inert = false
                                                            element.style.color = '#000'
                                                            element.style.border = '3px solid #ccc'
                                                            element.value = localStorage.getItem('name')
                                                        }, 750);
                                                    } else {
                                                        handleNameChange(value);
                                                        e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
                                                    }
                                                }}
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                                <div className={lpSetting.emailpass_info} style={{justifyContent: 'center'}}>
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
                                    <input id="changepswd_setting" type="button" defaultValue="forgot password"/>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div className={lpSetting.bottom_deck}>
                    <input id="advance_setting" type="button" defaultValue="Advance"/>
                    <div className={lpSetting.inner}>
                        <input id="submit_setting" type="button" defaultValue="Ok" className="closeSetting" onClick={() => {callConfirmSetting(true)}}/>
                        <input id="cancle_setting" type="button" defaultValue="Cancle" className="closeSetting" onClick={()  => {callConfirmSetting(false)}}/>
                    </div>
                </div>
            </div>
        </div>

        <div className={lpNavC.rightbottom_Navigate} current-state='close' onClick={(e) => {openMiniNav(e.currentTarget)}}>
            <div className={lpNavC.show_over}>
                <div className={lpNavC.navBtn}></div>
                <div className={lpNavC.navBtn}></div>
            </div>
            <div className={lpNavC.data_drop}>
                <div className={lpNavC.dataContainer} inert onClick={() => {navigate('/learn')}}>
                    <i className="ph ph-house-line"></i>
                </div>
                <div className={`${lpNavC.dataContainer}`} inert id="activateSearch">
                    <i className="ph ph-magnifying-glass"></i>
                </div>
                <div className={lpNavC.dataContainer} inert onClick={() => {navigate('/camera')}}>
                    <i className="ph ph-camera"></i>
                </div>
            </div>
        </div>
        
        <div className={lpMain.learn_appear_information}>
            <div className={lpMain.searchResult_Info_Container}>
                <section className={lpInfor.header_info}>
                    <div className={lpInfor.manage_group}>
                        <div className={lpInfor.process_show}>
                            <p>Progress: 0%</p>
                        </div>
                        <div className={lpInfor.mamage_btn_group}>
                            <i className="ph ph-heart"></i>
                            <i className="ph ph-star"></i>
                        </div>
                    </div>
                    <div className={lpInfor.data_and_itemInfo}>
                        <div className={lpInfor.src_cont}>
                            <img src={searchSpecific.src}></img>
                        </div>
                        <div className={lpInfor.detail_cont}>
                            <div>
                                <p>{searchSpecific.word}</p>
                                <p>word</p>
                            </div>
                            <div>
                                <p id='specific_page_id'>{searchSpecific.id}</p>
                                <p>sequence</p>
                            </div>
                        </div>
                    </div>
                </section>
                {searchSpecific.meaning && Array.isArray(searchSpecific.meaning) ? (
                    searchSpecific.meaning.map((item, index) => (
                        <section className={lpInfor.meaning_info} key={index}>
                            <p className={lpInfor.head}>{item.head}</p>
                            <p className={lpInfor.body}>{
                                (item.text == '') ? "ไม่พบคำอธิบาย" : item.text
                            }</p>
                        </section>
                    ))
                ) : (
                    <p>No meaning available</p>
                )}
            </div>
        </div>
        <div id='btnManageContaner' className={lpMain.toTheNext_new_word}>
            <div className={lpMain.btn_m_subContaner}>
                <i id='closeThisProce' className="ph ph-house"></i>
                <i id='toPrevous-word' className="ph ph-caret-circle-left" style={{display: 'none'}}
                    onClick={e => {toNextLernWord(e.currentTarget, false)}}
                ></i>
            </div>
            <div className={lpMain.btn_m_subContaner}>
                <i id='endAnd-Finish' className="ph ph-seal-check" style={{display: 'none'}}></i>
                <i id='toTheNext-word' className="ph ph-caret-circle-right"
                    onClick={e => {toNextLernWord(e.currentTarget)}}
                ></i>
            </div>
        </div>
        <div id="overlay-new-word-learn" className={`${lpMain.overlay_new_word_learn} ${lpMain.body}`} aria-hidden='true'></div>
        <div id="overlay-setting-container" className={lpSetting.overlay_setting_container}></div>
        </div>
    );
}