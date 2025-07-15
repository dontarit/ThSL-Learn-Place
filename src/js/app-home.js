/* ===== Burger toggle ===== */
const burger = document.getElementById("burger");
const navList = document.getElementById("nav-list");
burger.addEventListener("click", () => navList.classList.toggle("show"));

/* ===== Dynamic year ===== */
document.getElementById("year").textContent = new Date().getFullYear();

const projects = [
    {
        title: "Title",
        desc: "description",
        img: "https://placehold.co/600x350?text=Image",
    },
    {
        title: "Title",
        desc: "description",
        img: "https://placehold.co/600x350?text=Image",
    },
    {
        title: "Title",
        desc: "description",
        img: "https://placehold.co/600x350?text=Image",
    },
    {
        title: "Title",
        desc: "description",
        img: "https://placehold.co/600x350?text=Image",
    },
    {
        title: "Title",
        desc: "description",
        img: "https://placehold.co/600x350?text=Image",
    },
    {
        title: "Title",
        desc: "description",
        img: "https://placehold.co/600x350?text=Image",
    }
];

const grid = document.getElementById("project-grid");
let delay = {count: 0, value: 0}
projects.forEach((p) => {
    const card = document.createElement("article");
    card.className = "project-card fade";
    card.setAttribute('data-aos-delay', `${delay.value}`)
    card.setAttribute('data-aos', "zoom-in-up")
    card.setAttribute('data-aos-once', "true")
    delay.count += 1
    delay.count == 3 ? delay.value = 0 : delay.value += 150
    card.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <div class="content">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        </div>
    `;
    grid.appendChild(card);
});



const mainForm = document.querySelector('#chkFormSec');
const log_h = document.querySelector('.login .handler');
const sign_h = document.querySelector('.signup .handler');
const timing = 30;
const formTxt = {
    sign: {
        main: 'Sign up',
        change: "Don't have an account?"
    },
    log: {
        main: 'Login',
        change: "Already a user?"
    }
};

let change_main, change_sub;

mainForm.addEventListener('click', () => {
    clearInterval(change_main);
    clearInterval(change_sub);

    let chgt_m = '';
    let chgt_s = '';
    let count_m = 0;
    let count_s = 0;

    const isLogin = mainForm.checked;
    const mainText = isLogin ? formTxt.sign.change : formTxt.log.change;
    const subText = isLogin ? formTxt.log.main : formTxt.sign.main;
    const mainHandler = isLogin ? sign_h : log_h;
    const subHandler = isLogin ? log_h : sign_h;

    if (isLogin) {
        document.querySelector('.signinBtnGroup').inert = true
        document.querySelector('.loginBtnGroup').inert = false
    } else {
        document.querySelector('.signinBtnGroup').inert = false
        document.querySelector('.loginBtnGroup').inert = true
    }

    change_main = setInterval(() => {
        if (count_m === mainText.length) {
            clearInterval(change_main);
        } else {
            chgt_m += mainText[count_m];
            mainHandler.innerHTML = chgt_m;
            count_m += 1;
        }
    }, timing);

    change_sub = setInterval(() => {
        if (count_s === subText.length) {
            clearInterval(change_sub);
        } else {
            chgt_s += subText[count_s];
            subHandler.innerHTML = chgt_s;
            count_s += 1;
        }
    }, timing * 4);
});
