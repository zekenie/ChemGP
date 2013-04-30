<?
	require("../lib/main.inc.php");
	insert("paper",$_GET['paper']);
	redirect("index.php");
?>