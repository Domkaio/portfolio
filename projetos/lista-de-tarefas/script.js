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
    apagar.type = "button";
    apagar.addEventListener("click", function() {
        item.remove();
    });
 
    item.appendChild(texto);
    item.appendChild(apagar);
    lista.appendChild(item);
 
    campo.value = "";
});