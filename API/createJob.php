<?php
require "../includes/db.php";


$data = file_get_contents('php://input');
$dataJsonDecode = json_decode($data);
$header = $dataJsonDecode->header;
$desc = $dataJsonDecode->description;
$user_id = $dataJsonDecode->user_id;
$datecreated = date("Y/m/d");
$timecreated = date("h:i:s");
$tell = $dataJsonDecode->tell;
$depid = $dataJsonDecode->depid;

$tsql = "INSERT INTO SKTHM.dbo.tblJob (job_header,
                              job_desc,
                              job_user_id,
                              job_dep_of_durable,
                              job_date_created,
                              job_time_created,
                              job_tell)
                      VALUES ('$header',
                              '$desc',
                              '$user_id',
                              '$depid',
                              '$datecreated',
                              '$timecreated',
                              '$tell')";
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
