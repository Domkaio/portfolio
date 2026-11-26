let expression = "";
const display = document.getElementById("display");

function pressed(valor) {
    expression += valor;
    display.textContent = expression;
}

function clearAll() {
    expression = "";
    display.textContent = "";
}

function backspace() {
    expression = expression.slice(0, -1);
    display.textContent = expression;
}

function calculate() {
    try {
        if (expression.trim() === "") {
            throw new Error("Expressão vazia");
        }

        const result = eval(expression);

        if (typeof result !== "number" || !Number.isFinite(result)) {
            throw new Error("Resultado inválido");
        }

        expression = String(result);
        display.textContent = expression;
        
    } catch (error) {
        display.textContent = "Erro";
        expression = "";
    }
}

const buttons = Array.from(document.querySelectorAll(".btn"));
const normalGradient = "linear-gradient(gray, black)";
const activeGradient = "linear-gradient(#d69cef, #7b1fa2)";

const pointerHeld = new Set();
const keyboardHeld = new Map();

function findButton(label) {
    return buttons.find(button => button.textContent.trim() === label);
}

function updateButtonAppearance(button) {
    if (!button) return;

    const isPressed = pointerHeld.has(button) ||
        Array.from(keyboardHeld.values()).includes(button);

    button.style.backgroundImage = isPressed ? activeGradient : normalGradient;
}

buttons.forEach(button => {
    button.addEventListener("pointerdown", () => {
        pointerHeld.add(button);
        updateButtonAppearance(button);
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach(eventName => {
        button.addEventListener(eventName, () => {
            pointerHeld.delete(button);
            updateButtonAppearance(button);
        });
    });
});

document.addEventListener("keydown", event => {
    const key = event.key;
    let label = null;

    if (/^[0-9.+\-*/]$/.test(key)) {
        label = key;
    } else if (key === "Backspace") {
        label = "<";
    } else if (key === "Enter") {
        label = "=";
    } else if (key === "Escape") {
        label = "C";
    } else {
        return;
    }

    event.preventDefault();

    const button = findButton(label);
    if (!keyboardHeld.has(event.code)) {
        keyboardHeld.set(event.code, button);
        updateButtonAppearance(button);
    }

    if (key === "Backspace") {
        backspace();
    } else if (key === "Enter") {
        calculate();
    } else if (key === "Escape") {
        clearAll();
    } else {
        pressed(key);
    }
});

document.addEventListener("keyup", event => {
    if (!keyboardHeld.has(event.code)) return;

    const button = keyboardHeld.get(event.code);
    keyboardHeld.delete(event.code);
    updateButtonAppearance(button);
});

window.addEventListener("blur", () => {
    const highlighted = new Set([...pointerHeld, ...keyboardHeld.values()]);
    pointerHeld.clear();
    keyboardHeld.clear();
    highlighted.forEach(updateButtonAppearance);
});
