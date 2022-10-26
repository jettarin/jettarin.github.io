<?php
/* Set Connection Credentials */
// $serverName="WEBSERVER\SKTH_SQL,1435";
$serverName="192.168.0.10\SKTH_SQL,1435";
$uid = "userGetdata";
$pwd = "25182521Qwe";
$connectionInfo = array( "UID"=>$uid,
                         "PWD"=>$pwd,
                         "Database"=>"SKTH_ENSUSER",
                         "CharacterSet"=>"UTF-8");

/* Connect using SQL Server Authentication. */
$conn = sqlsrv_connect( $serverName, $connectionInfo);

if( $conn === false ) {
     echo "Unable to connect.</br>";
     die( print_r( sqlsrv_errors(), true));
}

/* TSQL Query */


 ?>
