<?	require("../lib/main.inc.php"); 


	if(!isset($_GET['reaction']['paperID']))
		$_GET['reaction']['paperID'] = insert("paper",$_GET['paper']);
		
	$reactionID = insert("reaction",$_GET['reaction']);
	
	if(!isset($_GET['redirect']))
		$_GET['redirect'] = "view.php?reactionID=" . $reactionID;
		
	redirect($_GET['redirect']);
?>