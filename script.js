const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const form = document.querySelector(".contact-form");
const formMessage = document.querySelector("[data-form-message]");
const API_BASE = "https://aip.autozap.log.br";
let isSubmitting = false;

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
  if (isSubmitting) return;

  const data = new FormData(form);
  const empresa = data.get("empresa") || "sua empresa";
  const whatsapp = data.get("whatsapp") || "não informado";
  const categoria = data.get("categoria") || "não informada";

  isSubmitting = true;
  const submitButton = form.querySelector("button[type='submit']");
  const previousLabel = submitButton?.innerHTML || "";
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = "Enviando...";
  }

  formMessage.textContent = "Enviando seu interesse...";

  fetch(`${API_BASE}/partner/interest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      companyName: String(empresa).trim(),
      whatsapp: String(whatsapp).trim(),
      category: String(categoria).trim(),
      source: "autozap-partner",
    }),
  })
    .then(async (response) => {
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || payload.error || "Nao foi possivel enviar agora.");
      }
      formMessage.textContent = `Interesse recebido para ${empresa}. Nossa equipe vai analisar seu cadastro.`;
      form.reset();
    })
    .catch((error) => {
      formMessage.textContent = error.message || "Falha ao enviar o interesse. Tente novamente.";
    })
    .finally(() => {
      isSubmitting = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = previousLabel;
      }
    });
});

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

if (window.autozapIcons) {
  window.autozapIcons.createIcons();
}
