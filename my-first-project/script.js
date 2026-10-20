"use strict";

const root = document.documentElement;
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const themeToggle = document.querySelector(".theme-toggle");
const accentToggle = document.querySelector(".accent-toggle");
const toast = document.querySelector(".toast");
const contactForm = document.querySelector(".contact-form");
let toastTimeout;
let accentIndex = 0;

document.querySelector("#current-year").textContent = new Date().getFullYear();

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  siteNav.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuToggle.focus();
  }
});

themeToggle.addEventListener("click", () => {
  const isDark = root.dataset.theme !== "dark";
  root.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  themeToggle.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");
});

const accents = [
  { accent: "#c55b3f", soft: "#f2dfd5" },
  { accent: "#627b68", soft: "#dfe8dc" },
  { accent: "#8d6b9d", soft: "#e9dfed" },
];

accentToggle.addEventListener("click", () => {
  accentIndex = (accentIndex + 1) % accents.length;
  root.style.setProperty("--accent", accents[accentIndex].accent);
  root.style.setProperty("--accent-soft", accents[accentIndex].soft);
  accentToggle.setAttribute("aria-label", `Accent color ${accentIndex + 1} of ${accents.length}`);
});

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    document.querySelectorAll(".project-card").forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
    });
  });
});

function showToast(message) {
  window.clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 4500);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const subject = `Project inquiry from ${formData.get("name")}`;
  const body = [
    `Name: ${formData.get("name")}`,
    `Email: ${formData.get("email")}`,
    "",
    formData.get("message"),
  ].join("\n");
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showToast("Your email draft is ready. Add the recipient's address in your email app to send it.");
});
