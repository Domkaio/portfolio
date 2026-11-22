const lamp = document.getElementById('lamp');
let ligada = false;

function alternarLampada() {
    ligada = !ligada;
    lamp.src = ligada ? 'assets/lamp_on.png' : 'assets/lamp_off.png';
    lamp.alt = ligada ? 'Lâmpada acesa' : 'Lâmpada apagada';
    lamp.setAttribute('aria-label', ligada ? 'Apagar a lâmpada' : 'Acender a lâmpada');
    lamp.setAttribute('aria-pressed', String(ligada));
    document.body.style.background = ligada
        ? 'radial-gradient(circle, white 8%, yellow 100%)'
        : 'radial-gradient(circle, white 8%, black 100%)';
}

lamp.addEventListener('click', alternarLampada);
lamp.addEventListener('keydown', function (evento) {
    if (evento.key === 'Enter' || evento.key === ' ') {
        evento.preventDefault();
        alternarLampada();
    }
});
