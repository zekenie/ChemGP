<?
	require("../lib/main.inc.php");
	
	//remove exsisting tags
	delete("tagReactionLink",array("reactionID"=>$_POST['reactionID']));
	
	$tags = explode(",", $_POST['tags']);
	
	foreach($tags as $tag){
		$tag = trim(strtolower($tag));
		$exsistingTag = find_one("tag",array("tag"=>$tag));
		if($exsistingTag)
			$tagID = $exsistingTag['tagID'];
		else
			$tagID = insert("tag",array("tag"=>$tag));
		insert("tagReactionLink",array("tagID"=>$tagID,"reactionID"=>$_POST['reactionID']));
	}
	
?>