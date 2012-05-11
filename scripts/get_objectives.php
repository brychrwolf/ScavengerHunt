<?php
include("connection.php");

$xml = "<container>";
$objectiveQuery = mysql_query("SELECT * FROM objective WHERE released < CURRENT_TIMESTAMP");
while($objectiveDetails = mysql_fetch_object($objectiveQuery)){
	$xml .= "<objective>"
				."<id>$objectiveDetails->id</id>"
				."<type>$objectiveDetails->type</type>"
				."<name>$objectiveDetails->name</name>"
				."<date_added>$objectiveDetails->date_added</date_added>"
				."<released>$objectiveDetails->released</released>"
				."</objective>";
}
$xml .= "</container>";

header('Content-type: text/xml'); 
echo $xml;
?>