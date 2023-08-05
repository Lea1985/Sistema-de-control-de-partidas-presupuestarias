$(document).ready(function() {


    const btnEnviarForm = document.querySelector("#enviarForm");
    const btnEditarForm = document.querySelector("#editarForm");




    btnEnviarForm.addEventListener("click", (e) => { altaTipoParida(e) });
    btnEditarForm.addEventListener("click", (e) => { editarTipoBenefactor(e) });

    cargarTabla();

    //------------------------------------------------------------------

    $(document).on('click', '#cerrar-mi-segundo-modal', function(e) {
        e.preventDefault();
        e.target.setAttribute('data-toggle', 'modal');
        e.target.setAttribute('data-target', 'mi-segundo-modal');

        $('#mi-segundo-modal').modal('hide');
    });

    //------------------------------------------------------------------


    $(document).on('click', '#agregarTipoPartida', function(e) {
        e.preventDefault();
        e.target.setAttribute('data-toggle', 'modal');
        e.target.setAttribute('data-target', 'mi-segundo-modal');

        formularionNuevoBenefactor();
        $('#mi-segundo-modal').modal('show');

        btnEnviarForm.style.display = "block";
        btnEditarForm.style.display = "none";

    });


    $(document).on('click', '.editar', function(e) {
        e.preventDefault();
        e.target.setAttribute('data-toggle', 'modal');
        e.target.setAttribute('data-target', 'mi-segundo-modal');
        $('#mi-segundo-modal').modal('show');


        let inputidForm = document.querySelector("#idForm");
        inputidForm.value = "MODIFICACION";
        const inputid = document.querySelector("#idTipoPartida");

        // Verificar si existe inputid y eliminarlo si es necesario
        if (inputid !== null) {
            inputid.remove();
        }

        const inputId = document.createElement("input");
        inputId.type = "hidden";
        inputId.name = "idTipoPartida";
        inputId.id = "idTipoPartida";
        inputId.value = parseInt(e.target.id);
        inputidForm.parentElement.appendChild(inputId);

        formularioEditarTipo(e);

        btnEnviarForm.style.display = "none";
        btnEditarForm.style.display = "block";
        console.log(btnEditarForm);

    });


    $(document).on('click', '.eliminar', function(e) {
        console.log()
        e.preventDefault();

        Swal.fire({
            title: `¿Esta seguro de eliminar tipo partida id N° ${e.target.id}?`,
            text: "No seras capaz de desacher esta accion!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'

        }).then((result) => {
            if (result.isConfirmed) {
                eliminarTipo(e);
            }
        });
    });

    //Se Cargar en una tabla todos los tipos de partidas en base de datos.


});


function cargarTabla() {

    $.ajax({
        url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/tipoPartida.php',
        type: 'post',
        dataType: 'json',
        data: {
            idForm: 'CONSULTA' // Aquí defines el valor del dato que deseas enviar
        },
        success: function(data) {
            var resultado = '';
            for (var i = 0; i < data.length; i++) {
                resultado += `
                    <tr>
                        <td class="dato text-dark">${data[i].id_tipo_partida}</td>
                        <td class="dato text-dark">${data[i].nombre_tipo_partida}</td>
                        <td class="dato text-dark">${data[i].descripcion_tipo_partida}</td>
                        <td class="dato text-dark">
               
                        <div class="dropdown">
                        <button type="button" class="btn dropdown-toggle btn-dark" data-bs-toggle="dropdown">
                        Acciones
                        </button>
                        <ul class="dropdown-menu">
                        
                        <li>
                        <a class="dropdown-item">
                        <button class="editar btn btn-warning" id="${data[i].id_tipo_partida}" style="width:100%" 
                        data-nombreTipo="${data[i].nombre_tipo_partida}"
                        data-descTipo="${data[i].descripcion_tipo_partida}">Editar</button>            
                        </a>
                        </li>
                        <li>
                        <a class="dropdown-item">
                        
                        <button id="${data[i].id_tipo_partida}" class="eliminar btn btn-danger" style="width:100%" >Eliminar</button>
                        </a>
                        </li>
                        
                        
                        </ul>
                        </div>
                        
                        
                        </td>
                    </tr>`;
            }
            $('#resultado').html(resultado);



        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });

}


function altaTipoParida(e) {
    e.preventDefault();

    //Se cargan los datos actuales del benefactor en el form
    const inpuTipo = document.querySelector("#nombre_tipo_partida");
    const inputDesc = document.querySelector("#descripcion_tipo_partida");




    if (inpuTipo.value !== "" && inputDesc.value !== "") {


        $.ajax({
            url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/tipoPartida.php',
            type: 'post',
            dataType: 'json', // Cambiado de 'application/json' a 'json'
            data: {
                idForm: 'ALTA', // Define el valor de idForm como 'ELIMINAR'
                nombre_tipo_partida: inpuTipo.value,
                descripcion_tipo_partida: inputDesc.value
                    // Envía el id del benefactor que deseas eliminar
            },
            success: function(response) {

                new Swal("El Tipo benefactor se agregado exitosamente!")


                const filas = document.querySelectorAll("TD"); // const tipoMensaje = "Edicion";
                filas.forEach((fila) => {
                    fila.remove();

                })

                $('#mi-segundo-modal').modal('hide');
                cargarTabla();
                inputBenefactor.value = "";
                inputDesc.value = "";


            },
            error: function(xhr, status, error) {
                console.error(error + "-" + status + "-" + xhr);
                // Manejo del error en caso de que ocurra
            }
        });


    } else {
        const response = { message: "Error" };

        mostrarAlerta(response);
    }


}


function editarTipoBenefactor(e) {
    e.preventDefault();

    //Se cargan los datos actuales del benefactor en el form
    let inputTipopartida = document.querySelector("#nombre_tipo_partida");
    let inputDescTipopartida = document.querySelector("#descripcion_tipo_partida");
    let inputIdTipopartida = document.querySelector("#idTipoPartida");


    $.ajax({
        url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/tipoPartida.php',
        type: 'post',
        dataType: 'json', // Cambiado de 'application/json' a 'json'
        data: {
            idForm: 'MODIFICACION', // Define el valor de idForm como 'ELIMINAR'
            idTipoPartida: inputIdTipopartida.value,
            nombre_tipo_partida: inputTipopartida.value,
            descripcion_tipo_partida: inputDescTipopartida.value
                // Envía el id del benefactor que deseas eliminar
        },
        success: function(response) {

            console.log(response);
            const filas = document.querySelectorAll("TD"); // const tipoMensaje = "Edicion";
            filas.forEach((fila) => {
                fila.remove();

            })
            $('#mi-segundo-modal').modal('hide');
            cargarTabla();

            new Swal(`El Tipo id ${inputIdTipopartida.value}`, "Se ha eliminado exitosamente!")



        },
        error: function(xhr, status, error) {
            console.error(error + "-" + status + "-" + xhr);
            // Manejo del error en caso de que ocurra
        }
    });

}


function eliminarTipo(e) {
    var idTipoPartida = parseInt(e.target.id); // Obtén el valor del id del benefactor que deseas eliminar

    $.ajax({
        url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/tipoPartida.php',
        type: 'post',
        dataType: 'json', // Cambiado de 'application/json' a 'json'
        data: {
            idForm: 'ELIMINACION', // Define el valor de idForm como 'ELIMINAR'
            idTipoPartida: idTipoPartida // Envía el id del benefactor que deseas eliminar
        },
        success: function(response) {
            console.log(response);
            // e.target.parentElement.parentElement.remove();
            e.target.closest('tr').remove();
            new Swal(`El tipo id ${idTipoPartida}`, "Se ha eliminado exitosamente!")



        },
        error: function(xhr, status, error) {
            console.error(error + "-" + status + "-" + xhr);
            // Manejo del error en caso de que ocurra
        }
    });

}


function formularioEditarTipo(e) {

    console.log(e.target.id);

    const inputidForm = document.querySelector("#idForm");
    inputidForm.value = "MODIFICACION";
    // Cambio de título del modal
    const tituloModal = document.querySelector("#mi-segundo-modal-titulo");
    tituloModal.textContent = "Editar tipo partida";
    //Se cargan los datos actuales del benefactor en el form
    const inpuTipo = document.querySelector("#nombre_tipo_partida");
    const inputDesc = document.querySelector("#descripcion_tipo_partida");




    let id = parseInt(e.target.id); // Obtener el valor de la propiedad de datos data-id
    let nombre = e.target.dataset.nombretipo;
    let desc = e.target.dataset.desctipo;
    console.log(`${id} - ${nombre} - ${desc} `);

    inpuTipo.value = nombre;
    inputDesc.value = desc;




}


function formularionNuevoBenefactor() {



    const tituloModal = document.querySelector("#mi-segundo-modal-titulo");
    tituloModal.textContent = "Agregar tipo partida";

    //Actualizar form 

    var inputId = document.querySelector("#id");

    console.log(inputId);

    if (inputId !== null) {


        inputId.remove();
    }

    //Se cargan los datos actuales del benefactor en el form
    const inpuTipo = document.querySelector("#nombre_tipo_partida");
    const inputDesc = document.querySelector("#descripcion_tipo_partida");
    const inputidForm = document.querySelector("#idForm");
    inpuTipo.value = "";
    inputDesc.value = "";
    inputidForm.value = "ALTA";






}


function mostrarAlerta(response) {

    let alertElement = document.createElement("div");
    alertElement.setAttribute("role", "alert");



    if (response.message === "Error") {
        alertElement.classList.add("alert", "alert-danger", "m-3");
        alertElement.textContent = ` ${response.message} - Todos los campos son obligatorios!!`;
        alertElement.style.zIndex = '9999';
    }


    alertElement.style.position = "fixed";
    alertElement.style.width = "auto";
    alertElement.style.top = "0px";
    alertElement.style.right = "0px";

    const padre = document.querySelector("#agregarAlerta");
    padre.appendChild(alertElement);

    setTimeout(() => {
        // Ocultar el alert
        $(".alert").alert("close");
        $(".alert").remove();
    }, 4000);
}