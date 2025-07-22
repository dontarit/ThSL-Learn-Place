/* ===== Burger toggle ===== */
const burger = document.getElementById("burger");
const navList = document.getElementById("nav-list");
burger.addEventListener("click", () => navList.classList.toggle("show"));

/* ===== Dynamic year ===== */
document.getElementById("year").textContent = new Date().getFullYear();