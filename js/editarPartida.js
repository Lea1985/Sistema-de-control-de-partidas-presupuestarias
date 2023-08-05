// Obtener la cadena de consulta de la URL
const queryString = window.location.search;

// Crear un objeto URLSearchParams con la cadena de consulta
const urlParams = new URLSearchParams(queryString);

// Obtener el valor del parámetro "id"
var numero_orden = urlParams.get("numero_orden");
var dataMes = urlParams.get("data-mes");
var dataAnio = urlParams.get("data-anio");
var raciones = urlParams.get("raciones");
var monto_periodo = urlParams.get("monto_periodo");
var fecha_acreditacion = urlParams.get("fecha_acreditacion");
var dataTipo = urlParams.get("data-tipo");
var id_tipo_partida = urlParams.get("id_tipo_partida");
var id_partida = urlParams.get("id_partida")

console.log(`${numero_orden} - ${dataMes} - ${dataAnio} - ${raciones} - ${monto_periodo} - ${fecha_acreditacion} - ${dataTipo} - ${id_tipo_partida} - ${id_partida}`);

const inputNumeroOrden = document.getElementById("numero-orden");
//const inputDescripcion = document.getElementById("descripcion_tipo_partida");
//const inputId = document.getElementById("id_tipo");

inputNumeroOrden.value = numero_orden;
//inputDescripcion.value = descripcion;
//inputId.value = id;