
<?php
require "../includes/db.php";

$data = file_get_contents('php://input');
$dataJsonDecode = json_decode($data);
$msg = $dataJsonDecode->msg;

$tsql = " SELECT c.Cost_id,c.Cost_name,c.Cost_SKTHM FROM SKTH_HOSPITAL.dbo.tblDepPhone d 
LEFT JOIN SKTH_HOSPITAL.dbo.tblCostCenter c on c.Cost_id = d.d_cost_id
where ( d.d_phonenumber = '$msg' or c.Cost_name like '%$msg%' or c.Cost_nickname like '%$msg%' ) GROUP BY c.Cost_id,c.Cost_name,c.Cost_SKTHM ";
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
