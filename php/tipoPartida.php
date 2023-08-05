<?php
// Establecer la codificación del documento
header('Content-Type: application/json; charset=UTF-8');

// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "sistema_gestion_partidas";

$conn = mysqli_connect($servername, $username, $password, $dbname);

// Verificar la conexión
if (!$conn) {
    die("Conexión fallida: " . mysqli_connect_error());
}

$idForm = isset($_POST['idForm']) ? $_POST['idForm'] : '';

// Función para sanitizar las entradas de usuario
function sanitizeInput($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input);
    return $input;
}

// Manejar las diferentes acciones usando un switch
switch ($idForm) {
    case 'CONSULTA':
        // Realizar la consulta para seleccionar todos los registros de la tabla
        $query = "SELECT * FROM tipo_partida";
        $resultado = mysqli_query($conn, $query);

        // Verificar si la consulta fue exitosa
        if ($resultado) {
            // Crear un array para almacenar los datos
            $data = array();

            // Recorrer los resultados y agregarlos al array
            while ($fila = mysqli_fetch_assoc($resultado)) {
                $data[] = $fila;
            }

            // Devolver los resultados en formato JSON
            echo json_encode($data);
        } else {
            // Manejar el caso de error en la consulta
            echo json_encode(array("error" => "Error en la consulta: " . mysqli_error($conn)));
        }
        break;

    case 'ALTA':
        $nombre_tipo_partida = isset($_POST['nombre_tipo_partida']) ? sanitizeInput($_POST['nombre_tipo_partida']) : '';
        $descripcion_tipo_partida = isset($_POST['descripcion_tipo_partida']) ? sanitizeInput($_POST['descripcion_tipo_partida']) : '';

        // Insertar los datos en la tabla usando una consulta preparada
        $stmt = mysqli_prepare($conn, "INSERT INTO tipo_partida (nombre_tipo_partida, descripcion_tipo_partida) VALUES (?, ?)");
        mysqli_stmt_bind_param($stmt, "ss", $nombre_tipo_partida, $descripcion_tipo_partida);

       
        if (mysqli_stmt_execute($stmt)) {
            $response['success'] = true; // Agregar una clave 'success' con valor true
            $response['message'] = 'Alta'; // Agregar el mensaje de alta exitosa
            // Agregar cualquier otro dato necesario en la respuesta
        } else {
            $response['success'] = false; // Agregar una clave 'success' con valor false
            $response['message'] = 'Algo falló: ' . mysqli_stmt_error($stmt); // Agregar el mensaje de error específico
        }

        echo json_encode($response); // Devolver la respuesta como JSON
        break;

    case 'MODIFICACION':
        $nombre_tipo_partida = isset($_POST['nombre_tipo_partida']) ? sanitizeInput($_POST['nombre_tipo_partida']) : '';
        $descripcion_tipo_partida = isset($_POST['descripcion_tipo_partida']) ? sanitizeInput($_POST['descripcion_tipo_partida']) : '';
        $idTipoPartida = isset($_POST['idTipoPartida']) ? sanitizeInput($_POST['idTipoPartida']) : '';

        // Editar los datos en la tabla usando una consulta preparada
        $stmt = mysqli_prepare($conn, "UPDATE tipo_partida SET nombre_tipo_partida = ?, descripcion_tipo_partida = ? WHERE id_tipo_partida = ?");
        mysqli_stmt_bind_param($stmt, "ssi", $nombre_tipo_partida, $descripcion_tipo_partida, $idTipoPartida);

       
        if (mysqli_stmt_execute($stmt)) {
            $response['success'] = true; // Agregar una clave 'success' con valor true
            $response['message'] = 'Edicion'; // Agregar el mensaje de edición exitosa
            // Agregar cualquier otro dato necesario en la respuesta
        } else {
            $response['success'] = false; // Agregar una clave 'success' con valor false
            $response['message'] = 'Algo falló: ' . mysqli_stmt_error($stmt); // Agregar el mensaje de error específico
        }

        echo json_encode($response); // Devolver la respuesta como JSON
        break;

    case 'ELIMINACION':
        $idTipoPartida = isset($_POST['idTipoPartida']) ? sanitizeInput($_POST['idTipoPartida']) : '';

        // Eliminar los datos en la tabla usando una consulta preparada
        $stmt = mysqli_prepare($conn, "DELETE FROM tipo_partida WHERE id_tipo_partida = ?");
        mysqli_stmt_bind_param($stmt, "i", $idTipoPartida);

       
        if (mysqli_stmt_execute($stmt)) {
            $response['success'] = true; // Agregar una clave 'success' con valor true
            $response['message'] = 'Eliminacion'; // Agregar el mensaje de eliminación exitosa
            $response['idTipoPartida'] = $idTipoPartida; // Agregar el ID del benefactor eliminado
        } else {
            $response['success'] = false; // Agregar una clave 'success' con valor false
            $response['message'] = 'Algo falló: ' . mysqli_stmt_error($stmt); // Agregar el mensaje de error específico
        }

        echo json_encode($response); // Devolver la respuesta como JSON
        break;

    default:
        echo json_encode(array("error" => "Acción no válida"));
        break;
}

mysqli_close($conn);
?>
