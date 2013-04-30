<?
	require("../lib/main.inc.php");
	$conditions = array("moleculeID"=>$_GET['moleculeID']);
	delete("molecule",$conditions);
	delete("moleculeNames",$conditions);
	redirect("index.php");
?>