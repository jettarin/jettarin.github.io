<?php
/* Set Connection Credentials */
// $serverName="WEBSERVER\SKTH_SQL,1435";
// error_reporting( error_reporting() & ~E_NOTICE );

// $serverName="192.168.0.10\SKTH_SQL,1435";
// $uid = "userGetdata";
// $pwd = "25182521Qwe";
// $connectionInfo = array( "UID"=>$uid,
//                          "PWD"=>$pwd,
//                          "Database"=>"SKTH_ENS",
//                          "CharacterSet"=>"UTF-8");

$serverName="192.168.0.64\SKTH_SQLSERVER";
$uid = "sa";
$pwd = "25182521Qwe";
$connectionInfo = array( "UID"=>$uid,
                         "PWD"=>$pwd,
                         "Database"=>"SKTH_ENS",
                         "CharacterSet"=>"UTF-8");

/* Connect using SQL Server Authentication. */
$conn = sqlsrv_connect( $serverName, $connectionInfo);

if( $conn === false ) {
     echo "Unable to connect.</br>";
     die( print_r( sqlsrv_errors(), true));

}
 ?>