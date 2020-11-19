


const menuBtn = document.querySelector(".menu-icon")
const mobilNav = document.querySelector(".mobil-nav-1")


menuBtn.addEventListener("click", () => {
    document.querySelector(".navbar-brand").classList.toggle("active")
    mobilNav.classList.toggle("active")
})