import axios from 'axios';

import lpMain from '../../css/learnPlace.module.css'

export default async function comfirmSetting(apply, firstload, settingStore, setSettingStore, authToken, streak_new_form = false) {
    const historyShow = document.getElementById('history-show')
    const streakShow = document.getElementById('streak-show')
    const themeShow = document.getElementById('theme-show')
    const timeShow = document.getElementById('time-show')
    const langShow = document.getElementById('language-show')

    if (apply) {
        Object.entries(settingStore.setValue).forEach(thevalue => {
            settingStore.value[thevalue[0]] = thevalue[1]
        })
    } else {
        Object.entries(settingStore.value).forEach(thevalue => {
            settingStore.setValue[thevalue[0]] = thevalue[1]
        })
    }

    let schedule = settingStore.value.schedule
    let streak = settingStore.value.streak
    let theme = settingStore.value.theme
    let time = settingStore.value.time
    let lang = settingStore.value.lang

    if (firstload) {
        await axios.post('/getSetting', {token: authToken}).then(res => {
            const data = JSON.parse(res.data[0].user_setting);
            
            schedule = data.schedule == undefined ? 4 : data.schedule
            streak = data.streak == undefined ? false : data.streak
            theme = data.theme == undefined ? 'light' : data.theme
            time = data.time == undefined ? '00:10' : data.time
            lang = data.lang == undefined ? 'english' : data.lang
        })
        .catch(err => {
            console.error("Failed to load settings:", err);
        });

        setSettingStore({
            setValue: {
                schedule: schedule,
                streak: streak,
                theme: theme,
                time: time,
                lang: lang
            },
            value: {
                schedule: schedule,
                streak: streak,
                theme: theme,
                time: time,
                lang: lang
            }
        })
    }
    
    let setting = {
        schedule: schedule,
        streak: streak,
        theme: theme,
        time: time,
        lang: lang
    }
    
    await axios.post('/saveSetting', {token: authToken, value: JSON.stringify(setting)}).catch(err => {
        console.log('error save setting: ', err)
    })

    // table
    changeStrTable(schedule, 7)
    historyShow.setAttribute('placeholder', `${schedule} week`)
    // streak
    if (streak_new_form) {
        disableStreak_new_form(streak)
    } else {
        disableStreak(streak, firstload)
    }
    streakShow.checked = setting.streak
    // theme
    checkTheme(theme)
    themeShow.value = setting.theme
    // time
    timeShow.value = setting.time
    // language
    langShow.value = setting.lang
}



// table
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

// streak
function disableStreak(disable, firstLoad = false, anItem = false) {
    let time = 500
    const main = document.querySelector(`.${lpMain.mainContent_container}`)
    const schedule = document.querySelector(`.${lpMain.schedule}`)
    main.style.transition = `${time}ms`
    schedule.style.transition = `${time}ms`
    if (disable) {
        if (firstLoad || schedule.style.display == 'none') {
            schedule.style.display = 'none'
            return
        }
        main.style.transform = `translateY(calc(0% - clamp(1.2em, 8vw, 5em) - ${schedule.offsetHeight}px))`
        schedule.classList.add(lpMain.disableSchedule)
    } else {
        schedule.style.display = 'flex'
        setTimeout(() => {
            main.style.transform = 'translateY(0%)'
            schedule.classList.remove(lpMain.disableSchedule)
        }, 100);
    }
}
function disableStreak_new_form(disable) {
    let time = 500
    const main = document.querySelector(`.${lpMain.mainContent_container}`)
    const schedule = document.querySelector(`.${lpMain.schedule}`)
    main.style.transition = `${time}ms`
    schedule.style.transition = `${time}ms`
    if (disable) {
        schedule.classList.add(lpMain.disableSchedule)
    }else {
        schedule.classList.remove(lpMain.disableSchedule)
    }
}

// theme
function checkTheme(theme) {
    const validThemes = ['light', 'dark', 'ocean'];
    if (validThemes.includes(theme)) {
        document.querySelector(`.${lpMain.body}`).setAttribute('data-theme', theme);
    }
}