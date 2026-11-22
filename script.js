// E-mail público para recebimento pelo serviço FormSubmit.
const CONTACT_EMAIL = "joaobrtcastro@gmail.com";

// Atualiza automaticamente o ano do rodapé.
document.getElementById("year").textContent = new Date().getFullYear();

// Menu do celular.
const menuButton = document.getElementById("menu-toggle");
const nav = document.getElementById("main-nav");

menuButton.addEventListener("click", function () {
    const aberto = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(aberto));
    menuButton.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
});

nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu");
    });
});

// Validação do formulário de contato.
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

function showError(input, message) {
    input.setAttribute("aria-invalid", "true");
    document.getElementById(input.id + "-error").textContent = message;
}

function clearError(input) {
    input.removeAttribute("aria-invalid");
    document.getElementById(input.id + "-error").textContent = "";
}

[nameInput, emailInput, messageInput].forEach(function (input) {
    input.addEventListener("input", function () { clearError(input); });
});

function validateForm() {
    let valid = true;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    [nameInput, emailInput, messageInput].forEach(clearError);

    if (name.length < 2) {
        showError(nameInput, "Informe seu nome (pelo menos 2 caracteres).");
        valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showError(emailInput, "Informe um endereço de e-mail válido.");
        valid = false;
    }

    if (message.length < 10) {
        showError(messageInput, "Escreva uma mensagem com pelo menos 10 caracteres.");
        valid = false;
    }

    return valid;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.className = "form-status";

    if (!validateForm()) {
        status.textContent = "Confira os campos destacados acima.";
        status.classList.add("is-error");
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
    }

    // FormSubmit recebe mensagens no e-mail indicado. É gratuito e não exige servidor.
    // No primeiro envio, é necessário confirmar o e-mail pela mensagem de ativação.
    if (!CONTACT_EMAIL || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT_EMAIL)) {
        status.textContent = "O formulário está pronto, mas o e-mail de destino ainda precisa ser configurado.";
        status.classList.add("is-error");
        return;
    }

    form.action = "https://formsubmit.co/" + encodeURIComponent(CONTACT_EMAIL);
    status.textContent = "Abrindo o serviço de envio...";
    status.classList.add("is-success");
    form.submit();
});
