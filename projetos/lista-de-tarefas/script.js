var botao = document.getElementById("addTaskBtn");
var campo = document.getElementById("taskInput");
var lista = document.getElementById("taskList");
 
botao.addEventListener("click", function() {
    var tarefa = campo.value.trim();
 
    if (tarefa == "") {
        return;
    }
 
    var item = document.createElement("li");
    var texto = document.createElement("span");
    var apagar = document.createElement("button");
 
    texto.textContent = tarefa;
    apagar.textContent = "X";
    apagar.setAttribute("aria-label", "Remover tarefa: " + tarefa);
    apagar.type = "button";
    apagar.addEventListener("click", function() {
        item.remove();
    });
 
    item.appendChild(texto);
    item.appendChild(apagar);
    lista.appendChild(item);
 
    campo.value = "";
});

// Permite adicionar a tarefa apertando Enter no campo de texto.
campo.addEventListener("keydown", function(evento) {
    if (evento.key === "Enter") {
        evento.preventDefault();
        botao.click();
    }
});
