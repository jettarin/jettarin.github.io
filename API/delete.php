<?php
require "../includes/db.php";


$data = file_get_contents('php://input');
$dataJsonDecode = json_decode($data);
$id = $dataJsonDecode->id;

$tsql = "DELETE FROM SKTHM.dbo.tblJob Where Job_id = '$id'";
$stmt = sqlsrv_query( $conn, $tsql);
if( $stmt === false ) {
     echo "0";
}else{
    echo "1";
}

/* Process results */
// $json = array();

// do {
//      while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
//      $json   = $row;
//      }
// } while ( sqlsrv_next_result($stmt) );

/* Run the tabular results through json_encode() */
/* And ensure numbers don't get cast to trings */
// echo json_encode($json);
/* Free statement and connection resources. */
sqlsrv_free_stmt( $stmt);
sqlsrv_close( $conn);
?>
