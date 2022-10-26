
<?php
require "../includes/db.php";

$data = file_get_contents('php://input');
$dataJsonDecode = json_decode($data);
$msg = $dataJsonDecode->msg;

$tsql = " SELECT * FROM SKTH_HOSPITAL.dbo.tblCostCenter ORDER BY Cost_name ";
$stmt = sqlsrv_query( $conn, $tsql);

if( $stmt === false ) {
     echo "Error in executing query.</br>";
     die( print_r( sqlsrv_errors(), true)); 
}

/* Process results */
$json = array();

do {
     while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
     $json []  = $row;
     }
} while ( sqlsrv_next_result($stmt) );

/* Run the tabular results through json_encode() */
/* And ensure numbers don't get cast to trings */
echo json_encode($json);
/* Free statement and connection resources. */
sqlsrv_free_stmt( $stmt);
sqlsrv_close( $conn);

// WHO CALL
//  app.js /
// user.js /user

?>
