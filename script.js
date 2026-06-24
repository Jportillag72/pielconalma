const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = mainNav.querySelectorAll("a");
const form = document.querySelector("#contact-form");
const successPanel = document.querySelector("#form-success");
const copyButton = document.querySelector("#copy-message");
const openEmail = document.querySelector("#open-email");
const contactEmail = "info@pielconalma.com";
let preparedMessage = "";
let preparedMailto = `mailto:${contactEmail}`;

function closeMenu() {
  mainNav.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.querySelector(".sr-only").textContent = "Abrir menú";
}

function updateContactHeading() {
  const contactHeading = document.querySelector("#contacto h2");
  if (contactHeading) contactHeading.textContent = "Cuéntanos que necesitas";
}

function refineLargeHeadings() {
  const heroHeading = document.querySelector(".hero h1");
  if (heroHeading && heroHeading.textContent.includes("Centro de estética facial")) {
    heroHeading.innerHTML = "Estética facial<br /><em>en Salamanca.</em>";
  }

  const journeyHeading = document.querySelector(".journey .section-heading.compact h2");
  if (journeyHeading && journeyHeading.textContent.includes("Tu primera valoración facial")) {
    journeyHeading.innerHTML = "Valoración facial<br />en Salamanca.";
  }
}

function ensureHeroHeadingStyles() {
  if (document.querySelector("#hero-heading-balance")) return;

  const style = document.createElement("style");
  style.id = "hero-heading-balance";
  style.textContent = `
    .hero h1 {
      max-width: 15ch !important;
      font-size: clamp(3.7rem, 5.8vw, 6.8rem) !important;
      line-height: 0.92 !important;
      text-wrap: balance;
      overflow-wrap: normal;
      hyphens: none;
    }

    .journey .section-heading.compact h2 {
      max-width: 17ch !important;
      font-size: clamp(3rem, 4.7vw, 5.4rem) !important;
      text-wrap: balance;
      overflow-wrap: normal;
      hyphens: none;
    }

    @media (max-width: 800px) {
      .hero h1 {
        max-width: 15ch !important;
        font-size: clamp(3.35rem, 10.2vw, 5.1rem) !important;
        line-height: 0.94 !important;
      }

      .journey .section-heading.compact h2 {
        max-width: 17ch !important;
        font-size: clamp(3rem, 8.8vw, 4.6rem) !important;
      }
    }

    @media (max-width: 520px) {
      .hero h1 {
        max-width: 15ch !important;
        font-size: clamp(3rem, 10.5vw, 4.05rem) !important;
        line-height: 0.96 !important;
      }
    }
  `;
  document.head.appendChild(style);
}

function ensureValuationCtaTargetsForm() {
  const contact = document.querySelector("#contacto");
  if (!contact) return;

  document.querySelectorAll(".nav-cta, .hero-primary-cta").forEach((link) => {
    if (!link.textContent.toLowerCase().includes("valoración")) return;

    link.setAttribute("href", "#contacto");
    link.addEventListener("click", (event) => {
      event.preventDefault();
      closeMenu();
      contact.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", "#contacto");
    });
  });
}

function refineTreatmentsContent() {
  const descriptions = [
    "Tratamiento facial de hidratación intensiva para mejorar la jugosidad, suavizar la textura y conseguir una piel de aspecto fresco, uniforme y luminoso.",
    "Tratamientos faciales avanzados enfocados en acompañar los procesos naturales de renovación, firmeza y vitalidad de la piel, siempre ajustando el protocolo a su estado real.",
    "Maniobras relajantes y estimulantes que liberan tensión y devuelven vitalidad al rostro en una experiencia de bienestar facial pensada para oxigenar, relajar y reconectar.",
  ];

  document.querySelectorAll(".treatment-card").forEach((card, index) => {
    card.querySelector(".card-copy a")?.remove();
    const description = card.querySelector(".card-description");
    if (description && descriptions[index]) description.textContent = descriptions[index];
  });

  const treatmentFooter = document.querySelector(".treatment-footer");
  if (!treatmentFooter) return;

  treatmentFooter.querySelector("a")?.remove();
  const footerText = treatmentFooter.querySelector("p");
  if (footerText) {
    footerText.textContent =
      "También realizamos tratamientos de oxigenación, hidratación y bienestar. En la valoración te orientamos para elegir el protocolo que mejor encaje con tu piel.";
  }
}

function ensureFavicon() {
  if (document.querySelector('link[rel="icon"]')) return;
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/svg+xml";
  favicon.href = "/assets/favicon.svg";
  document.head.appendChild(favicon);
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

function showEmailNotice(mailto) {
  let notice = document.querySelector(".email-notice");

  if (!notice) {
    notice = document.createElement("div");
    notice.className = "email-notice";
    notice.setAttribute("role", "status");
    notice.setAttribute("aria-live", "polite");
    document.body.appendChild(notice);
  }

  notice.innerHTML = "";

  const copy = document.createElement("div");
  const title = document.createElement("strong");
  const text = document.createElement("p");
  const actions = document.createElement("div");
  const emailLink = document.createElement("a");
  const closeButton = document.createElement("button");

  title.textContent = "Abrimos tu correo";
  text.textContent = `Si no se abre automáticamente, escríbenos a ${contactEmail}.`;
  emailLink.href = mailto;
  emailLink.textContent = "Abrir email";
  closeButton.type = "button";
  closeButton.textContent = "Cerrar";
  closeButton.addEventListener("click", () => notice.classList.remove("show"));

  actions.append(emailLink, closeButton);
  copy.append(title, text, actions);
  notice.append(copy);
  notice.classList.add("show");

  window.clearTimeout(showEmailNotice.timeoutId);
  showEmailNotice.timeoutId = window.setTimeout(() => {
    notice.classList.remove("show");
  }, 7000);
}

function prepareEmailClick(event) {
  const link = event.currentTarget;
  const mailto = link.getAttribute("href");

  if (!mailto || !mailto.startsWith("mailto:")) return;

  event.preventDefault();
  navigator.clipboard?.writeText(contactEmail).catch(() => {});
  showEmailNotice(mailto);
  window.setTimeout(() => {
    window.location.href = mailto;
  }, 80);
}

menuToggle.addEventListener("click", () => {
  const willOpen = !mainNav.classList.contains("open");
  mainNav.classList.toggle("open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.querySelector(".sr-only").textContent = willOpen ? "Cerrar menú" : "Abrir menú";
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document
  .querySelectorAll(`a[href^="mailto:${contactEmail}"]`)
  .forEach((link) => link.addEventListener("click", prepareEmailClick));

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

  preparedMailto = `mailto:${contactEmail}?subject=${encodeURIComponent(
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
ensureFavicon();
refineLargeHeadings();
ensureHeroHeadingStyles();
updateContactHeading();
refineTreatmentsContent();
ensureFooterLinks();
ensureValuationCtaTargetsForm();
