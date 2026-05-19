const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const form = document.querySelector(".contact-form");
const formMessage = document.querySelector("[data-form-message]");

function syncHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    header.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const empresa = data.get("empresa") || "sua empresa";
  const whatsapp = data.get("whatsapp") || "não informado";
  const categoria = data.get("categoria") || "não informada";

  const message = [
    "Olá, quero ser fornecedor parceiro da AutoZap.",
    "",
    `Empresa: ${empresa}`,
    `WhatsApp comercial: ${whatsapp}`,
    `Principal categoria: ${categoria}`,
  ].join("\n");

  const whatsappUrl = `https://api.whatsapp.com/send?phone=5511921004554&text=${encodeURIComponent(message)}`;

  formMessage.textContent = `Interesse registrado para ${empresa}. Nossa equipe comercial entrará em contato pelo WhatsApp informado.`;
  window.location.href = whatsappUrl;
  form.reset();
});

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

if (window.lucide) {
  window.lucide.createIcons();
}
