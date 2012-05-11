<?php
session_start();
include("connection.php");

// Log outTime in account_history
//mysql_query("UPDATE account_history SET outTime = '".date("U")."' WHERE accountId = '".$_SESSION['liveAccount']['id']."' AND inTime = '".$_SESSION['liveAccount']['inTime']."'");

// Detroy Session data and variables
$_SESSION = array();
session_destroy();

// Go to return address if isset(), else default to home
//header("Location: ".(isset($_GET['return']) ? $_GET['return'] : "./index.php?site=home"));
header("Location: ./index.php?site=home");
?>