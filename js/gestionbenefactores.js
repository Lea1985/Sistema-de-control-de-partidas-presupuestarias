$(document).ready(function() {


    const btnEnviarForm = document.querySelector("#enviarForm");
    const btnEditarForm = document.querySelector("#editarForm");


    btnEnviarForm.addEventListener("click", (e) => { altaBenefactor(e) });
    btnEditarForm.addEventListener("click", (e) => { editarBenefactor(e) });


    mostrarTabla();

    $('#mi-segundo-modal').modal();

    //------------------------------------------------------------------


    $(document).on('click', '#agregarBenefactor', function(e) {
        e.preventDefault();
        e.target.setAttribute('data-toggle', 'modal');
        e.target.setAttribute('data-target', 'mi-segundo-modal');

        formularionNuevoBenefactor();

        $('#mi-segundo-modal').modal('show');

        //Se cargan los datos actuales del benefactor en el form
        //Cambio titulo modal


        btnEnviarForm.style.display = "block";
        btnEditarForm.style.display = "none";



    });

    //------------------------------------------------------------------

    $(document).on('click', '#cerrar-mi-segundo-modal', function(e) {
        e.preventDefault();
        e.target.setAttribute('data-toggle', 'modal');
        e.target.setAttribute('data-target', 'mi-segundo-modal');

        $('#mi-segundo-modal').modal('hide');
    });

    //------------------------------------------------------------------


    $(document).on('click', '.editar', function(e) {
        e.preventDefault();
        e.target.setAttribute('data-toggle', 'modal');
        e.target.setAttribute('data-target', 'mi-segundo-modal');
        $('#mi-segundo-modal').modal('show');



        let inputidForm = document.querySelector("#idForm");
        inputidForm.value = "MODIFICACION";
        const inputid = document.querySelector("#id");



        // Verificar si existe inputid y eliminarlo si es necesario
        if (inputid !== null) {
            inputid.remove();
            // Crear y agregar el nuevo inputid

        }



        var inputId = document.createElement("input");
        inputId.type = "hidden";
        inputId.name = "id";
        inputId.id = "id";
        inputId.value = parseInt(e.target.id);
        inputidForm.parentElement.appendChild(inputId);

        formularioEditarBenefactor(e);

        btnEnviarForm.style.display = "none";
        btnEditarForm.style.display = "block";





    });

    $(document).on('click', '.eliminar', function(e) {
        console.log()
        e.preventDefault();

        Swal.fire({
            title: `¿Esta seguro de eliminar benefactor id N° ${e.target.id}?`,
            text: "No seras capaz de desacher esta accion!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'

        }).then((result) => {
            if (result.isConfirmed) {
                eliminarBenefactor(e);
            }
        });
    });


});

function mostrarTabla() {

    //Se recuperaran los registros de los benefactores
    $.ajax({
        url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/benefactor.php',
        type: 'post',
        dataType: 'json',
        data: {
            idForm: 'CONSULTA' // Aquí defines el valor del dato que deseas enviar
        },
        success: function(data) {
            let resultado = '';
            for (var i = 0; i < data.length; i++) {

                //Scripting de los benefactores

                resultado += '<tr><td class="dato text-dark">' + data[i].idBenefactor + '</td>';
                resultado += '<td class="dato text-dark">' + data[i].nombreBenefactor + '</td>';
                resultado += '<td class="dato text-dark">' + data[i].descBenefactor + '</td>';
                resultado += `<td class="dato text-dark">
               
                <div class="dropdown">
                <button type="button" class="btn dropdown-toggle btn-dark" data-bs-toggle="dropdown">
                Acciones
                </button>
                <ul class="dropdown-menu">
                
                <li>
                <a class="dropdown-item">
                <button id="${data[i].idBenefactor}" class="btn btn-warning editar" style="width:100%;" type="button" data-id="${data[i].idBenefactor}" data-nombre="${data[i].nombreBenefactor}" data-desc="${data[i].descBenefactor}">Editar</button>
                
                </a>
                </li>
                <li>
                <a class="dropdown-item">
                
                <button id="${data[i].idBenefactor}" class="btn btn-danger eliminar" style="width:100%;">Eliminar</button></form></td>
                </a>
                </li>
                
                
                </ul>
                </div>
                
                
                </td></tr>`
            }

            //Se agrega el scripting al HTML
            $('#resultado').html(resultado);

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });

}

function eliminarBenefactor(e) {
    var idBenefactor = parseInt(e.target.id); // Obtén el valor del id del benefactor que deseas eliminar


    $.ajax({
        url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/benefactor.php',
        type: 'post',
        dataType: 'json', // Cambiado de 'application/json' a 'json'
        data: {
            idForm: 'ELIMINACION', // Define el valor de idForm como 'ELIMINAR'
            idBenefactor: idBenefactor, // Envía el id del benefactor que deseas eliminar
        },
        success: function(response) {

            // e.target.parentElement.parentElement.remove();
            e.target.closest('tr').remove();

            new Swal(`El Benefactor id ${idBenefactor}`, "Se ha eliminado exitosamente!")


        },
        error: function(xhr, status, error) {
            console.error(error + "-" + status + "-" + xhr);
            // Manejo del error en caso de que ocurra
        }
    });

}


function editarBenefactor(e) {
    e.preventDefault();

    //Se cargan los datos actuales del benefactor en el form
    let inputBenefactor = document.querySelector("#benefactor");
    let inputDesc = document.querySelector("#descBenefactor");
    let inputIdBenefactor = document.querySelector("#id");


    $.ajax({
        url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/benefactor.php',
        type: 'post',
        dataType: 'json', // Cambiado de 'application/json' a 'json'
        data: {
            idForm: 'MODIFICACION', // Define el valor de idForm como 'ELIMINAR'
            id: inputIdBenefactor.value,
            benefactor: inputBenefactor.value,
            descBenefactor: inputDesc.value
                // Envía el id del benefactor que deseas eliminar
        },
        success: function(response) {

            console.log(response);
            const filas = document.querySelectorAll("TD"); // const tipoMensaje = "Edicion";
            filas.forEach((fila) => {
                fila.remove();

            })

            $('#mi-segundo-modal').modal('hide');
            mostrarTabla();

            new Swal("El Benefactor se ha editado exitosamente");


        },
        error: function(xhr, status, error) {
            console.error(error + "-" + status + "-" + xhr);
            // Manejo del error en caso de que ocurra
        }
    });

}



function altaBenefactor(e) {
    e.preventDefault();

    //Se cargan los datos actuales del benefactor en el form
    let inputBenefactor = document.querySelector("#benefactor");
    let inputDesc = document.querySelector("#descBenefactor");




    if (inputBenefactor.value !== "" && inputDesc.value !== "") {


        $.ajax({
            url: 'http://localhost/Sistema%20de%20control%20de%20gastos%20Escuelas/php/benefactor.php',
            type: 'post',
            dataType: 'json', // Cambiado de 'application/json' a 'json'
            data: {
                idForm: 'ALTA', // Define el valor de idForm como 'ELIMINAR'
                benefactor: inputBenefactor.value,
                descBenefactor: inputDesc.value
                    // Envía el id del benefactor que deseas eliminar
            },
            success: function(response) {
                console.log(response)

                new Swal("El Benefactor se ha agregado exitosamente");

                const filas = document.querySelectorAll("TD"); // const tipoMensaje = "Edicion";
                filas.forEach((fila) => {
                    fila.remove();

                })
                $('#mi-segundo-modal').modal('hide');
                mostrarTabla();
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



function formularioEditarBenefactor(e) {

    console.log(e.target.id);

    let inputidForm = document.querySelector("#idForm");
    inputidForm.value = "MODIFICACION";
    // Cambio de título del modal
    const tituloModal = document.querySelector("#mi-segundo-modal-titulo");
    tituloModal.textContent = "Editar Benefactor";

    let inputBenefactor = document.querySelector("#benefactor");
    let inputDesc = document.querySelector("#descBenefactor");



    let id = e.target.dataset.id; // Obtener el valor de la propiedad de datos data-id
    let nombre = e.target.dataset.nombre;
    let desc = e.target.dataset.desc;
    console.log(`${id} - ${nombre} - ${desc} `);

    inputBenefactor.value = nombre;
    inputDesc.value = desc;




}




function formularionNuevoBenefactor() {



    const tituloModal = document.querySelector("#mi-segundo-modal-titulo");
    tituloModal.textContent = "Agregar Benefactor";

    //Actualizar form 

    var inputId = document.querySelector("#id");

    console.log(inputId);

    if (inputId !== null) {


        inputId.remove();
    }

    //Se cargan los datos actuales del benefactor en el form
    let inputidForm = document.querySelector("#idForm");
    let inputBenefactor = document.querySelector("#benefactor");
    let inputDesc = document.querySelector("#descBenefactor");
    inputBenefactor.value = "";
    inputDesc.value = "";
    inputidForm.value = "ALTA";






}