// valores iniciais para anuncio
var db_anuncios= {
    "data": [
        {
            "id": 1,
            "titulo": "titulo anuncio",
            "descricao": "breve descricao do anuncio",
            "tipo": "apartamento",
            "valor": 500,
            "universidadeProxima": "PUC Minas - Praca da Liberdade",
            "distanciaUniversidade": 7            
        },
        {
            "id": 2,
            "titulo": "titulo anuncio2",
            "descricao": "breve descricao do anuncio2",
            "tipo": "casa",
            "valor": 700,
            "universidadeProxima": "PUC Minas - Praca da Liberdade",
            "distanciaUniversidade": 7
        },
    ]
}

// carrega os dados iniciais
var db = JSON.parse(localStorage.getItem('db_anuncio'));
if (!db) {
    db = db_anuncios
};

// Exibe mensagem em um elemento de ID msg
function displayMessage(msg) {
    // $('#msg').html('<div class="alert alert-warning">' + msg + '</div>');
    Swal.fire(
        'Alerta',
        msg,
        'success'
      )
}

function insertAnuncio(anuncio) {
    // novo id
    let novoId = 1;
    if (db.data.length != 0)
        novoId = db.data[db.data.length - 1].id + 1;
    let novoAnuncio = {
        "id": novoId,
        "titulo": anuncio.titulo,
        "descricao": anuncio.descricao,
        "tipo": anuncio.tipo,
        "valor": anuncio.valor,
        "universidadeProxima": anuncio.universidadeProxima,
        "distanciaUniversidade": anuncio.distanciaUniversidade
    };

    // Insere o novo objeto no array
    db.data.push(novoAnuncio);
    displayMessage("Anuncio Cadastrado");

    // Atualiza os dados no Local Storage
    localStorage.setItem('db_anuncio', JSON.stringify(db));
}

function updateAnuncio(id, anuncio) {
    // Localiza o indice do objeto a ser alterado no array a partir do seu ID
    let index = db.data.map(obj => obj.id).indexOf(id);

    // Altera os dados do objeto no array
    db.data[index].titulo = anuncio.titulo,
        db.data[index].descricao = anuncio.descricao,
        db.data[index].tipo = anuncio.tipo,
        db.data[index].valor = anuncio.valor,
        db.data[index].universidadeProxima = anuncio.universidadeProxima,
        db.data[index].distanciaUniversidade = anuncio.distanciaUniversidade

    displayMessage("Anuncio alterado");

    // Atualiza os dados no Local Storage
    localStorage.setItem('db_anuncio', JSON.stringify(db));
}

function deletaAnuncio(id) {
    // Filtra o array removendo o elemento com o id passado
    db.data = db.data.filter(function (element) { return element.id != id });

    displayMessage("Anuncio Apagado");

    // Atualiza os dados no Local Storage
    localStorage.setItem('db_anuncio', JSON.stringify(db));
}
