<?
	require("../lib/main.inc.php");
	foreach(find("reaction") as $reactionID=>$reaction)
		update("moleculeReactionLink",
			array("paperID"=>$reaction['paperID']),
			array("reactionID"=>$reactionID)
		);
	
?>