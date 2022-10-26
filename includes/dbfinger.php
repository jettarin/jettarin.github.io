<?php
/* Set Connection Credentials */
// $serverName="WEBSERVER\SKTH_SQL,1435";
error_reporting( error_reporting() & ~E_NOTICE );

$serverNamef="192.168.0.10\SKTH_FSRS,1436";
$uidf = "sa";
$pwdf = "25182521Qwe";
$connectionInfof = array( "UID"=>$uidf,
                         "PWD"=>$pwdf,
                         "Database"=>"SKTH_FSRS",
                         "CharacterSet"=>"UTF-8");

/* Connect using SQL Server Authentication. */
$connf = sqlsrv_connect( $serverNamef, $connectionInfof);

if( $connf === false ) {
     echo "Unable to connect.</br>";
     die( print_r( sqlsrv_errors(), true));

}
 ?>
