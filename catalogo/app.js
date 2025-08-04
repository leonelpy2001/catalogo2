let inputNomeProduto = document.querySelector("#nome-produto")
let inputPreco = document.querySelector("#preco-produto")

// integaracao ao banco de dados

let db
let insert = indexedDB.open("novo banco", 1)


insert.onupgradeneeded = function (event) {
    db = event.target.result;

    // Criar uma loja de objetos chamada "clientes" com chave primária "id"
    const store = db.createObjectStore("compras", {
        keyPath: "id",
        autoIncrement: true
    });
    const store2 = db.createObjectStore("linpesa", {
        keyPath: "id",
        autoIncrement: true
    });


    // Criar índice para busca por nome e email (opcional)

};


insert.onsuccess = function (event) {
    db = event.target.result;

    // Ligar o evento de submit do formulário
    document.querySelector("form").addEventListener("submit", adicionarCliente);

    // Listar clientes já cadastrados
    listarClientes();
};

insert.onerror = function () {
    alert("Erro ao abrir o banco de dados.");
};

function adicionarCliente(e) {
    e.preventDefault();

    let valor = inputNomeProduto.value.trim();
    let valorPreco = inputPreco.value.trim()

    if (valor === "" || valorPreco === "") {
        alert("Preencha todos os campos.");
        return;
    }
    let novoCadastro = { valor, valorPreco }

    const transaction = db.transaction(["compras"], "readwrite");
    const store = transaction.objectStore("compras");

    const insert = store.add(novoCadastro);


    insert.onsuccess = () => {

        document.querySelector("form").reset();
        listarClientes(); // Atualiza a lista após cadastrar
    };

    insert.onerror = () => {
        alert("Erro: Email duplicado ou outro problema ao salvar.");
    };
}



function listarClientes() {
    const lista = document.querySelector(".content");
    const spanContador = document.querySelector(".span-contador");
    lista.innerHTML = ""; // Limpa conteúdo anterior

    const transaction = db.transaction(["compras"], "readonly");
    const store = transaction.objectStore("compras");

    let count = 0;

    store.openCursor().onsuccess = function (event) {
        const cursor = event.target.result;

        if (cursor) {
            const item = cursor.value;

            // Criar elementos dinamicamente
            const article = document.createElement("article");

            const pNome = document.createElement("p");
            pNome.className = "spannome";
            pNome.textContent = item.valor;

            const divPrecoX = document.createElement("div");
            divPrecoX.className = "div-preco-x";

            const divPrecoKz = document.createElement("div");
            divPrecoKz.className = "div-preco-kz";
            divPrecoKz.innerHTML = `<span class="spanpreco">${item.valorPreco}</span>kz`;

            const btnEliminar = document.createElement("button");
            btnEliminar.className = "Eliminar";
            btnEliminar.textContent = "Eliminar";
            btnEliminar.onclick = () => deletarItem(cursor.key);

            const idParaDeletar = cursor.key;
            btnEliminar.onclick = () => deletarItem(idParaDeletar);


            divPrecoX.appendChild(divPrecoKz);
            divPrecoX.appendChild(btnEliminar);
            article.appendChild(pNome);
            article.appendChild(divPrecoX);
            lista.appendChild(article);

            count++;
            cursor.continue();
        } else {
            spanContador.textContent = count;
        }
    };
}

function deletarItem(id) {
    const transaction = db.transaction(["compras"], "readwrite");
    const store = transaction.objectStore("compras");

    const request = store.delete(id);

    request.onsuccess = () => {
        listarClientes(); // Atualiza após deletar
    };

    request.onerror = () => {
        alert("Erro ao deletar o item.");
    };
}

