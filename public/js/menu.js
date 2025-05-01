const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector("ul.nav-links");

//Menú desplegable en dispositivos móviles
menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});