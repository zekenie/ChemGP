<?
	require("../lib/main.inc.php");
	if(isset($_GET['moleculeID'],$_GET['reactionID'])){
		delete("moleculeReactionLink",array("moleculeID"=>$_GET['moleculeID'],"reactionID"=>$_GET['reactionID']));
	}
	if(isset($_GET['redirect']))
		redirect($_GET['redirect']);
?>