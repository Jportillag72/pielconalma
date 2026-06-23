const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = mainNav.querySelectorAll("a");
const form = document.querySelector("#contact-form");
const successPanel = document.querySelector("#form-success");
const copyButton = document.querySelector("#copy-message");
const openEmail = document.querySelector("#open-email");
let preparedMessage = "";
let preparedMailto = "mailto:info@pielconalma.com";

function closeMenu() {
  mainNav.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.querySelector(".sr-only").textContent = "Abrir menú";
}

function updateContactHeading() {
  const contactHeading = document.querySelector("#contacto h2");
  if (contactHeading) contactHeading.textContent = "Nos cuentas qué necesitas";
}

function ensureFooterLinks() {
  const footerLinks = document.querySelector(".footer-links");
  if (!footerLinks) return;

  const legalLinks = [
    ["Aviso Legal", "/aviso-legal.html"],
    ["Política de Privacidad", "/politica-privacidad.html"],
    ["Cookies", "/cookies.html"],
  ];
  const instagramLink = footerLinks.querySelector('a[href*="instagram.com"]');

  legalLinks.forEach(([label, href]) => {
    if (footerLinks.querySelector(`a[href="${href}"]`)) return;
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    footerLinks.insertBefore(link, instagramLink || null);
  });

  const footerInstagram = footerLinks.querySelector('a[href*="instagram.com"]');
  if (footerInstagram) {
    footerInstagram.href = "https://www.instagram.com/pielconalma/";
    footerInstagram.removeAttribute("target");
    footerInstagram.setAttribute("rel", "noopener noreferrer");
  }
}

menuToggle.addEventListener("click", () => {
  const willOpen = !mainNav.classList.contains("open");
  mainNav.classList.toggle("open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.querySelector(".sr-only").textContent = willOpen ? "Cerrar menú" : "Abrir menú";
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.querySelectorAll(".faq-list details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".faq-list details").forEach((other) => {
      if (other !== detail) other.removeAttribute("open");
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  preparedMessage = [
    "Hola Piel Con Alma, me gustaría pedir información o cita.",
    "",
    `Nombre: ${data.get("name")}`,
    `Teléfono: ${data.get("phone")}`,
    `Me interesa: ${data.get("treatment")}`,
    data.get("message") ? `Consulta: ${data.get("message")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  preparedMailto = `mailto:info@pielconalma.com?subject=${encodeURIComponent(
    `Consulta web · ${data.get("treatment")}`,
  )}&body=${encodeURIComponent(preparedMessage)}`;

  if (openEmail) openEmail.href = preparedMailto;
  navigator.clipboard?.writeText(preparedMessage).catch(() => {});
  form.classList.add("submitted");
  successPanel.classList.add("show");
  form.scrollIntoView({ behavior: "smooth", block: "center" });
  copyButton.focus({ preventScroll: true });
  window.location.href = preparedMailto;
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(preparedMessage);
    copyButton.textContent = "¡Mensaje copiado!";
  } catch {
    copyButton.textContent = "Selecciona y copia el mensaje";
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
updateContactHeading();
ensureFooterLinks();
