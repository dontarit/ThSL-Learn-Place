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
        element.style.transform = 'translateY(-5%) scale(1.02)'
        element.transition = 'transform 100ms'
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

window.addEventListener("click", (e) => {
    if (
        sideMenu.getAttribute('aria-hidden') == 'false' &&
        !sideMenu.contains(e.target) &&
        e.target !== menuBtn
    ) {
        closeMenu();
    }
});

window.addEventListener('scroll', () => {
    if (sideMenu.ariaHidden == 'false') {
        closeMenu()
    }
})



// Search button animation
const searchBtn = document.querySelectorAll('#activateSearch')
const searchCon = document.querySelector('.search-container')
const searchInput = document.getElementById('search-box')
const headBtn = document.querySelectorAll('.me-hed-btn')

searchBtn.forEach(element => {
    element.addEventListener('click', () => {
        if (window.innerWidth < 481) {
            headBtn.forEach(ele => {
                ele.style.transition = 'opacity 300ms'
                ele.style.opacity = '0'
            });
        }
        searchCon.style.transition = 'ease top 300ms'
        searchCon.style.top = '50%'
        searchInput.focus()
    })
});
searchInput.addEventListener('focusout', () => {
    if (window.innerWidth < 481) {
        headBtn.forEach(element => {
            element.style.transition = 'opacity 300ms'
            element.style.opacity = '1'
        });
    }
    searchCon.style.transition = 'ease top 300ms'
    searchInput.value = ''
    searchCon.style.top = '-50%'
})



// Spin animation for icon
const setingOpen = document.querySelectorAll('.setingOpen')
setingOpen.forEach(element => {
    element.addEventListener('click', () => {
        let time = 500
        element.style.transition = `transform ${time}ms`
        element.style.transform = 'rotate(360deg)'
    })
});



// Change setting option
const settingBody = document.querySelector('.setting-container')
const openSetting = document.querySelector('.open-setting')
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
openSetting.addEventListener('click', () => {
    topSelect[0].click()
    overlaySetting.style.display = 'block'
    setTimeout(() => {
        overlaySetting.style.opacity = '1'
    }, 100);
    settingBody.ariaHidden = false
    settingBody.classList.remove('setting-container-close')
    settingBody.classList.add('setting-container-open')
    settingBody.inert = false
})

function closeSettingFunc() {
    overlaySetting.style.opacity = '0'
    setTimeout(() => {
        overlaySetting.style.display = 'none'
    }, 100);
    settingBody.ariaHidden = true
    openSetting.style.transform = 'rotate(0deg)'
    settingBody.classList.remove('setting-container-open')
    settingBody.classList.add('setting-container-close')
    settingBody.inert = true
}

const advanceSetting = document.getElementById('advance_setting')
const submitSetting = document.getElementById('submit_setting')
const cancleSetting = document.getElementById('cancle_setting')
const closeSetting = document.querySelector('.setting-container .con-out .ph-x')

cancleSetting.addEventListener('click', () => {
    closeSettingFunc()
})
closeSetting.addEventListener('click', () => {
    closeSettingFunc()
})



// Event keydown
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sideMenu.getAttribute('aria-hidden') == 'false') {
        closeMenu()   
    }
    if (e.key === "Escape" && settingBody.getAttribute('aria-hidden') == 'false') {
        closeSettingFunc()
    }
});