/* ==========================================================================
   Feature Growth · Web multi-página
   JS compartido: menú móvil, sombra de header, animaciones y año dinámico.
   ========================================================================== */

(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("nav");

  /* Año dinámico */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Menú móvil */
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  /* Sombra del header al hacer scroll */
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Animación de aparición */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
