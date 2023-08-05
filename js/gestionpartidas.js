// Array para almacenar los objetos partida
var partidas = [];

// Array para almacenar los objetos inversión
var inversiones = [];

// Array de objetos con idPartida y total invertido
var inversionesPorPartidas = [];

var partidaInversion;


//Se recupera el select del formulario y se carga todos los tipos disponibles.
const tiposDisponibles = document.querySelector("#tipoPartida");
const selectMes = document.querySelector("#mes");
const selectAnio = document.querySelector("#anio");

// Datos para la busqueda
const datosBusqueda = {
    benefactor: '',
    tipoPartida: '',
    anio: ''
}

var select1 = document.querySelector(".form-group #idBenefactor");
var select2 = document.querySelector(".form-group #idTipopartida");
var select3 = document.querySelector(".form-group #anio");

$(document).ready(function() {

    $("#busqueda").click(function() {
        $("#contenedorBusqueda").slideToggle("slow")
    });

    // Agregar el evento change a los select
    select1.addEventListener("change", onSelectChange);
    select2.addEventListener("change", onSelectChange);
    select3.addEventListener("change", onSelectChange);

    // Llamada secuencial utilizando promesas
    cargarInversiones()
        .then((mensaje) => {
            console.log("Se cargarron las inversiones ahora se carga la tabla "); // Puedes mostrar un mensaje si lo deseas
            cargarTabla(); // Cargar la tabla después de que se hayan cargado las inversiones
        })
        .catch((error) => {
            console.error(error); // Manejo de errores si ocurre algún error en la carga de inversiones
        });


    // Cargar opciones en el form del modal nueva inversion.
    cargarBenefactores();
    cargarTiposPartidas();
    adicionarMeses();
    adicionarAnios();

    const btnEnviarForm = $("#nueva-partida-modal #enviarForm");
    const btnConformarEdicionInversion = $("#mi-segundo-modal #editarForm");

    // Obtener el botón de generación del PDF
    var btnGenerarPDF = document.getElementById('imprimirInversiones');
    // Agregar un controlador de eventos al botón
    btnGenerarPDF.addEventListener('click', function() {
        // Obtener el contenido del modal que deseas imprimir
        var contenidoModal = document.getElementById('inversiones').querySelector(".modal-content");

        // Clonar el contenido del modal en una nueva variable
        var nuevaImpresion = contenidoModal.cloneNode(true);

        // Ocultar los elementos con la clase "dropdown" en la nueva impresión
        var dropdowns = nuevaImpresion.querySelectorAll(".dropdown");
        dropdowns.forEach(function(dropdown) {
            dropdown.style.display = "none";
        });

        nuevaImpresion.querySelector(".modal-footer").remove();



        // Insertar la imagen al principio de la nueva impresión
        var imagenModal = nuevaImpresion.querySelector("#imagenModal");
        imagenModal.classList.remove("d-none");


        console.log(imagenModal);
        imagenModal.src = "http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/imagenes/Posteo_primaria.jpg"; // Ruta de la nueva imagen
        // Reducir el tamaño de la imagen en un 40% utilizando CSS
        imagenModal.style.transform = "scale(0.8)";

        nuevaImpresion.style.transform = "scale(0.8)";
        // Configurar las opciones para la generación del PDF
        var opciones = {
            filename: 'contenido_modal.pdf', // Nombre del archivo PDF resultante
            html2canvas: { scale: 2 }, // Opciones para html2canvas (escalado)
            jsPDF: { orientation: 'portrait' },
            unit: 'mm', // Unidad de medida del PDF
            format: 'a4', // Tamaño de página (carta)
            compress: true, // Comprimir el contenido del PDF para que quepa en una página
            putOnlyUsedFonts: true, // Incluir solo las fuentes utilizadas en el PDF
            margins: { top: 10, bottom: 10, left: 10, right: 10 }, // Márgenes del documento
            // Opciones para jsPDF (orientación)  portrait   landscape
            callback: function() {
                // Mostrar nuevamente los elementos "dropdown" después de generar el PDF
                dropdowns.forEach(function(dropdown) {
                    dropdown.style.display = "";
                });

                // Eliminar la imagen insertada después de generar el PDF
                imagenNueva.parentNode.removeChild(imagenNueva);
            }
        };

        // Generar el PDF a partir de la nueva impresión del contenido del modal
        html2pdf().set(opciones).from(nuevaImpresion).save();
    });

    // Obtener el botón de generación del PDF
    var btnGenerarPDFpartidas = document.getElementById('imprimirPartidas');
    btnGenerarPDFpartidas.addEventListener('click', function() {
        // Obtener el contenido del modal que deseas imprimir
        var contenedorTabla = document.getElementById('contenedorTabla');

        // Clonar el contenido del modal en una nueva variable
        var nuevaImpresion = contenedorTabla.cloneNode(true);

        // Ocultar los elementos con la clase "dropdown" en la nueva impresión
        var dropdowns = nuevaImpresion.querySelectorAll(".dropdown");
        dropdowns.forEach(function(dropdown) {
            dropdown.style.display = "none";
        });

        // Agregar el encabezado al principio de la nueva impresión
        var encabezado = document.createElement("div");
        encabezado.classList.add("container", "mt-4", "mb-4", "text-center");
        encabezado.innerHTML = `
            <h4 class="mb-1 font-weight-bold">Nva. Esc. Ceferino Namuncura. N° 1451 - Rosario</h4>
            <p class="mb-0 font-weight-bold">Informe de partidas recibidas</p>
            <p class="mb-0">Fecha: ${getCurrentDate()}</p>
        `;
        nuevaImpresion.insertBefore(encabezado, nuevaImpresion.firstChild);

        nuevaImpresion.style.transform = "scale(0.8)";
        // Configurar las opciones para la generación del PDF
        var opciones = {
            filename: 'contenido_modal.pdf', // Nombre del archivo PDF resultante
            html2canvas: { scale: 2 }, // Opciones para html2canvas (escalado)
            jsPDF: { orientation: 'landscape' },
            unit: 'mm', // Unidad de medida del PDF
            format: 'a4', // Tamaño de página (carta)
            compress: true, // Comprimir el contenido del PDF para que quepa en una página
            putOnlyUsedFonts: true, // Incluir solo las fuentes utilizadas en el PDF
            margins: { top: 20, bottom: 10, left: 10, right: 10 }, // Márgenes del documento
            // Opciones para jsPDF (orientación)  portrait   landscape
            callback: function() {
                // Mostrar nuevamente los elementos "dropdown" después de generar el PDF
                dropdowns.forEach(function(dropdown) {
                    dropdown.style.display = "";
                });

                // Eliminar el encabezado insertado después de generar el PDF
                encabezado.parentNode.removeChild(encabezado);
            }
        };

        // Generar el PDF a partir de la nueva impresión del contenido del modal
        html2pdf().set(opciones).from(nuevaImpresion).save();
    });


    btnConformarEdicionInversion.on("click", function(e) {

        e.preventDefault();
        editarInversion();
    });

    //Eventos botones 
    const btnCerrarVerInversiones = $("#inversiones #cerrarVerInversiones");
    btnCerrarVerInversiones.on('click', () => {
        $('#inversiones').modal('hide');

    });

    // Al boton de confirmar Partida del modal nueve partida se le asocia el evento on click para que se ejecute altaPartida
    const btnEnviarFormParida = $("#nueva-partida #enviarForm");
    btnEnviarFormParida.on("click", function(e) {

        e.preventDefault();
        altaPartida(e);

    });


    $(document).on('click', '#inversiones .editarInversion', function(e) {
        console.log(e.target.dataset);
        e.preventDefault();
        e.target.setAttribute('data-toggle', 'modal');
        e.target.setAttribute('data-target', 'mi-segundo-modal');
        e.target.setAttribute('data-target', 'inversiones');
        $('#mi-segundo-modal').modal('show');
        $('#inversiones').modal('hide');

        console.log(e.target.id);
        btnEnviarFormInversion.hide();
        btnConformarEdicionInversion.show();

        var idForm = document.querySelector("#nueva-inversion #idForm");
        idForm.value = "MODIFICACION";

        var idInversion = $("#nueva-inversion #idInversion");


        if (idInversion !== null) {

            idInversion.remove();
        }

        var inputIdInversion = document.createElement("INPUT");
        inputIdInversion.type = "HIDDEN";
        inputIdInversion.id = "idInversion";
        inputIdInversion.value = e.target.id;
        idForm.parentElement.appendChild(inputIdInversion);


        var tituloModal = document.querySelector("#mi-segundo-modal-titulo");
        tituloModal.textContent = tituloModal.textContent.replace("Agregar", "Editar");

        var provedor = $("#provedor");
        var numeroIdent = $("#numero-ident");
        var fechaInversion = $("#fecha-invesion");
        var montoInversion = $("#monto-inversion");
        var descripcion = $("#descripcion");

        inversiones.forEach((inversion) => {
            if (inversion.idInversion == e.target.id) {

                fechaInversion.val(inversion.fechaInversion);
                numeroIdent.val(inversion.identificadorComprobante);
                montoInversion.val(inversion.montoInversion);
                descripcion.val(inversion.obsInversion);
                provedor.val(inversion.provedor);
                console.log(inversion);
            }
        });
    });

    const btnInvertir = $('#inversiones .invertir2');
    btnInvertir.on("click", function(e) {

        e.preventDefault();
        e.target.setAttribute('data-toggle', 'modal');
        e.target.setAttribute('data-target', 'mi-segundo-modal');
        e.target.setAttribute('data-target', 'inversiones');
        $('#mi-segundo-modal').modal('show');
        $('#inversiones').modal('hide');

        $('#mi-segundo-modal #provedor').val("");
        $('#mi-segundo-modal #numero-ident').val("");
        $('#mi-segundo-modal #fecha-invesion').val("");
        $('#mi-segundo-modal #monto-inversion').val("");
        $('#mi-segundo-modal #descripcion').val("");

        console.log($(btnInvertir).data());
        console.log(e.target.dataset);

        btnEnviarFormInversion.show();
        btnConformarEdicionInversion.hide();

        e.target.setAttribute('data-toggle', 'modal');
        e.target.setAttribute('data-target', 'mi-segundo-modal');
        e.target.setAttribute('data-target', 'inversiones');
        $('#mi-segundo-modal').modal('hide');
        $('#inversiones').modal('show');

        var idInversion = $("#nueva-inversion #idInversion");

        if (idInversion !== null) {

            idInversion.remove();
        }


    });

    const btnEnviarFormInversion = $("#mi-segundo-modal #enviarForm");
    btnEnviarFormInversion.on("click", function(e) {

        e.preventDefault();
        altaInversion();

        setTimeout(() => {
            cargarInversiones();

        }, 1000);

    });

    const btnEditarForm = $("#nueva-partida-modal #editarForm");
    btnEditarForm.on("click", function(e) {
        e.preventDefault();
        editarPartida(e);
        var idPartida = $("#nueva-partida #id").val();

        console.log(idPartida);
        actualizarSaldos(idPartida)

    });

    const btnAgregaraPartida = $("#agregarPartida");
    btnAgregaraPartida.on('click', function(e) {

        e.preventDefault();
        e.target.setAttribute('data-toggle', 'modal');
        e.target.setAttribute('data-target', 'nueva-partida-modal');

        const tituloModal = $("#nueva-partida-modal #mi-segundo-modal-titulo");
        tituloModal.text('Agregar partida presupuestaria');
        const tituloForm = $("#nueva-partida-modal #titulo");
        tituloForm.text('Agregar partida presupuestaria');

        const input_IdPartida = document.getElementById("nueva-partida").querySelector("#id");
        if (input_IdPartida !== null) {
            input_IdPartida.remove();
        };

        const idForm = document.getElementById("nueva-partida").querySelector("#idForm");
        idForm.value = "ALTA";

        const selectMes = $("#nueva-partida #mes");
        const selectAnios = $("#nueva-partida #anio");
        const selectBenefactores = $("#nueva-partida #idBenefactor");
        const selectTipoPartida = $("#nueva-partida #idTipopartida");
        const numeroOrden = document.getElementById("nueva-partida").querySelector("#numero-orden");
        const fechaAcreditacion = document.getElementById("nueva-partida").querySelector("#fecha-acreditacion");
        const raciones = document.getElementById("nueva-partida").querySelector("#raciones");
        const montoPeriodo = document.getElementById("nueva-partida").querySelector("#monto-periodo");

        numeroOrden.value = "";
        fechaAcreditacion.value = "";
        raciones.value = "";
        montoPeriodo.value = "";

        $('#nueva-partida-modal').modal('show');

        btnEnviarForm.show();
        btnEditarForm.hide();

        selectMes.val(null);
        selectAnios.val(null);
        selectBenefactores.val(null);
        selectTipoPartida.val(null);


    });

    $(document).on('click', '#cerrar-mi-segundo-modal', function(e) {
        e.preventDefault();
        var formularioId = $(this).closest('form').attr('id'); // Obtener el ID del formulario padre del botón

        if (formularioId === 'nueva-inversion') {
            $('#mi-segundo-modal').modal('hide');

            console.log("aca");
            // Vaciar inputs

            $("#mi-segundo-modal #provedor").val("");
            $("#mi-segundo-modal #numero-ident").val("");
            $("#mi-segundo-modal #fecha-inversion").val("");
            $("#mi-segundo-modal #monto-inversion").val("");
            $("#mi-segundo-modal #descripcion").val("");
        } else if (formularioId === 'nueva-partida') {
            $('#nueva-partida-modal').modal('hide');
        }
    });

    //  Evento ver invseriones Partidas
    $(document).on('click', '.verInversiones', function(e) {

        e.preventDefault();
        e.target.setAttribute('data-toggle', 'modal');
        e.target.setAttribute('data-target', 'inversiones');
        $('#inversiones').modal('show');
        $('#totalInvertido').remove();
        $('#inversiones #totalPartida').empty();



        let fila = e.target.closest('tr');

        let orden;

        // Utilizando jQuery.each() para iterar sobre `partidas`.
        $.each(partidas, function(index, partida) {
            if (partida.id_partida == fila.firstElementChild.textContent) {
                orden = partida.numero_orden;
                // Si se encontró el elemento con el id correspondiente, podemos detener el bucle.
                return false;
            }
        });


        $('#inversiones #datosPartida').text(`ID PARTIDA: ${fila.firstElementChild.textContent} - Nro Orden: ${orden} - ${fila.firstElementChild.nextElementSibling.textContent} - ${fila.firstElementChild.nextElementSibling.nextElementSibling.textContent} - ${fila.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent} - ${fila.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent}`);

        // data-idpartida="175" data-idbenefactor="1" data-nombrebenefactor="PROVINCIA" data-idtipopartida="2" data-nombretipopartida="COMEDORES" escolares="" data-anio="2023" data-mes="AGOSTO"

        //.firstElementChild.nextElementSibling.textContent
        let idPartida = e.target.id;
        btnInvertir.attr('id', idPartida);

        let partidaEncontrada = partidas.find(function(partida) {
            return partida.id_partida === idPartida;
        });

        if (partidaEncontrada) {

            $(btnInvertir).data('idpartida', partidaEncontrada.idPartida);
            $(btnInvertir).data('idbenefactor', partidaEncontrada.idBenefactor);
            $(btnInvertir).data('nombrebenefactor', partidaEncontrada.nombreBenefactor);
            $(btnInvertir).data('idtipopartida', partidaEncontrada.id_tipo_partida);
            $(btnInvertir).data('nombretipopartida', partidaEncontrada.nombre_tipo_partida);
            $(btnInvertir).data('escolares', partidaEncontrada.nombre_tipo_partida.includes('ESCOLARES'));
            $(btnInvertir).data('anio', partidaEncontrada.anio);
            $(btnInvertir).data('mes', partidaEncontrada.mes);


        }

        cargaDatosInversion(btnInvertir)
        mostrarInverciones(idPartida);

        setTimeout(() => { actualizarSaldos(idPartida) }, 50);

    });

    //Cuando apretamos invertir muestra el modal con el fomulario de carga inversion y actulaiza el modal con los datos de la partida llamando a cargarDatoInversion
    $(document).on('click', '.invertir', function(e) {
        e.preventDefault();
        e.target.setAttribute('data-toggle', 'modal');
        e.target.setAttribute('data-target', 'mi-segundo-modal');
        $('#mi-segundo-modal').modal('show');

        $('#mi-segundo-modal #provedor').val("");
        $('#mi-segundo-modal #numero-ident').val("");
        $('#mi-segundo-modal #fecha-invesion').val("");
        $('#mi-segundo-modal #monto-inversion').val("");
        $('#mi-segundo-modal #descripcion').val("");

        partidaInversion = e.target;

        //  console.log(e.target);
        cargaDatosInversion(e.target);
        btnEnviarFormInversion.show();
        btnConformarEdicionInversion.hide();

        var idInversion = $("#nueva-inversion #idInversion");

        if (idInversion !== null) {

            idInversion.remove();
        }
    });

    //Cuando apretamos editar muestra el modal con el fomulario de carga inversion y actulaiza el modal con los datos de la partida llamando a cargarDatosPartida
    $(document).on('click', '.editar', function(e) {
        e.preventDefault();
        e.target.setAttribute('data-toggle', 'modal');
        e.target.setAttribute('data-target', 'nueva-partida-modal');
        $('#nueva-partida-modal').modal('show');

        btnEnviarForm.hide();
        btnEditarForm.show();

        let inputidForm = document.getElementById("nueva-partida").querySelector("#idForm");
        inputidForm.value = "MODIFICACION";
        const inputid = document.querySelector("#id");

        // Verificar si existe inputid y eliminarlo si es necesario
        if (inputid !== null) {
            inputid.remove();
        }

        var inputId = document.createElement("input");
        inputId.type = "hidden";
        inputId.name = "id";
        inputId.id = "id";
        inputId.value = parseInt(e.target.id);
        inputidForm.parentElement.appendChild(inputId);

        cargaDatosParida(e)

    });

    //Cuando apretamos eliminar pregunta si realimente desaamos eliminar la partida si confirmamos llama a eliminar partida
    $(document).on('click', '.eliminar', function(e) {
        e.preventDefault();
        let id = parseInt(e.currentTarget.id);

        Swal.fire({
            title: `¿Está seguro de eliminar la partida con ID ${id}?`,
            text: "No será capaz de deshacer esta acción.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {

                console.log(id);
                eliminarPartida(id);
            }
        });
    });

    //Cuando apretamos eliminar pregunta si realimente desaamos eliminar la inversion si confirmamos llama a eliminar partida
    $(document).on('click', '.eliminarInversion', function(e) {
        e.preventDefault();
        let id = parseInt(e.currentTarget.id);
        const obj = inversiones.find(inversion => inversion.idInversion == id);

        Swal.fire({
            title: `¿Está seguro de eliminar inversion con ID ${id}?`,
            text: "No será capaz de deshacer esta acción.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Elimina el registro de la base de datos 
                eliminarInversion(id);

                // Cierra el modal
                // $('#inversiones').modal('hide');



                // Carga las inversiones y la tabla nuevamente después de eliminar
                // Llamada secuencial utilizando promesas
                cargarInversiones()
                    .then((mensaje) => {
                        console.log("Se cargarron las inversiones ahora se carga la tabla "); // Puedes mostrar un mensaje si lo deseas

                        cargarTabla(); // Cargar la tabla después de que se hayan cargado las inversiones



                        mostrarInverciones(obj.idPartida);

                        actualizarSaldos(obj.idPartida);
                    })
                    .catch((error) => {
                        console.error(error); // Manejo de errores si ocurre algún error en la carga de inversiones
                    });
            }
        });
    });

});

// Función para obtener la fecha y hora actual en formato legible
function getCurrentDate() {
    var date = new Date();
    var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleString("es-ES", options);
}

function mostrarInverciones(idPartida) {

    let inversionesPartida = $('#inversiones tbody tr');

    //Se ocultan las inversiones que no pertenecen a la partida.
    inversionesPartida.each((indice, fila) => {
        $(fila).toggle(fila.firstChild.nextSibling.textContent == idPartida);

    });

}

function actualizarSaldos(idPartida) {

    //Recuperta el monto de la la parida 
    let montoPeriodo = obtenerMontoPeriodo(idPartida);
    let sumaInversion = 0;

    //Seleccionamos todos los elementos con la clase ".montoInversion"
    inversiones.forEach((inversion) => {
        if (inversion.idPartida == idPartida) {
            sumaInversion = sumaInversion + parseFloat(inversion.montoInversion);
        }
    });

    let porcentajeInvertido = parseFloat(sumaInversion) * 100 / parseFloat(montoPeriodo);
    let invertido = document.querySelectorAll(".invertido");
    let totalPartida = document.querySelectorAll(".montoPartida");
    invertido.forEach((inversion) => { inversion.textContent = sumaInversion });
    totalPartida.forEach((total) => { total.textContent = montoPeriodo });

    if (sumaInversion === 0) {
        new Swal(`La partida id ${idPartida}`, "No tiene inversiones realizadas!")

    };

    if ((montoPeriodo - sumaInversion) === 0) {

        new Swal({
            title: `La partida id ${idPartida}`,
            text: "fue invertida en su totalidad!",
            imageUrl: "images/thumbs-up.jpg"
        });
    }

    let saldos = document.querySelectorAll(".saldo");
    saldos.forEach((saldo) => {
        saldo.textContent = parseFloat(montoPeriodo) - parseFloat(sumaInversion);

        if (porcentajeInvertido < 60) {
            saldo.classList.remove("bg-info");
            saldo.classList.remove("bg-primary");
            saldo.classList.remove("bg-warning");
            saldo.classList.remove("bg-danger");
            saldo.classList.add("bg-primary");
        }

        if (porcentajeInvertido >= 60) {
            saldo.classList.remove("bg-info");
            saldo.classList.remove("bg-primary");
            saldo.classList.remove("bg-warning");
            saldo.classList.remove("bg-danger");
            saldo.classList.add("bg-warning");
        }

        if (porcentajeInvertido >= 90) {
            saldo.classList.remove("bg-info");
            saldo.classList.remove("bg-primary");
            saldo.classList.remove("bg-warning");
            saldo.classList.remove("bg-danger");
            saldo.classList.add("bg-danger");
        }
    });

}

function obtenerMontoPeriodo(idPartida) {

    var partida = partidas.find(function(partida) {
        return partida.id_partida == idPartida;
    });
    return parseFloat(partida.monto_periodo);
}

function ejecutarAltaInversion() {
    $(document).ready(function() {

        var idForm = $("#mi-segundo-modal #idForm").val();
        var idPartida = $("#mi-segundo-modal #id").val();
        var fechaInversion = $("#mi-segundo-modal #fecha-invesion");
        var montoInversion = $("#mi-segundo-modal #monto-inversion").val();
        var provedor = $("#mi-segundo-modal #provedor").val();
        var obsInversion = $("#mi-segundo-modal #descripcion").val();
        var identificadorComprobante = $("#mi-segundo-modal #numero-ident").val();

        //actualizarTablapartidas(montoInversion);
        // Se envían los datos mediante AJAX
        $.ajax({
            url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/inversiones.php',
            type: 'post',
            dataType: 'json',
            data: {
                idForm: idForm,
                idPartida: parseInt(idPartida),
                fechaInversion: fechaInversion.val(),
                montoInversion: parseFloat(montoInversion),
                provedor: provedor,
                obsInversion: obsInversion,
                identificadorComprobante: identificadorComprobante
            },
            success: function(response) {

                $('#mi-segundo-modal').modal('hide');
                mostrarAlerta(response);

                document.querySelector("#mi-segundo-modal #fecha-invesion").value = "";
                document.querySelector("#mi-segundo-modal #monto-inversion").value = "";
                document.querySelector("#mi-segundo-modal #provedor").value = "";
                document.querySelector("#mi-segundo-modal #descripcion").value = "";
                document.querySelector("#mi-segundo-modal #numero-ident").value = "";

                cargarInversiones()
                    .then((mensaje) => {
                        console.log("Se cargarron las inversiones ahora se carga la tabla "); // Puedes mostrar un mensaje si lo deseas
                        cargarTabla(); // Cargar la tabla después de que se hayan cargado las inversiones
                    })
                    .catch((error) => {
                        console.error(error); // Manejo de errores si ocurre algún error en la carga de inversiones
                    });

            },
            error: function(xhr, status, error) {
                console.error(error, status, xhr);
                // Manejo del error en caso de que ocurra
            }
        });
    });
}

function altaPartida() {

    $(document).ready(function() {
        var numeroOrden = $("#numero-orden").val();
        var fechaAcreditacion = $("#fecha-acreditacion").val();
        var raciones = $("#raciones").val();
        var mes = $("#nueva-partida #mes option:selected").val();
        var anio = $("#nueva-partida #anio option:selected").val();
        var idTipopartida = $("#nueva-partida #idTipopartida option:selected").val();
        var idBenefactor = $("#nueva-partida #idBenefactor option:selected").val();
        var montoPeriodo = $("#monto-periodo").val();

        // Se envían los datos mediante AJAX
        $.ajax({
            url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/partidas.php',
            type: 'post',
            dataType: 'json',
            data: {
                idForm: 'ALTA',
                numeroOrden: numeroOrden,
                fechaAcreditacion: fechaAcreditacion,
                idTipopartida: idTipopartida,
                idBenefactor: idBenefactor,
                raciones: raciones,
                mes: mes,
                anio: anio,
                montoPeriodo: montoPeriodo
            },
            success: function(response) {

                let filas = document.querySelectorAll("tbody TD"); // const tipoMensaje = "Edicion";
                filas.forEach((fila) => {
                    if (fila.firstChild !== fila) {
                        fila.remove();
                    }

                });

                // Se cierra el modal
                $('#nueva-partida-modal').modal('hide');

                //Consulta las partitas presupuestarias mediate ajax las renderiza mediante scripting
                cargarTabla();

                //cargarInversiones();
                mostrarAlerta(response);

                // Se reinician los valores de los campos de entrada
                document.getElementById("numero-orden").value = "";
                document.getElementById("fecha-acreditacion").value = "";
                document.getElementById("idTipopartida").value = "";
                document.getElementById("idBenefactor").value = "";
                document.getElementById("raciones").value = "";
                document.getElementById("mes").value = "";
                document.getElementById("anio").value = "";
                document.getElementById("monto-periodo").value = "";
            },

            error: function(xhr, status, error) {
                console.error(error, status, xhr);
                // Manejo del error en caso de que ocurra
            }
        });
    });
}

function altaInversion() {
    ejecutarAltaInversion();
}

function editarInversion() {
    $(document).ready(function() {
        var idInversion = $("#nueva-inversion #idInversion").val();
        var identificadorComprobante = $("#nueva-inversion #numero-ident").val();
        var idPartida = $('#id').val();
        var fechaInversion = $('#fecha-invesion').val();
        var montoInversion = $('#monto-inversion').val();
        var provedor = $('#provedor').val();
        var obsInversion = $('#descripcion').val();

        // actualizarTablapartidas(montoInversion);
        console.log(idInversion + identificadorComprobante + idPartida + fechaInversion + montoInversion + provedor + obsInversion);
        inversiones.forEach((inversion) => {
            if (inversion.idInversion == idInversion) {

                inversion.fechaInversion = fechaInversion;
                inversion.identificadorComprobante = identificadorComprobante;
                inversion.montoInversion = montoInversion;
                inversion.obsInversion = obsInversion;
                inversion.provedor = provedor;

            }
        })

        // Enviar los datos mediante AJAX
        $.ajax({
            url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/inversiones.php',
            type: 'POST',
            dataType: 'json',
            data: {
                idForm: 'MODIFICACION',
                idInversion: parseInt(idInversion),
                idPartida: parseInt(idPartida),
                fechaInversion: fechaInversion,
                montoInversion: parseFloat(montoInversion),
                provedor: provedor,
                obsInversion: obsInversion,
                identificadorComprobante: identificadorComprobante,
            },
            success: function(response) {

                // Cerrar el modal
                $('#mi-segundo-modal').modal('hide');
                $('#inversiones #totalPartida').empty();

                // Mostrar mensaje de éxito o realizar cualquier otra acción necesaria
                new Swal(`La invervision id ${idInversion}`, "fue editada correctamente!");

                cargarInversiones()
                    .then((mensaje) => {
                        console.log("Se cargarron las inversiones ahora se carga la tabla "); // Puedes mostrar un mensaje si lo deseas
                        cargarTabla(); // Cargar la tabla después de que se hayan cargado las inversiones
                    })
                    .catch((error) => {
                        console.error(error); // Manejo de errores si ocurre algún error en la carga de inversiones
                    });

            },
            error: function(xhr, status, error) {
                console.error(error, status, xhr);
                // Manejo del error en caso de que ocurra
            }
        });
    });
}

function editarPartida() {

    $(document).ready(function() {
        var numeroOrden = $("#nueva-partida #numero-orden").val();
        var fechaAcreditacion = $("#nueva-partida #fecha-acreditacion").val();
        var raciones = $("#nueva-partida #raciones").val();
        var mes = $("#nueva-partida #mes option:selected").val();
        var anio = $("#nueva-partida #anio option:selected").val();
        var idTipopartida = $("#nueva-partida #idTipopartida option:selected").val();
        var idBenefactor = $("#nueva-partida #idBenefactor option:selected").val();
        var montoPeriodo = $("#nueva-partida #monto-periodo").val();
        var idPartida = $("#nueva-partida #id").val();

        // Se envían los datos mediante AJAX
        $.ajax({
            url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/partidas.php',
            type: 'post',
            dataType: 'json',
            data: {
                idForm: 'MODIFICACION',
                numeroOrden: numeroOrden,
                fechaAcreditacion: fechaAcreditacion,
                idTipopartida: idTipopartida,
                idBenefactor: idBenefactor,
                raciones: raciones,
                mes: mes,
                anio: anio,
                montoPeriodo: montoPeriodo,
                idPartida: idPartida
            },
            success: function(response) {

                const filas = document.querySelectorAll("tbody TD"); // const tipoMensaje = "Edicion";
                filas.forEach((fila) => {
                    if (fila.firstChild !== fila) {

                        fila.remove();

                    }

                });

                // Se cierra el modal
                $('#nueva-partida-modal').modal('hide');

                //Consulta las partitas presupuestarias mediate ajax las renderiza mediante scripting
                cargarTabla();
                $('#inversiones #totalPartida').empty();

                //cargarInversiones();

                //Actualiza el array de partidas 
                partidas.forEach((partida) => {

                    if (partida.id_partida == idPartida) {

                        partida.id_partida = idPartida.textContent;
                        partida.monto_periodo = montoPeriodo.textContent;
                        partida.fecha_acreditacion = fechaAcreditacion.textContent;
                        partida.mes = mes.textContent;
                        partida.anio = anio.textContent;
                        partida.id_tipo_partida = idTipopartida.textContent;
                        partida.nombre_tipo_partida = idTipopartida.textContent;
                        partida.idBenefactor = idBenefactor.textContent;
                        partida.nombreBenefactor = idBenefactor.textContent;
                        partida.raciones = raciones.textContent;
                        partida.numero_orden = numeroOrden.textContent;

                    };

                });

                mostrarAlerta(response);
                // agregarColumnas();

            },
            error: function(xhr, status, error) {
                console.error(error, status, xhr);
                // Manejo del error en caso de que ocurra
            }
        });
    });
}

function cargaDatosParida(e) {

    const tituloModal = $("#nueva-partida-modal #mi-segundo-modal-titulo");
    tituloModal.text('Editar partida presupuestaria');
    const tituloForm = $("#nueva-partida-modal #titulo");
    tituloForm.text('Editar partida presupuestaria');

    const input_IdPartida = document.getElementById("nueva-partida").querySelector("#id");
    if (input_IdPartida !== null) {
        input_IdPartida.remove();
    };

    const idForm = document.getElementById("nueva-partida").querySelector("#idForm");
    idForm.value = "MODIFICACION";

    const input_idPartida = document.createElement("INPUT");
    input_idPartida.type = "hidden";
    input_idPartida.id = "id";
    input_idPartida.name = "id";
    input_idPartida.value = parseInt(e.target.id);


    idForm.parentElement.appendChild(input_idPartida);

    const selectMes = document.getElementById("nueva-partida").querySelector("#mes");
    const selectanios = document.getElementById("nueva-partida").querySelector("#anio");
    const selectBenefactores = document.getElementById("nueva-partida").querySelector("#idBenefactor");
    const SelecTipoPartida = document.getElementById("nueva-partida").querySelector("#idTipopartida");
    const numeroOrden = document.getElementById("nueva-partida").querySelector("#numero-orden");
    const fechaAcreditacion = document.getElementById("nueva-partida").querySelector("#fecha-acreditacion");
    const raciones = document.getElementById("nueva-partida").querySelector("#raciones");
    const montoPeriodo = document.getElementById("nueva-partida").querySelector("#monto-periodo");

    seleccionarOpcion(selectMes, e.target.dataset.mes);
    seleccionarOpcion(selectanios, e.target.dataset.anio);
    seleccionarOpcion(selectBenefactores, e.target.dataset.idbenefactor);
    seleccionarOpcion(SelecTipoPartida, e.target.dataset.idtipopartida);
    numeroOrden.value = parseInt(e.target.dataset.numeroorden);
    fechaAcreditacion.value = e.target.dataset.fechaacreditacion;
    raciones.value = parseInt(e.target.dataset.raciones);
    montoPeriodo.value = parseFloat(e.target.dataset.montoperiodo);

}

function cargaDatosInversion(element) {

    let titulo = $('#mi-segundo-modal #mi-segundo-modal-titulo');
    titulo.addClass("text-center");
    titulo.text(`Agregar inversion en ID Partida: ${$(element).attr('id')} - ${$(element).data('nombrebenefactor')} - ${$(element).data('nombretipopartida')} - ${$(element).data('anio')} - ${$(element).data('mes')}`);

    const input_IdPartida = document.getElementById("mi-segundo-modal").querySelector("#id");
    if (input_IdPartida !== null) {
        input_IdPartida.remove();
    };

    const idForm = document.getElementById("mi-segundo-modal").querySelector("#idForm");
    idForm.value = "ALTA";

    const input_idPartida = document.createElement("INPUT");
    input_idPartida.type = "hidden";
    input_idPartida.id = "id";
    input_idPartida.name = "id";

    if (element.id === undefined) {
        input_idPartida.value = parseInt(element.attr("id"));
    } else {
        input_idPartida.value = parseInt(element.id);
    }
    idForm.parentElement.appendChild(input_idPartida);

}

function seleccionarOpcion(select, id) {
    for (let i = 0; i < select.options.length; i++) {

        if (id == select.options[i].value) {
            select.options[i].selected = true;
        }
    }
}

function adicionarMeses() {

    const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];

    const mesesDisponibles = document.querySelector("#mes");

    const mesPartida = document.getElementById("nueva-partida").querySelector("#mes");


    meses.forEach((element) => {
        var opcion = document.createElement("option");
        opcion.value = element;
        opcion.textContent = element
        mesesDisponibles.appendChild(opcion);
        mesPartida.appendChild(opcion);

    });
}

function adicionarAnios() {
    var aniosDisponibles = document.querySelector("#anio");
    var mesPartida = document.getElementById("nueva-partida").querySelector("#anio");
    var aniosDisponiblesBusqueda = document.querySelector(".form-group #anio");
    anio

    var fechaActual = new Date();
    var anioActual = fechaActual.getFullYear();
    anioActual -= 2;

    for (var i = 0; i < 5; i++) {
        // Coloca aquí el código que deseas ejecutar en cada iteración
        var opcion = document.createElement("option");
        opcion.value = anioActual + i;
        opcion.textContent = anioActual + i;
        aniosDisponibles.appendChild(opcion);
        mesPartida.appendChild(opcion);

    }

    for (var i = 0; i < 5; i++) {
        // Coloca aquí el código que deseas ejecutar en cada iteración
        var opcion = document.createElement("option");
        opcion.value = anioActual + i;
        opcion.textContent = anioActual + i;
        aniosDisponiblesBusqueda.appendChild(opcion);

    }
}

function cargarBenefactores() {

    $.ajax({
        url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/benefactor.php',
        type: 'post',
        dataType: 'json',
        data: {
            idForm: 'CONSULTA' // Valor del dato que deseas enviar
        },
        success: function(data) {
            var resultado = [];

            for (var i = 0; i < data.length; i++) {
                var benefactor = {
                    idBenefactor: data[i].idBenefactor,
                    nombreBenefactor: data[i].nombreBenefactor,

                };

                resultado.push(benefactor);
            }

            // var benefactorPartida = document.getElementById("nueva-partida").querySelector("#idBenefactor");

            var benfactoresDisponibles = document.getElementById("nueva-partida-modal").querySelector("#idBenefactor");

            var benefactoresBusqueda = document.querySelector(".form-group #idBenefactor");


            resultado.forEach(function(element) {
                var opcion = document.createElement("option");
                opcion.value = element.idBenefactor;
                opcion.textContent = element.nombreBenefactor;


                benfactoresDisponibles.appendChild(opcion);
            });

            resultado.forEach(function(element) {
                var opcion = document.createElement("option");
                opcion.value = element.idBenefactor;
                opcion.textContent = element.nombreBenefactor;

                benefactoresBusqueda.appendChild(opcion);
            });

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

function cargarTiposPartidas() {
    $.ajax({
        url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/tipoPartida.php',
        type: 'post',
        dataType: 'json',
        data: {
            idForm: 'CONSULTA' // Valor del dato que deseas enviar
        },
        success: function(data) {
            let resultado = [];

            for (let i = 0; i < data.length; i++) {
                let tipoPartida = {
                    idTipo: data[i].id_tipo_partida,
                    nombreTipo: data[i].nombre_tipo_partida,
                };

                resultado.push(tipoPartida);
            }

            var tiposPartida = document.getElementById("nueva-partida").querySelector("#idTipopartida");
            var tipoPartidaBusqueda = document.querySelector(".form-group #idTipopartida");

            resultado.forEach(function(element) {
                var opcion = document.createElement("option");
                opcion.value = element.idTipo;
                opcion.textContent = `${element.nombreTipo}`

                tiposPartida.appendChild(opcion);
            });
            resultado.forEach(function(element) {
                var opcion = document.createElement("option");
                opcion.value = element.idTipo;
                opcion.textContent = `${element.nombreTipo}`

                tipoPartidaBusqueda.appendChild(opcion);
            });

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });

}

//Consulta las partitas presupuestarias mediate ajax las renderiza mediante scripting
function cargarTabla() {
    var resultado = '';

    $.ajax({
        url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/partidas.php',
        type: 'post',
        dataType: 'json',
        data: {
            idForm: 'CONSULTA' // Aquí defines el valor del dato que deseas enviar
        },
        success: function(data) {

            // Función de comparación para ordenar por idPartida
            function compararPorIdPartida(a, b) {
                return a.idInversion - b.idInversion;
            };

            // Ordenar el array utilizando la función de comparación
            data.sort(compararPorIdPartida);

            // Objeto para almacenar los totales invertidos por partida
            let totalesPorPartida = {};

            // Calcular el total invertido por partida
            inversiones.forEach(inversion => {
                const { idPartida, montoInversion } = inversion;
                if (totalesPorPartida[idPartida]) {
                    totalesPorPartida[idPartida] += parseFloat(montoInversion);
                } else {
                    totalesPorPartida[idPartida] = parseFloat(montoInversion);
                }
            });

            // Crear el nuevo array de objetos con idPartida y totalInvertido
            const nuevoArray = Object.keys(totalesPorPartida).map(idPartida => {
                return {
                    idPartida,
                    totalInvertido: totalesPorPartida[idPartida].toFixed(2)
                };
            });

            console.log(nuevoArray);

            var recibidoTabla = 0;

            var invertidoTabla = 0;


            for (var i = 0; i < data.length; i++) {
                // console.log(data[i]);


                // Crear un objeto y almacenar dos variables en él
                let partida = {
                    id_partida: data[i].id_partida,
                    numero_orden: data[i].numero_orden,
                    mes: data[i].mes,
                    anio: data[i].anio,
                    raciones: data[i].raciones,
                    monto_periodo: data[i].monto_periodo,
                    fecha_acreditacion: data[i].fecha_acreditacion,
                    nombre_tipo_partida: data[i].nombre_tipo_partida,
                    id_tipo_partida: data[i].id_tipo_partida,
                    nombreBenefactor: data[i].nombreBenefactor,
                    idBenefactor: data[i].idBenefactor,

                };

                partidas.push(partida);


                recibidoTabla += parseFloat(data[i].monto_periodo).toFixed(2);

                let invertido = nuevoArray.find((element) => element.idPartida === data[i].id_partida);
                let totalInvertido = 0;
                // Verificar si se encontró el elemento antes de obtener el totalInvertido
                if (invertido) {
                    totalInvertido = invertido.totalInvertido;
                    invertidoTabla += totalInvertido;
                }

                console.log(inversiones);
                inversionesPorPartidas.find((obj) => {
                    if (obj.idPartida == data[i].id_partida) {
                        obj.montoPartida = data[i].monto_periodo;
                    }
                });


                //Scripting.

                resultado += `<tr class="filaAnimada text-center">`;
                resultado += `<td class="dato text-dark">${data[i].id_partida}</td>`;
                resultado += `<td class="dato text-dark">${data[i].nombreBenefactor}</td>`;
                resultado += `<td class="dato text-dark">${data[i].nombre_tipo_partida}</td>`;
                resultado += `<td class="dato text-dark">${data[i].anio}</td>`;
                resultado += `<td class="dato text-dark">${data[i].mes}</td>`;
                resultado += `<td class="dato text-dark">${data[i].numero_orden}</td>`;
                resultado += `<td class="dato text-dark">${data[i].raciones}</td>`;
                resultado += `<td class="dato text-dark text-center totalPartida">${data[i].monto_periodo}</td>`;
                resultado += `<td class="dato text-dark inver">${totalInvertido}</td>`;
                resultado += `<td class="dato text-dark disponible">${data[i].monto_periodo-totalInvertido}</td>`;
                resultado += `<td class="dato text-dark ">${data[i].fecha_acreditacion}</td>`;
                resultado += `<td class="dato text-dark">
               
                <div class="dropdown">
  <button type="button" class="btn dropdown-toggle  btn-dark" data-bs-toggle="dropdown">
    Acciones
  </button>
  <ul class="dropdown-menu">

    <li>
     <a class="dropdown-item">
       <button id="${data[i].id_partida}" class="verInversiones btn btn-info" style="width: 100%;" data-idPartida="${data[i].id_partida}" data-idBenefactor="${data[i].idBenefactor}" data-nombreBenefactor=${data[i].nombreBenefactor} data-idTipoPartida="${data[i].id_tipo_partida}" data-nombreTipoPartida=${data[i].nombre_tipo_partida} data-anio="${data[i].anio}" data-mes="${data[i].mes}" >
       <i class="icofont-eye"></i></i>&nbsp;Ver&nbspInversiones
       </button> 
     </a>
    </li>
    <li>
      <a class="dropdown-item">
        <button id="${data[i].id_partida}" class="invertir btn btn-primary" style="width: 100%;" data-idPartida="${data[i].id_partida}" data-idBenefactor="${data[i].idBenefactor}" data-nombreBenefactor=${data[i].nombreBenefactor} data-idTipoPartida="${data[i].id_tipo_partida}" data-nombreTipoPartida=${data[i].nombre_tipo_partida} data-anio="${data[i].anio}" data-mes="${data[i].mes}" >
        <i class="icofont-ui-add"></i>&nbsp;Invertir
        </button> 
      </a>
    </li>
    <li>
      <a class="dropdown-item" >
        <button id="${data[i].id_partida}" class="editar btn btn-warning" style="width: 100%;  data-idPartida="${data[i].id_partida}" data-idBenefactor="${data[i].idBenefactor}"  data-idTipoPartida="${data[i].id_tipo_partida}" data-anio="${data[i].anio}" data-mes="${data[i].mes}" data-numeroOrden="${data[i].numero_orden}" data-raciones="${data[i].raciones}" data-montoPeriodo="${data[i].monto_periodo}" data-fechaAcreditacion="${data[i].fecha_acreditacion}">
        <i class="icofont-ui-edit"></i>&nbsp;Editar
        </button> 
      </a>
    </li>
    <li>
      <a class="dropdown-item">
        <button id="${data[i].id_partida}" class="eliminar btn btn-danger" style="width: 100%;">
        <i class="icofont-ui-delete"></i>&nbsp;Eliminar
        </button> 
      </a>
    </li>
  </ul>
</div>
              </td>`
                resultado += `</tr>`;

            }

            $('#resultado').html(resultado);

            actualizarTablapartidas();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown, jqXHR);
        }
    });
}

function eliminarPartida(id) {
    $.ajax({
        url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/partidas.php',
        type: 'POST',
        dataType: 'json',
        data: {
            idForm: 'ELIMINACION',
            idPartida: id
        },
        success: function(response) {
            if (response.success) {
                mostrarAlerta(response);
                //Consulta las partitas presupuestarias mediate ajax las renderiza mediante scripting
                cargarTabla();
            } else {
                mostrarAlerta(response);
            }
        },
        error: function(xhr, status, error) {
            console.error(error + "-" + status + "-" + xhr);
            // Manejo del error en caso de que ocurra
        }
    });
}

function eliminarInversion(id) {
    $.ajax({
        url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/inversiones.php',
        type: 'POST',
        dataType: 'json',
        data: {
            idForm: 'ELIMINACION',
            idInversion: id
        },
        success: function(response) {

            if (response.success) {
                mostrarAlerta(response);
            } else {
                mostrarAlerta(response);
            }
        },
        error: function(xhr, status, error) {
            console.error(error + "-" + status + "-" + xhr);
            // Manejo del error en caso de que ocurra
        }
    });
}

function mostrarAlerta(response) {

    let alertElement = document.createElement("div");
    alertElement.setAttribute("role", "alert");

    if (response.message === "Error") {
        alertElement.classList.add("alert", "alert-danger", "m-3");
        alertElement.textContent = ` ${response.message} - Todos los campos son obligatorios!!`;
        alertElement.style.zIndex = '9999';
    } else {

        if (response.accion == "Alta") {

            alertElement.classList.add("alert", "alert-success", "m-3");
            alertElement.textContent = response.message;

        }

        if (response.accion == "Modificacion") {

            alertElement.classList.add("alert", "alert-warning", "m-3");
            alertElement.textContent = response.message;

        }

        if (response.accion == "Eliminacion") {

            alertElement.classList.add("alert", "alert-danger", "m-3");
            alertElement.textContent = response.message;

        }

    }


    alertElement.style.position = "fixed";
    alertElement.style.width = "auto";
    alertElement.style.top = "0px";
    alertElement.style.right = "0px";

    const padre = document.getElementById("agregarAlerta");
    padre.appendChild(alertElement);

    setTimeout(() => {
        // Ocultar el alert
        $(".alert").alert("close");
        $(".alert").remove();
    }, 4000);
}

function cargarInversiones() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/inversiones.php',
            type: 'post',
            dataType: 'json',
            data: {
                idForm: 'CONSULTA'
            },
            success: function(data) {
                // Función de comparación para ordenar por idPartida
                function compararPorIdPartida(a, b) {
                    return a.idInversion - b.idInversion;
                }

                // Ordenar el array utilizando la función de comparación
                data.sort(compararPorIdPartida);

                // Calcular total inversido por paritda
                inversiones = [];

                // Continuar con el procesamiento una vez que el ordenamiento haya finalizado
                procesarDatos(data);

                calcularTotalPartidas(data);

                // Resolver la promesa para indicar que se han cargado las inversiones
                resolve('Inversiones cargadas correctamente');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown, jqXHR);
                // Rechazar la promesa en caso de error
                reject(errorThrown);
            }
        });
    });
}

function calcularTotalPartidas(data) {

    // Objeto para almacenar la suma de montos por idPartida
    const sumaPorPartida = {};

    // Recorriendo el arreglo de inversiones
    for (const inversion of data) {
        const { idPartida, montoInversion } = inversion;

        // Si el idPartida no existe en el objeto sumaPorPartida, se inicializa en 0
        if (!sumaPorPartida[idPartida]) {
            sumaPorPartida[idPartida] = 0;
        }

        // Sumando el monto de inversión al idPartida correspondiente
        sumaPorPartida[idPartida] += parseFloat(montoInversion);
    }

    // Recorriendo el objeto sumaPorPartida y guardando los resultados en el nuevo arreglo
    for (const idPartida in sumaPorPartida) {
        inversionesPorPartidas.push({ idPartida, totalInvertido: sumaPorPartida[idPartida] });
    }

    for (const partida of partidas) {
        const idPartida = partida.id_partida;
        const encontrada = inversionesPorPartidas.some((obj) => obj.idPartida === idPartida);
        if (!encontrada) {
            let obj = {
                idPartida: idPartida,
                montoInversion: 0
            }
            inversionesPorPartidas.push(idPartida);
        }
    }

}

function procesarDatos(data) {
    var tbody = $('#inversiones #resultado');
    tbody.empty();

    for (var i = 0; i < data.length; i++) {
        var inversion = data[i];
        var fechaInversion = inversion.fechaInversion;
        var idInversion = inversion.idInversion;
        var idPartida = inversion.idPartida;
        var identificadorComprobante = inversion.identificador_comprobante;
        var montoInversion = inversion.montoInversion;
        var nombreBenefactor = inversion.nombreBenefactor;
        var nombreTipoPartida = inversion.nombre_tipo_partida;
        var obsInversion = inversion.obsInversion;
        var provedor = inversion.provedor;
        var anioPartida = inversion.anio;
        var mesPartida = inversion.mes;

        var inversionObj = { // Crear objeto con los datos de la inversión
            fechaInversion: fechaInversion,
            idInversion: idInversion,
            idPartida: idPartida,
            identificadorComprobante: identificadorComprobante,
            montoInversion: montoInversion,
            nombreBenefactor: nombreBenefactor,
            nombreTipoPartida: nombreTipoPartida,
            obsInversion: obsInversion,
            provedor: provedor,
            anioPartida: anioPartida,
            mesPartida: mesPartida
        };

        inversiones.push(inversionObj); // Agregar el objeto de inversión al array inversiones

        var row = '<tr>' +
            '<td class="align-middle text-center">' + idInversion + '</td>' +
            '<td class="align-middle text-center idPartidaTabla">' + idPartida + '</td>' +
            '<td class="align-middle text-center">' + `${nombreBenefactor} <br> ${nombreTipoPartida} <br> ${anioPartida} - ${mesPartida}` + '</td>' +
            '<td class="align-middle">' + identificadorComprobante + '</td>' +
            '<td class="align-middle">' + fechaInversion + '</td>' +
            '<td class="align-middle">' + provedor + '</td>' +
            '<td class="align-middle montoInversion">' + montoInversion + '</td>' +
            '<td class="align-middle">' + obsInversion + '</td>' +
            `<td class="align-middle dato text-dark">
               
            <div class="dropdown">
<button type="button" class="btn dropdown-toggle btn-dark" data-bs-toggle="dropdown">
Acciones
</button>
<ul class="dropdown-menu">

<li>
  <a class="dropdown-item" >
    <button id="${idInversion}" class="editarInversion btn btn-warning" style="width: 100%;  data-identificadorComprobante="${identificadorComprobante}" data-fechaInversion="${fechaInversion}"  data-provedor="${provedor}" data-montoInversion="${montoInversion}" data-obsInversion="${obsInversion}">
    <i class="icofont-ui-edit"></i>&nbsp;Editar
    </button> 
  </a>
</li>
<li>
  <a class="dropdown-item">
    <button id="${idInversion}" class="eliminarInversion btn btn-danger" style="width: 100%;">
    <i class="icofont-ui-delete"></i>&nbsp;Eliminar
    </button> 
  </a>
</li>
</ul>
</div>


          </td>` +

            '</tr>';

        tbody.append(row);
    }

}

// Función que se ejecuta cuando cambia el valor de los select
function onSelectChange() {
    // Obtener los valores seleccionados
    var valorSelect1 = document.querySelector(".form-group #idBenefactor");
    var valorSelect2 = document.querySelector(".form-group #idTipopartida");
    var valorSelect3 = document.querySelector(".form-group #anio");

    // Obtener las etiquetas de las opciones seleccionadas
    var etiquetaSelect1 = valorSelect1.options[valorSelect1.selectedIndex].textContent;
    var etiquetaSelect2 = valorSelect2.options[valorSelect2.selectedIndex].textContent;
    var etiquetaSelect3 = valorSelect3.options[valorSelect3.selectedIndex].textContent;

    datosBusqueda.benefactor = etiquetaSelect1 == "Seleccione benefactor" ? "" : etiquetaSelect1;
    datosBusqueda.tipoPartida = etiquetaSelect2 == "Seleccione Tipo partida" ? "" : etiquetaSelect2;
    datosBusqueda.anio = etiquetaSelect3 == "Seleccione año partida" ? "" : etiquetaSelect3;


    var partidas = document.querySelectorAll("#partidasDisponibles tbody tr");

    partidas.forEach((fila) => {
        if (fila.classList.contains("d-none")) {
            fila.classList.remove("d-none");
        };
    });

    partidas.forEach((fila) => {
        let benefactorFila = fila.firstElementChild.nextSibling.textContent;
        let tipoBenefactorFila = fila.firstElementChild.nextSibling.nextSibling.textContent;
        let anioFila = fila.firstElementChild.nextSibling.nextSibling.nextSibling.textContent;
        let filaCoincidene = (datosBusqueda.benefactor == benefactorFila || datosBusqueda.benefactor == "") && (datosBusqueda.tipoPartida == tipoBenefactorFila || datosBusqueda.tipoPartida == "") && (datosBusqueda.anio == anioFila || datosBusqueda.anio == "");

        if (!filaCoincidene) {
            fila.classList.add("d-none");
        }
        actualizarTablapartidas();
    });

}

function actualizarTablapartidas() {
    var totRecibido = 0;
    var totInvertido = 0;

    let tabla = document.getElementById("partidasDisponibles").querySelectorAll("tbody tr");

    tabla.forEach((fila) => {
        if (!fila.classList.contains("d-none")) {
            let invertitoFila = parseFloat(fila.querySelector(".inver").textContent);
            let saldoFila = parseFloat(fila.querySelector(".disponible").textContent);

            totInvertido += invertitoFila;
            totRecibido += saldoFila;
        }

    });

    document.getElementById("totalMontoPartidas").textContent = totRecibido + totInvertido;
    document.getElementById("totalInvertidoPartidas").textContent = totInvertido;
    document.getElementById("totalSaldoParidas").textContent = totRecibido;
}