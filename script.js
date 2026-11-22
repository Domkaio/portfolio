/* ==========================================================================
   Portfólio · João Castro (v5)
   JavaScript puro, sem dependências. Cada módulo se protege caso o
   elemento não exista, então um erro em um efeito não derruba o resto.
   ========================================================================== */
(function () {
    "use strict";

    // E-mail configurado para receber mensagens do formulário pelo FormSubmit.
    const CONTACT_EMAIL = "joaobrtcastro@gmail.com";

    const root = document.documentElement;
    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = root.classList.contains("has-cursor");
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    function safe(fn) {
        try { fn(); } catch (error) { if (window.console) console.warn("[portfolio]", error); }
    }

    /* ---------- Ano no rodapé ---------- */
    safe(function () { $("#year").textContent = new Date().getFullYear(); });

    /* ---------- Preloader e entrada do hero ---------- */
    safe(function () {
        const preloader = $("#preloader");
        const start = performance.now();
        let done = false;

        function finish() {
            if (done) return;
            done = true;
            if (preloader) preloader.classList.add("is-done");
            document.body.classList.add("is-loaded");
        }

        function whenReady() {
            const wait = reduceMotion ? 0 : Math.max(0, 1000 - (performance.now() - start));
            setTimeout(finish, wait);
        }

        if (document.readyState === "complete") whenReady();
        else window.addEventListener("load", whenReady, { once: true });
        setTimeout(finish, 3500); // Garantia: nunca deixa a tela travada no preloader.
    });

    /* ---------- Menu mobile ---------- */
    const menuButton = $("#menu-toggle");
    const nav = $("#main-nav");

    function setMenu(open) {
        if (!menuButton || !nav) return;
        nav.classList.toggle("open", open);
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    }

    safe(function () {
        menuButton.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
        $$("a", nav).forEach(function (link) { link.addEventListener("click", function () { setMenu(false); }); });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuButton.focus(); }
        });
        document.addEventListener("click", function (e) {
            if (nav.classList.contains("open") && !nav.contains(e.target) && !menuButton.contains(e.target)) setMenu(false);
        });
        window.addEventListener("resize", function () { if (window.innerWidth > 600) setMenu(false); });
    });

    /* ---------- Header, barra de progresso e botão de topo ---------- */
    safe(function () {
        const header = $(".site-header");
        const bar = $("#scroll-progress");
        const toTop = $("#to-top");
        let ticking = false;

        function update() {
            const y = window.scrollY || window.pageYOffset;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (header) header.classList.toggle("is-scrolled", y > 24);
            if (bar) bar.style.transform = "scaleX(" + (max > 0 ? clamp(y / max, 0, 1) : 0) + ")";
            if (toTop) toTop.classList.toggle("is-visible", y > 700);
            ticking = false;
        }

        window.addEventListener("scroll", function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        window.addEventListener("resize", update);
        update();

        if (toTop) toTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });
    });

    /* ---------- Revelar ao rolar (com atraso escalonado) ---------- */
    safe(function () {
        const items = $$("[data-reveal]");
        if (!("IntersectionObserver" in window)) {
            items.forEach(function (el) { el.classList.add("is-in"); });
            return;
        }
        // Escalona irmãos que aparecem juntos (ex.: os três cards de projeto).
        const groups = new Map();
        items.forEach(function (el) {
            const parent = el.parentElement;
            const count = groups.get(parent) || 0;
            el.style.setProperty("--rd", Math.min(count, 5) * 110 + "ms");
            groups.set(parent, count + 1);
        });
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-in");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
        items.forEach(function (el) { io.observe(el); });
    });

    /* ---------- Menu ativo conforme a seção visível (scrollspy) ---------- */
    safe(function () {
        const links = $$('.main-nav a[href^="#"]').filter(function (a) { return a.getAttribute("href").length > 1; });
        const map = new Map();
        links.forEach(function (a) {
            const section = document.getElementById(a.getAttribute("href").slice(1));
            if (section) map.set(section, a);
        });
        if (!("IntersectionObserver" in window) || !map.size) return;
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (a) { a.removeAttribute("aria-current"); });
                const link = map.get(entry.target);
                if (link) link.setAttribute("aria-current", "true");
            });
        }, { rootMargin: "-45% 0px -50% 0px" });
        map.forEach(function (_, section) { io.observe(section); });
        // Ao voltar ao topo, nenhum item fica marcado.
        const hero = $("#hero-wrap");
        if (hero) new IntersectionObserver(function (e) {
            if (e[0].isIntersecting) links.forEach(function (a) { a.removeAttribute("aria-current"); });
        }, { rootMargin: "-45% 0px -50% 0px" }).observe(hero);
    });

    /* ---------- Texto digitado no hero ---------- */
    safe(function () {
        const el = $("#typed");
        if (!el || reduceMotion) return;
        const words = ["JavaScript", "Python", "Interfaces web", "Lógica & criatividade", "Soluções digitais"];
        let w = 0, i = words[0].length, deleting = false;
        function tick() {
            const word = words[w];
            el.textContent = word.slice(0, i);
            let delay = deleting ? 38 : 85;
            if (!deleting && i === word.length) { deleting = true; delay = 1700; }
            else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 320; }
            else i += deleting ? -1 : 1;
            setTimeout(tick, delay);
        }
        setTimeout(tick, 3200);
    });

    /* ---------- Rede de partículas interativa (canvas do hero) ---------- */
    safe(function () {
        const canvas = $("#network");
        const wrap = $("#hero-wrap");
        if (!canvas || !wrap || !canvas.getContext) return;
        const ctx = canvas.getContext("2d");
        const mouse = { x: -9999, y: -9999 };
        let w = 0, h = 0, dpr = 1, pts = [], raf = 0, visible = true;

        function resize() {
            const r = wrap.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = r.width; h = r.height;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const n = clamp(Math.round((w * h) / 15000), 24, 85);
            pts = Array.from({ length: n }, function () {
                return { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.32, vy: (Math.random() - 0.5) * 0.32, r: Math.random() * 1.5 + 0.6 };
            });
            if (reduceMotion) draw();
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            const link = w < 700 ? 95 : 130;
            for (let a = 0; a < pts.length; a++) {
                const p = pts[a];
                if (!reduceMotion) {
                    p.x += p.vx; p.y += p.vy;
                    if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
                    if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
                    const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
                    if (d < 170 && d > 0.1) { // Atração suave em direção ao cursor.
                        const f = (1 - d / 170) * 0.55;
                        p.x += (dx / d) * f; p.y += (dy / d) * f;
                    }
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, 6.2832);
                ctx.fillStyle = "rgba(190,170,255,.75)";
                ctx.fill();
                for (let b = a + 1; b < pts.length; b++) {
                    const q = pts[b], d2 = Math.hypot(p.x - q.x, p.y - q.y);
                    if (d2 < link) {
                        ctx.strokeStyle = "rgba(150,140,255," + (0.22 * (1 - d2 / link)).toFixed(3) + ")";
                        ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                    }
                }
                const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if (dm < 170) { // Linhas em ciano ligando ao cursor.
                    ctx.strokeStyle = "rgba(103,232,249," + (0.45 * (1 - dm / 170)).toFixed(3) + ")";
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
                }
            }
        }

        function loop() {
            if (!visible || document.hidden) { raf = 0; return; }
            draw();
            raf = requestAnimationFrame(loop);
        }
        function run() { if (!raf && !reduceMotion) raf = requestAnimationFrame(loop); }

        wrap.addEventListener("pointermove", function (e) {
            const r = wrap.getBoundingClientRect();
            mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
        });
        wrap.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });

        let resizeTimer;
        window.addEventListener("resize", function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); });
        document.addEventListener("visibilitychange", run);
        if ("IntersectionObserver" in window) {
            new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) run(); }).observe(wrap);
        }
        resize();
        run();
    });

    /* ---------- Spotlight + inclinação 3D ---------- */
    safe(function () {
        $$("[data-spot], [data-tilt]").forEach(function (el) {
            const max = parseFloat(el.getAttribute("data-tilt")) || 0;
            const tilt = max > 0 && finePointer && !reduceMotion;
            const base = el.classList.contains("code-window") ? " rotate(-1.5deg)" : "";

            el.addEventListener("pointermove", function (e) {
                if (e.pointerType === "touch") return;
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                el.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
                el.style.setProperty("--my", (y * 100).toFixed(1) + "%");
                if (tilt) {
                    el.style.transform = "perspective(1000px) rotateX(" + ((0.5 - y) * max).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * max).toFixed(2) + "deg) translateY(-4px)";
                }
            });
            el.addEventListener("pointerleave", function () {
                if (tilt) el.style.transform = base ? "rotate(-1.5deg)" : "";
            });
        });
    });

    /* ---------- Botões magnéticos ---------- */
    safe(function () {
        if (!finePointer || reduceMotion) return;
        $$("[data-magnetic]").forEach(function (el) {
            el.addEventListener("pointermove", function (e) {
                const r = el.getBoundingClientRect();
                const x = e.clientX - (r.left + r.width / 2);
                const y = e.clientY - (r.top + r.height / 2);
                el.style.transform = "translate(" + (x * 0.22).toFixed(1) + "px," + (y * 0.32).toFixed(1) + "px)";
            });
            el.addEventListener("pointerleave", function () { el.style.transform = ""; });
        });
    });

    /* ---------- Mini visuais dos projetos ---------- */
    safe(function () {
        $$(".mini-keys i").forEach(function (key, idx) {
            key.style.animationDelay = (idx * 0.45).toFixed(2) + "s";
        });
        const out = $("#mini-result-value");
        if (!out || reduceMotion) return;
        const values = ["128", "42", "3.14", "2026", "7"];
        let n = 0;
        setInterval(function () { n = (n + 1) % values.length; out.textContent = values[n]; }, 2600);
    });

    /* ---------- Cursor personalizado ---------- */
    safe(function () {
        if (!finePointer) return;
        const dot = $("#cursor-dot");
        const ring = $("#cursor-ring");
        const label = $("#cursor-label");
        const glow = $("#cursor-glow");
        if (!dot || !ring) return;

        let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
        let rx = tx, ry = ty, gx = tx, gy = ty, shown = false, raf = 0;

        function show(on) {
            if (shown === on) return;
            shown = on;
            [dot, ring].forEach(function (el) { el.classList.toggle("is-on", on); });
            if (glow) glow.classList.toggle("is-on", on);
        }

        function frame() {
            rx += (tx - rx) * 0.2; ry += (ty - ry) * 0.2;
            gx += (tx - gx) * 0.07; gy += (ty - gy) * 0.07;
            dot.style.transform = "translate3d(" + tx + "px," + ty + "px,0)";
            ring.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0)";
            if (glow) glow.style.transform = "translate3d(" + gx.toFixed(1) + "px," + gy.toFixed(1) + "px,0)";
            raf = requestAnimationFrame(frame);
        }

        document.addEventListener("pointermove", function (e) {
            if (e.pointerType === "touch") return;
            tx = e.clientX; ty = e.clientY;
            if (!shown) { rx = gx = tx; ry = gy = ty; }
            show(true);
            if (!raf) raf = requestAnimationFrame(frame);
        }, { passive: true });
        document.addEventListener("pointerleave", function () { show(false); });
        document.documentElement.addEventListener("mouseleave", function () { show(false); });
        document.addEventListener("pointerdown", function () { ring.classList.add("is-down"); });
        document.addEventListener("pointerup", function () { ring.classList.remove("is-down"); });
        window.addEventListener("blur", function () { show(false); });

        // Estados conforme o elemento sob o cursor.
        const interactive = 'a, button, [role="button"], summary, select, label, .copy-btn';
        document.addEventListener("pointerover", function (e) {
            const t = e.target;
            if (!(t instanceof Element)) return;
            const isText = !!t.closest('input:not([type="hidden"]), textarea');
            const isLink = !isText && !!t.closest(interactive);
            const labeled = !isText && !isLink ? t.closest("[data-cursor-label]") : null;
            ring.classList.toggle("is-text", isText);
            ring.classList.toggle("is-link", isLink);
            ring.classList.toggle("is-label", !!labeled);
            if (labeled && label) label.textContent = labeled.getAttribute("data-cursor-label");
        });
    });

    /* ---------- Copiar e-mail ---------- */
    safe(function () {
        const btn = $("#copy-email");
        const toast = $("#toast");
        if (!btn) return;
        let timer;

        function notify(msg) {
            if (!toast) return;
            toast.textContent = msg;
            toast.classList.add("is-on");
            clearTimeout(timer);
            timer = setTimeout(function () { toast.classList.remove("is-on"); }, 2200);
        }

        function fallbackCopy(text) {
            const ta = document.createElement("textarea");
            ta.value = text; ta.setAttribute("readonly", "");
            ta.style.cssText = "position:fixed;top:-100px;opacity:0";
            document.body.appendChild(ta); ta.select();
            let ok = false;
            try { ok = document.execCommand("copy"); } catch (e) {}
            ta.remove();
            return ok;
        }

        btn.addEventListener("click", function () {
            const text = btn.getAttribute("data-email");
            const done = function (ok) {
                if (ok) {
                    btn.textContent = "Copiado ✓"; btn.classList.add("is-copied");
                    notify("E-mail copiado para a área de transferência");
                    setTimeout(function () { btn.textContent = "Copiar"; btn.classList.remove("is-copied"); }, 2200);
                } else notify("Não foi possível copiar. Selecione o e-mail manualmente.");
            };
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
            } else done(fallbackCopy(text));
        });
    });

    /* ---------- Formulário: validação, envio e feedback sem sair da página ---------- */
    safe(function () {
        const form = $("#contact-form");
        const status = $("#form-status");
        const sendButton = $("#send-button");
        const submitText = $(".submit-text", sendButton);
        const nameInput = $("#name");
        const emailInput = $("#email");
        const messageInput = $("#message");
        const fields = [nameInput, emailInput, messageInput];

        let sending = false;
        const COOLDOWN_MS = 60000; // 1 minuto entre envios na mesma aba.
        const COOLDOWN_KEY = "jc-portfolio-contact-last-sent";
        let lastSent = 0;
        try { lastSent = Number(sessionStorage.getItem(COOLDOWN_KEY)) || 0; } catch (error) { /* segue sem armazenamento */ }

        function showStatus(message, type) {
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
        fields.forEach(function (input) { input.addEventListener("input", function () { clearError(input); }); });

        function validateForm() {
            let valid = true;
            fields.forEach(clearError);
            if (nameInput.value.trim().length < 2) { showError(nameInput, "Informe seu nome (pelo menos 2 caracteres)."); valid = false; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) { showError(emailInput, "Informe um endereço de e-mail válido."); valid = false; }
            if (messageInput.value.trim().length < 10) { showError(messageInput, "Escreva uma mensagem com pelo menos 10 caracteres."); valid = false; }
            return valid;
        }

        function setSending(value) {
            sending = value;
            sendButton.disabled = value;
            sendButton.classList.toggle("is-sending", value);
            submitText.textContent = value ? "Enviando..." : "Enviar mensagem";
        }

        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            if (sending) return;

            if (!validateForm()) {
                showStatus("Confira os campos destacados acima.", "error");
                const firstInvalid = form.querySelector('[aria-invalid="true"]');
                if (firstInvalid) firstInvalid.focus();
                return;
            }
            // O FormSubmit precisa que o site seja aberto via HTTP/HTTPS, não file://.
            if (window.location.protocol === "file:") {
                showStatus("Para enviar uma mensagem, abra o portfólio publicado (GitHub Pages) ou por um servidor local. O formulário não funciona abrindo o HTML direto do computador.", "error");
                return;
            }
            const remaining = COOLDOWN_MS - (Date.now() - lastSent);
            if (remaining > 0) {
                showStatus("Mensagem já enviada. Aguarde " + Math.ceil(remaining / 1000) + " s antes de tentar novamente.", "error");
                return;
            }
            // Campo invisível que detecta preenchimento automático de bots simples.
            if (form.elements.namedItem("_honey").value) {
                showStatus("Não foi possível enviar a mensagem.", "error");
                return;
            }

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
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                const accepted = response.ok && (data.success === true || data.success === "true");
                if (!accepted) throw new Error("Submission not accepted");

                form.reset(); // Limpa os dados SOMENTE após resposta positiva.
                fields.forEach(clearError);
                lastSent = Date.now();
                try { sessionStorage.setItem(COOLDOWN_KEY, String(lastSent)); } catch (error) { /* ignora */ }
                showStatus("Mensagem recebida pelo serviço de envio! Obrigado pelo contato.", "success");
            } catch (error) {
                showStatus("Não foi possível concluir o envio. Confira a conexão e tente novamente. Se o problema continuar, use o e-mail direto ao lado.", "error");
            } finally {
                setSending(false);
            }
        });
    });
})();
