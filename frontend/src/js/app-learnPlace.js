// Create streak table
function changeStrTable() {
    let row, col
    const tableStr = document.querySelector('.showTableStr')
    
    tableStr.classList.forEach(element => {
        if (element.substring(0, 3) == "row") {
            row = parseInt(element.substring(4, 6))
        }
        if (element.substring(0, 3) == "col") {
            col = parseInt(element.substring(4, 6))
        }
    });
    for (let i = 1; i <= row; i++) {
        let theRow = document.createElement('div')
        theRow.classList.add(`row-${i}`)
        theRow.classList.add("tableRow")

        for (let j = 1; j <= col; j++) {
            let theColumn = document.createElement('div')
            let input = document.createElement('input')
            let i = document.createElement('i')

            theColumn.classList.add(`col-${j}`)
            theColumn.classList.add("tableColumn")
            input.type = 'button'
            i.classList.add('fa-solid')
            i.classList.add('fa-circle-check')

            theColumn.appendChild(input)
            theColumn.appendChild(i)
            theRow.appendChild(theColumn)
        }
        tableStr.appendChild(theRow)
    }
    document.querySelector('.tableColumn').style.width = 'calc(50% / (7 / 1.5))'
}
changeStrTable()



// Button animation on click
const append_btnAnimate = document.querySelectorAll('.btnAnimate')
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
const menuBtn_out = document.querySelectorAll(".open-menu .menu-btn-out");
const menuBtn_in = document.querySelector(".open-menu .menu-btn-in")
const sideItem = document.querySelectorAll('.nav-bar .typeNav div')

function openMenu() {
    sideMenu.inert = false
    sideMenu.style.transform = "translateX(0%)";
    sideMenu.setAttribute("aria-hidden", "false");
    menuBtn.classList.remove('hdrmnbtn-close')
    menuBtn.classList.add('hdrmnbtn-open')
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
    menuBtn.classList.remove('hdrmnbtn-open')
    menuBtn.classList.add('hdrmnbtn-close')
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
const searchCon = document.querySelector('.search-container')
const searchInput = document.getElementById('search-box')
const headBtn = document.querySelectorAll('.me-hed-btn')

function openSearch() {
    if (window.innerWidth < 768) {
        headBtn.forEach(elememt => {
            elememt.inert = true
            elememt.style.transition = 'opacity 300ms'
            elememt.style.opacity = '0'
        });
    }
    searchCon.inert = false
    searchCon.style.transition = 'ease top 300ms'
    searchCon.style.top = '50%'
    searchInput.focus()
}
function closeSearch() {
    if (window.innerWidth < 768) {
        headBtn.forEach(element => {
            element.inert = false
            element.style.transition = 'opacity 300ms'
            element.style.opacity = '1'
        });
    }
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



// Spin animation, use when open setting page with gear icon
function SpinCheck(elememt) {
    if (elememt.classList.contains('Spin-n')) {
        elememt.classList.remove('Spin-n')
        elememt.classList.add('Spin-y')
    }
    else if (elememt.classList.contains('Spin-y')) {
        elememt.classList.remove('Spin-y')
        elememt.classList.add('Spin-n')
    }
}



// Change setting option
const settingBody = document.querySelector('.setting-container')
const openSetting = document.querySelectorAll('.open-setting')
const overlaySetting = document.getElementById('overlay-setting-container')
const closeStBtn = document.querySelector('.setting-container .con-out .ph-x')
const quesStBtn = document.querySelector('.setting-container .con-out .ph-question-mark')

const slideContent = document.querySelector('.conFor-mainCon')
const contentOption = document.querySelectorAll('.main-content')
const topSelect = document.querySelectorAll('.topSelect p')

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
        SpinCheck(element)
        topSelect[0].click()
        overlaySetting.style.transition = `all ${overlaySettingTime}ms`
        overlaySetting.style.display = 'block'
        setTimeout(() => {
            overlaySetting.style.opacity = '1'
        }, overlaySettingTime);
        settingBody.ariaHidden = false
        settingBody.classList.remove('setting-container-close')
        settingBody.classList.add('setting-container-open')
        settingBody.inert = false
    })
});

function closeSettingFunc() {
    overlaySetting.style.transition = `all ${overlaySettingTime}ms`
    overlaySetting.style.opacity = '0'
    setTimeout(() => {
        overlaySetting.style.display = 'none'
    }, overlaySettingTime);
    settingBody.ariaHidden = true
    settingBody.classList.remove('setting-container-open')
    settingBody.classList.add('setting-container-close')
    settingBody.inert = true
}

const advanceSetting = document.getElementById('advance_setting')
const submitSetting = document.getElementById('submit_setting')
const closeSetting = document.querySelectorAll('.closeSetting')

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