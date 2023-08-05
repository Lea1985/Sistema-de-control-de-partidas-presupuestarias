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
        $query = "SELECT p.*, tp.nombre_tipo_partida, b.nombreBenefactor
                FROM partida_presupuestaria p
                INNER JOIN tipo_partida tp ON p.id_tipo_partida = tp.id_tipo_partida
                INNER JOIN benefactor b ON p.idBenefactor = b.idBenefactor";
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
            $numeroOrden = isset($_POST['numeroOrden']) ? sanitizeInput($_POST['numeroOrden']) : '';
            $fechaAcreditacion = isset($_POST['fechaAcreditacion']) ? sanitizeInput($_POST['fechaAcreditacion']) : '';
            $tipoPartida = isset($_POST['idTipopartida']) ? sanitizeInput($_POST['idTipopartida']) : '';
            $benefactor = isset($_POST['idBenefactor']) ? sanitizeInput($_POST['idBenefactor']) : '';
            $raciones = isset($_POST['raciones']) ? sanitizeInput($_POST['raciones']) : '';
            $mesPartida = isset($_POST['mes']) ? sanitizeInput($_POST['mes']) : '';
            $anioPartida = isset($_POST['anio']) ? sanitizeInput($_POST['anio']) : '';
            $montoPartida = isset($_POST['montoPeriodo']) ? sanitizeInput($_POST['montoPeriodo']) : '';
       
            // Insertar los datos en la tabla usando una consulta preparada
            $stmt = mysqli_prepare($conn, "INSERT INTO partida_presupuestaria (id_tipo_partida, idBenefactor, numero_orden, mes, anio, monto_periodo, fecha_acreditacion, raciones) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            mysqli_stmt_bind_param($stmt, "ssssssss", $tipoPartida, $benefactor, $numeroOrden, $mesPartida, $anioPartida, $montoPartida, $fechaAcreditacion, $raciones);
        
        $response = array(); // Crear un array de respuesta

        if (mysqli_stmt_execute($stmt)) {
            $response['success'] = true; // Agregar una clave 'success' con valor true
            $response['message'] = <<<EOD
            La parida se creo exitosamente.
            EOD;
            $response['accion'] = "Alta";

        } else {
            $response['success'] = false; // Agregar una clave 'success' con valor false
            $response['message'] = 'Algo falló: ' . mysqli_stmt_error($stmt); // Agregar el mensaje de error específico
        }

        echo json_encode($response); // Devolver la respuesta como JSON
        break;
        
        
        
        

        case 'MODIFICACION':
            $numeroOrden = isset($_POST['numeroOrden']) ? sanitizeInput($_POST['numeroOrden']) : '';
            $fechaAcreditacion = isset($_POST['fechaAcreditacion']) ? sanitizeInput($_POST['fechaAcreditacion']) : '';
            $tipoPartida = isset($_POST['idTipopartida']) ? sanitizeInput($_POST['idTipopartida']) : '';
            $benefactor = isset($_POST['idBenefactor']) ? sanitizeInput($_POST['idBenefactor']) : '';
            $raciones = isset($_POST['raciones']) ? sanitizeInput($_POST['raciones']) : '';
            $mesPartida = isset($_POST['mes']) ? sanitizeInput($_POST['mes']) : '';
            $anioPartida = isset($_POST['anio']) ? sanitizeInput($_POST['anio']) : '';
            $montoPartida = isset($_POST['montoPeriodo']) ? sanitizeInput($_POST['montoPeriodo']) : '';
            $idPartida = isset($_POST['idPartida']) ? sanitizeInput($_POST['idPartida']) : '';
        
            // Actualizar los datos en la tabla usando una consulta preparada
            $stmt = mysqli_prepare($conn, "UPDATE partida_presupuestaria SET id_tipo_partida = ?, idBenefactor = ?, numero_orden = ?, mes = ?, anio = ?, monto_periodo = ?, fecha_acreditacion = ?, raciones = ? WHERE id_partida = ?");
            mysqli_stmt_bind_param($stmt, "ssssssssi", $tipoPartida, $benefactor, $numeroOrden, $mesPartida, $anioPartida, $montoPartida, $fechaAcreditacion, $raciones, $idPartida);
        
            if (mysqli_stmt_execute($stmt)) {
                $response['success'] = true; // Agregar una clave 'success' con valor true
                $response['message'] = <<<EOD
                La parida id $idPartida se modifico exitosamente
                EOD;
                $response['accion'] = "Modificacion";

            } else {
                $response['success'] = false; // Agregar una clave 'success' con valor false
                $response['message'] = 'Algo falló: ' . mysqli_stmt_error($stmt); // Agregar el mensaje de error específico
            }
    
            echo json_encode($response); // Devolver la respuesta como JSON
            break;
        
           case 'ELIMINACION':
    $idPartida = isset($_POST['idPartida']) ? sanitizeInput($_POST['idPartida']) : '';

    // Verificar si existen registros relacionados en la tabla secundaria
    $query = "SELECT COUNT(*) AS count FROM inversion WHERE idPartida = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $idPartida);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_bind_result($stmt, $count);
    mysqli_stmt_fetch($stmt);
    mysqli_stmt_close($stmt);

    if ($count > 0) {
        // Hay registros relacionados en la tabla secundaria, no se puede eliminar
        $response['success'] = false;
        $response['message'] =  <<<EOD
        No se puede eliminar la partida id $idPartida porque tiene inversiones realizadas
        EOD;
        $response['accion'] = "Eliminacion";
        echo json_encode($response);
    } else {
        // No hay registros relacionados, se puede proceder con la eliminación
        $stmt = mysqli_prepare($conn, "DELETE FROM partida_presupuestaria WHERE id_Partida = ?");
        mysqli_stmt_bind_param($stmt, "i", $idPartida);

        $response = array(); // Crear un array de respuesta

        if (mysqli_stmt_execute($stmt)) {
            $response['success'] = true; // Agregar una clave 'success' con valor true
            $response['message'] = <<<EOD
            Partida id $idPartida eliminada exitosamente.
            EOD;
            $response['accion'] = "Eliminacion";
        } else {
            $response['success'] = false; // Agregar una clave 'success' con valor false
            $response['message'] = 'Algo falló: ' . mysqli_stmt_error($stmt); // Agregar el mensaje de error específico
            $response['data'] = null; // Agregar un campo de datos nulo en caso de error
        }

        echo json_encode($response); // Devolver la respuesta como JSON
    }

    break;

            
            
            
        default:
            $response = array("error" => "Acción no válida");
            echo json_encode($response);
            break;
        
}

mysqli_close($conn);
?>
