<?
	require("../lib/main.inc.php");
	update("molecule",$_POST['molecule'],array("moleculeID"=>$_POST['moleculeID']));
?>