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

// Función para sanitizar las entradas de usuario y prevenir inyección de SQL
function sanitizeInput($input) {
    global $conn;
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input);
    $input = mysqli_real_escape_string($conn, $input);
    return $input;
}

// Manejar las diferentes acciones usando un switch
switch ($idForm) {

    case 'CONSULTA':
        // Realizar la consulta para seleccionar todos los registros de la tabla
        $query = "SELECT i.*, b.nombreBenefactor, tp.nombre_tipo_partida, pp.monto_periodo, pp.anio, pp.mes
                  FROM inversion AS i
                  JOIN partida_presupuestaria AS pp ON i.idPartida = pp.id_partida
                  JOIN benefactor AS b ON pp.idBenefactor = b.idBenefactor
                  JOIN tipo_partida AS tp ON pp.id_tipo_partida = tp.id_tipo_partida";
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
            $error = array("error" => "Error en la consulta: " . mysqli_error($conn));
            echo json_encode($error);
        }
        break;
    

        case 'ALTA':
            $idPartida = isset($_POST['idPartida']) ? sanitizeInput($_POST['idPartida']) : '';
            $fechaInversion = isset($_POST['fechaInversion']) ? sanitizeInput($_POST['fechaInversion']) : '';
            $montoInversion = isset($_POST['montoInversion']) ? sanitizeInput($_POST['montoInversion']) : '';
            $provedor = isset($_POST['provedor']) ? sanitizeInput($_POST['provedor']) : '';
            $obsInversion = isset($_POST['obsInversion']) ? sanitizeInput($_POST['obsInversion']) : '';
            $identificadorComprobante = isset($_POST['identificadorComprobante']) ? sanitizeInput($_POST['identificadorComprobante']) : '';
        
            // Insertar los datos en la tabla usando una consulta preparada
            $stmt = mysqli_prepare($conn, "INSERT INTO inversion (idPartida, fechaInversion, montoInversion, provedor, obsInversion, identificador_comprobante) 
                    VALUES (?, ?, ?, ?, ?, ?)");
            mysqli_stmt_bind_param($stmt, "ssssss", $idPartida, $fechaInversion, $montoInversion, $provedor, $obsInversion, $identificadorComprobante);
        
            $response = array(); // Crear un array de respuesta
        
            if (mysqli_stmt_execute($stmt)) {
                $response['success'] = true; // Agregar una clave 'success' con valor true
                $response['message'] = 'Alta'; // Agregar el mensaje de alta exitosa
                $response['message'] = <<<EOD
            La inversion se registro exitosamente.
            EOD;
            $response['accion'] = "Alta";
            } else {
                $response['success'] = false; // Agregar una clave 'success' con valor false
                $response['message'] = 'Algo falló: ' . mysqli_stmt_error($stmt); // Agregar el mensaje de error específico
            }
        
            echo json_encode($response); // Devolver la respuesta como JSON
            break;
        
            case 'MODIFICACION':
                $idInversion = isset($_POST['idInversion']) ? sanitizeInput($_POST['idInversion']) : '';
                $idPartida = isset($_POST['idPartida']) ? sanitizeInput($_POST['idPartida']) : '';
                $fechaInversion = isset($_POST['fechaInversion']) ? sanitizeInput($_POST['fechaInversion']) : '';
                $montoInversion = isset($_POST['montoInversion']) ? sanitizeInput($_POST['montoInversion']) : '';
                $provedor = isset($_POST['provedor']) ? sanitizeInput($_POST['provedor']) : '';
                $obsInversion = isset($_POST['obsInversion']) ? sanitizeInput($_POST['obsInversion']) : '';
                $identificadorComprobante = isset($_POST['identificadorComprobante']) ? sanitizeInput($_POST['identificadorComprobante']) : '';
            
                // Actualizar los datos en la tabla usando una consulta preparada
                $stmt = mysqli_prepare($conn, "UPDATE inversion SET idPartida = ?, fechaInversion = ?, montoInversion = ?, provedor = ?, obsInversion = ?, identificador_comprobante = ? WHERE idInversion = ?");
                mysqli_stmt_bind_param($stmt, "sssssss", $idPartida, $fechaInversion, $montoInversion, $provedor, $obsInversion, $identificadorComprobante, $idInversion);
            
                $response = array(); // Crear un array de respuesta
            
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
        $idInversion = isset($_POST['idInversion']) ? sanitizeInput($_POST['idInversion']) : '';

        // Eliminar los datos en la tabla usando una consulta preparada
        $stmt = mysqli_prepare($conn, "DELETE FROM inversion WHERE idInversion = ?");
        mysqli_stmt_bind_param($stmt, "i", $idInversion);

        if (mysqli_stmt_execute($stmt)) {
            $response['success'] = true; // Agregar una clave 'success' con valor true
            $response['message'] = 'Eliminacion'; // Agregar el mensaje de eliminación exitosa
            $response['idInversion'] = $idInversion; // Agregar el ID de la inversión eliminada
        } else {
            $response['success'] = false; // Agregar una clave 'success' con valor false
            $response['message'] = 'Algo falló: ' . mysqli_stmt_error($stmt); // Agregar el mensaje de error específico
        }

        echo json_encode($response); // Devolver la respuesta como JSON
        break;

    default:
        $response = array("error" => "Acción no válida");
        echo json_encode($response);
        break;
}

mysqli_close($conn);
?>
