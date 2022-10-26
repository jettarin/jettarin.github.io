
<?php
require "../includes/db.php";

$data = file_get_contents('php://input');
$dataJsonDecode = json_decode($data);
$date_created = date("Y/m/d");



$tsql = " SELECT 
p.Mem_ID
,j.job_id
,concat(p.Pre_name,p.Mem_name,' ',p.Mem_lastname) as officername
,j.job_header
,j.job_desc
,j.job_last_update
,c.Cost_nickname
,l.lov_description
,l.lov_code


FROM SKTHM.dbo.tblJob j
LEFT JOIN SKTH_HOSPITAL.dbo.tblCostCenter c on c.Cost_SKTHM = j.job_dep_of_durable
LEFT JOIN SKTHM.dbo.tblLov l on l.lov_value = j.job_status AND l.lov_code = 'SST' AND l.lov_role = 'admin'
LEFT JOIN SKTH_HOSPITAL.dbo.tblPersonal p ON p.Mem_ID = j.job_user_id
 WHERE job_date_created BETWEEN '$date_created' AND '$date_created' ORDER BY job_last_update DESC   ";
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
