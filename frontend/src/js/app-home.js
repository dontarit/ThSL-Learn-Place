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