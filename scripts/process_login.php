<?php
include("connection.php");

// To protect MySQL injection 
$email = mysql_real_escape_string(stripslashes($_POST['email']));
$password = mysql_real_escape_string(stripslashes($_POST['password']));

// Default values to pass back in container
$confirmedEmail = "unconfirmed";
$confirmedPassword = "unconfirmed";

$accountQuery = mysql_query("SELECT * FROM user WHERE email='$email' and password='$password'");
if($accountDetails = mysql_fetch_object($accountQuery)){
	$confirmedEmail = $accountDetails->email;
	$confirmedPassword = $accountDetails->password;
}

$xml = "<container><email>$confirmedEmail</email><password>$confirmedPassword</password></container>";
header('Content-type: text/xml'); 
echo $xml;
?>