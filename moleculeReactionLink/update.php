<?
	require("../lib/main.inc.php");
	update("moleculeReactionLink",$_GET['link'],array("moleculeReactionLinkID"=>$_GET['moleculeReactionLinkID']));
	echo json_encode($_GET['link']);
?>