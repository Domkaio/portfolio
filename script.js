// E-mail configurado para receber mensagens do formulário pelo FormSubmit.
const CONTACT_EMAIL = "joaobrtcastro@gmail.com";

// Ano e navegação mobile.
document.getElementById("year").textContent = new Date().getFullYear();

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

// Formulário: validação, envio e mensagens de feedback sem sair da página.
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const sendButton = document.getElementById("send-button");
const submitText = sendButton.querySelector(".submit-text");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const fields = [nameInput, emailInput, messageInput];

let sending = false;
const COOLDOWN_MS = 60000; // 1 minuto entre envios na mesma aba.
const COOLDOWN_KEY = "jc-portfolio-contact-last-sent";
let lastSent = 0;
try {
    lastSent = Number(sessionStorage.getItem(COOLDOWN_KEY)) || 0;
} catch (error) {
    // O formulário continua funcionando mesmo com armazenamento bloqueado.
}

function showStatus(message, type = "") {
    status.textContent = message;
    status.className = "form-status";
    if (type) status.classList.add("is-" + type);
}

function showError(input, message) {
    input.setAttribute("aria-invalid", "true");
    document.getElementById(input.id + "-error").textContent = message;
}

function clearError(input) {
    input.removeAttribute("aria-invalid");
    document.getElementById(input.id + "-error").textContent = "";
}

fields.forEach(function (input) {
    input.addEventListener("input", function () { clearError(input); });
});

function validateForm() {
    let valid = true;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    fields.forEach(clearError);

    if (name.length < 2) {
        showError(nameInput, "Informe seu nome (pelo menos 2 caracteres).");
        valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError(emailInput, "Informe um endereço de e-mail válido.");
        valid = false;
    }
    if (message.length < 10) {
        showError(messageInput, "Escreva uma mensagem com pelo menos 10 caracteres.");
        valid = false;
    }
    return valid;
}

function setSending(value) {
    sending = value;
    sendButton.disabled = value;
    submitText.textContent = value ? "Enviando..." : "Enviar mensagem";
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (sending) return; // Impede cliques repetidos durante o envio.

    if (!validateForm()) {
        showStatus("Confira os campos destacados acima.", "error");
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
    }

    // FormSubmit precisa que o site seja aberto via HTTP/HTTPS, não file://.
    if (window.location.protocol === "file:") {
        showStatus("Para enviar uma mensagem, abra o portfólio publicado no GitHub Pages. O formulário não funciona abrindo o HTML diretamente do computador.", "error");
        return;
    }

    const remaining = COOLDOWN_MS - (Date.now() - lastSent);
    if (remaining > 0) {
        showStatus("Mensagem já enviada. Aguarde um minuto antes de tentar novamente.", "error");
        return;
    }

    // Campo invisível que detecta preenchimento automático de bots simples.
    if (form.elements.namedItem("_honey").value) {
        showStatus("Não foi possível enviar a mensagem.", "error");
        return;
    }

    // O endpoint AJAX permite manter a página e limpar os campos após o aceite.
    // O captcha padrão não funciona como uma etapa interativa neste fluxo;
    // ficam ativos o honeypot e a filtragem do serviço externo.
    const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
        _subject: "Contato pelo portfólio de João Castro",
        _template: "table",
        _honey: "",
        _captcha: "false"
    };

    setSending(true);
    showStatus("Enviando sua mensagem...");

    try {
        const response = await fetch("https://formsubmit.co/ajax/" + CONTACT_EMAIL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        const accepted = response.ok && (data.success === true || data.success === "true");

        if (!accepted) {
            // Se o Gmail ainda não foi ativado no FormSubmit, o serviço
            // normalmente retorna um erro. Não apagamos os dados neste caso.
            throw new Error("Submission not accepted");
        }

        form.reset(); // Limpa os dados SOMENTE após resposta positiva.
        fields.forEach(clearError);
        lastSent = Date.now();
        try { sessionStorage.setItem(COOLDOWN_KEY, String(lastSent)); } catch (error) {}
        showStatus("Mensagem recebida pelo serviço de envio! Obrigado pelo contato.", "success");
    } catch (error) {
        showStatus("Não foi possível concluir o envio. Confira a conexão e tente novamente. Se o problema continuar, o formulário pode precisar de ativação.", "error");
    } finally {
        setSending(false);
    }
});
