"use strict";

var menuBtn = document.querySelector(".menu-icon");
var mobilNav = document.querySelector(".mobil-nav-1");
menuBtn.addEventListener("click", function () {
  document.querySelector(".navbar-brand").classList.toggle("active");
  mobilNav.classList.toggle("active");
});