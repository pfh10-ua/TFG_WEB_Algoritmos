function queryAncestorSelector(node,selector) {
    var parent = node.parentNode;
    var all = document.querySelectorAll(selector);
    var found = false;
    while (parent !== document && !found) {
      for (var i = 0; i < all.length && !found; i++) {
        found= (all[i] === parent)?true:false;
      }
      parent = (!found)?parent.parentNode:parent;
    }
    return (found)?parent:null;
}

function insertAsLastChild(padre,nuevoHijo){
    padre.append(nuevoHijo);
}

function insertAsFirstChild(padre,nuevoHijo){
    padre.prepend(nuevoHijo);
}

function insertBeforeChild(padre,hijo,nuevoHijo){
    padre.insertBefore(nuevoHijo,hijo);
}

function removeElement(nodo){
    nodo.remove();
}

function renderCódigo(data) {
    let nameAlgoritmo = data.nameAlgoritmo;
    let bloquecódigo = document.createElement("section");
    bloquecódigo.innerHTML = "<code-git data-algoritmo='"+nameAlgoritmo+"'></code-git>";
        
    insertAsLastChild(document.querySelector("main"), bloquecódigo);
    return bloquecódigo;
}

async function init(){
    renderCódigo({nameAlgoritmo: "bubblesort"});
}


document.addEventListener("DOMContentLoaded", init, false);