<?php
include("connection.php");

$user_id = $_POST['user_id'];
$objective_id = $_POST['objective_id'];

$ftpConnectId = ftp_connect($ftpAddress);
$ftpLoginResult = ftp_login($ftpConnectId, $ftpUsername, $ftpPassword);
if((!$ftpConnectId) || (!$ftpLoginResult)){ die("FTP connection has failed!"); }
if($_FILES["my_uploaded_file"]['name'] != ""){
	$fileName = $_FILES["my_uploaded_file"]['name'];
	$fileNameParts = str_split($fileName, stripos($fileName, '.'));
	$salt = time();
	$fileName = md5($fileName.$salt).$fileNameParts[1];
	ftp_put($ftpConnectId, $fileName, $_FILES["my_uploaded_file"]['tmp_name'], FTP_BINARY) or die("Failed ftp_put("."my_uploaded_file".")<BR>");
}
ftp_close($ftpConnectId);

$query = "INSERT INTO submission (user_id, objective_id, file_name) VALUES('$user_id', '$objective_id', '$fileName')";
mysql_query($query) or die('Error, query failed');

$xml = "<container><file_name>$fileName</file_name></container>";
header('Content-type: text/xml'); 
echo $xml;
?>