// função para listar anuncios
function ListaAnuncios() {

    // limpa a lista de contatos apresentados
    $("#table-anuncios").empty();

    // Popula a tabela com os registros do banco de dados
    for (let index = 0; index < db.data.length; index++) {
        const anuncio = db.data[index];

        let $tr = $("<tr></tr>")
        $tr.append(`<td>${anuncio.id}</td>`);
        $tr.append(`<td>${anuncio.titulo}</td>`);
        $tr.append(`<td>${anuncio.descricao}</td>`);
        $tr.append(`<td>${anuncio.tipo}</td>`);
        $tr.append(`<td>${anuncio.valor}</td>`);
        $tr.append(`<td>${anuncio.contato}</td>`);
        $tr.append(`<td>${anuncio.universidadeProxima}</td>`);
        $tr.append(`<td>${anuncio.distanciaUniversidade}</td>`);
        $tr.append(`<td>
            Quarto Mobiliado: ${anuncio.comodidades.quartoMobiliado}<br>
            Área Privativa: ${anuncio.comodidades.areaPrivativa}<br>
            Garagem: ${anuncio.comodidades.garagem}<br>
            Contas Básicas: ${anuncio.comodidades.contasBasicas}<br>
            Limpeza: ${anuncio.comodidades.limpeza}<br>
            Wi-Fi: ${anuncio.comodidades.wifi}<br>
        </td>`);
        $tr.append(`<td>
            Permite Visitas: ${anuncio.detalhes.permiteVisitas}<br>
            Aceita Fumantes: ${anuncio.detalhes.aceitaFumantes}<br>
            Aceita Pets: ${anuncio.detalhes.aceitaPet}<br>
            Aceita Bebida Alcóolica: ${anuncio.detalhes.aceitaBebidaAlcoolica}<br>
            LGBTQ: ${anuncio.detalhes.lgbtq}<br>
            Apenas Homens: ${anuncio.detalhes.apenasHomens}<br>
            Apenas Mulheres: ${anuncio.detalhes.apenasMulheres}<br>
            Transporte Próximo: ${anuncio.detalhes.transporteProximo}<br>
            Comércio Próximo: ${anuncio.detalhes.comercioProximo}<br>
        </td>`);
        $tr.append(`<td>
            Banheiros: ${anuncio.quantidades.banheiros}<br>
            Quartos: ${anuncio.quantidades.quartos}<br>
            Salas: ${anuncio.quantidades.salas}<br>
            Hóspedes: ${anuncio.quantidades.hospedes}<br>
        </td>`);


        $("#table-anuncios").append($tr);

    }
}

async function montarArrayDeFotosBase64() {
    // https://developer.mozilla.org/pt-BR/docs/Web/API/File/Using_files_from_web_applications
    const fotos = $("#input-foto-anuncio").prop("files");
    console.debug("input-foto-anuncio fotos", fotos)
    let fotosBase64 = []
    for (const foto of fotos) {
        let fotoBase64 = await blobToBase64(await resizeImage(foto));
        fotosBase64.push(fotoBase64)
    }
    console.debug({ fotosBase64 })
    return fotosBase64
}

// montarObjetoAnuncio lê o formulario e retorna
// um objeto anuncio
async function montarObjetoAnuncio() {
    // Obtem os valores dos campos do formulário
    let anuncio = {
        titulo: $("#inputTitulo").val(),
        descricao: $("#inputDescricao").val(),
        fotos: await montarArrayDeFotosBase64(),
        tipo: $('#inputTipo').val(),
        universidadeProxima: $('#inputUniversidade').val(),
        distanciaUniversidade: $('#inputDistancia').val(),
        comodidades: {
            quartoMobiliado: $("#check-quarto-mobiliado").prop("checked"),
            areaPrivativa: $("#check-area-privativa").prop("checked"),
            garagem: $("#check-garagem").prop("checked"),
            contasBasicas: $("#check-contas-basicas").prop("checked"),
            limpeza: $("#check-limpeza").prop("checked"),
            wifi: $("#check-wifi").prop("checked")
        },
        detalhes: {
            permiteVisitas: $("#check-permite-visitas").prop("checked"),
            aceitaFumantes: $("#check-aceita-fumantes").prop("checked"),
            aceitaPet: $("#check-aceita-pet").prop("checked"),
            aceitaBebidaAlcoolica: $("#check-bebida-alcoolica").prop("checked"),
            lgbtq: $("#check-lgbtq").prop("checked"),
            apenasHomens: $("#check-apenas-homens").prop("checked"),
            apenasMulheres: $("#check-apenas-mulheres").prop("checked"),
            transporteProximo: $("#check-transporte-proximo").prop("checked"),
            comercioProximo: $("#check-comercio-proximo").prop("checked")
        },
        quantidades: {
            banheiros: $('#inputBanheiros').val(),
            quartos: $('#inputQuartos').val(),
            salas: $('#inputSalas').val(),
            hospedes: $('#inputHospedes').val(),
        },
        contato: $('#inputContato').val(),
        valor: $("#inputValor").val(),
    };
    return anuncio;
}

function init() {
    // Adiciona funções para tratar os eventos 
    $("#btnInsert").click(async function () {
        // Verfica se o formulário está preenchido corretamente
        if (!$('#form-anuncio')[0].checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }

        // Obtem os valores dos campos do formulário
        let anuncio = await montarObjetoAnuncio();
        insertAnuncio(anuncio);

        // Limpa o formulario
        $("#form-anuncio")[0].reset();
    });

    // Intercepta o click do botão Alterar
    $("#btnUpdate").click(async function () {
        // Obtem os valores dos campos do formulário
        let campoId = $("#inputId").val();
        if (campoId == "") {
            displayMessage("Selecione um anuncio para ser alterado.");
            return;
        }
        let anuncio = await montarObjetoAnuncio();
        updateAnuncio(parseInt(campoId), anuncio);

        // mostra anuncios
        ListaAnuncios();

        // Limpa o formulario
        $("#form-anuncio")[0].reset();
    });

    // Intercepta o click do botão Listar Contatos
    $("#btnClear").click(function () {
        $("#form-anuncio")[0].reset();
    });

    // Oculta a mensagem de aviso após alguns segundos
    $('#msg').bind("DOMSubtreeModified", function () {
        window.setTimeout(function () {
            $(".alert").fadeTo(500, 0).slideUp(500, function () {
                $(this).remove();
            });
        }, 5000);
    });

    // Preenche formulario ao clicar
    $("#grid-anuncios").on("click", "tr", function (e) {
        let linhaAnuncio = this;
        colunas = linhaAnuncio.querySelectorAll("td");

        $("#inputId").val(colunas[0].innerText);
        $("#inputTitulo").val(colunas[1].innerText);
        $("#inputDescricao").val(colunas[2].innerText);
        $("#inputTipo").val(colunas[3].innerText);
        $("#inputValor").val(colunas[4].innerText);
        $("#inputContato").val(colunas[5].innerText);
        $("#inputUniversidade").val(colunas[6].innerText);
        $("#inputDistancia").val(colunas[7].innerText);
    });

    $("#input-foto-anuncio").change(async (e) => {
        // https://developer.mozilla.org/pt-BR/docs/Web/API/File/Using_files_from_web_applications
        const fotosBase64 = await montarArrayDeFotosBase64();
        console.debug("input-foto-anuncio change:", e, "fotos", fotosBase64)
        $("#container-fotos-anuncio").empty()
        for (const fotoBase64 of fotosBase64) {
            $("#container-fotos-anuncio").append(`
                <img src="${fotoBase64}" class="img-thumbnail foto-anuncio" alt="foto anuncio ">
            `);
        }
    })

    // Reseta o input de arquivos ao iniciar a página
    $("#input-foto-anuncio").val('');

    // Referencia: https://github.com/RobinHerbots/Inputmask#via-jquery-plugin
    $("#inputContato").inputmask("(99) 99999-9999");  //static mask

    ListaAnuncios();
}