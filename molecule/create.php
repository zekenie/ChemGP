<?
	require("../lib/main.inc.php");
	if($_POST['molecule']['mol']){
		$sameMol = find_one("molecule",array("SMILES"=>$_POST['molecule']['SMILES']));
		
		if($sameMol)
			$_POST['link']['moleculeID'] = $sameMol['moleculeID'];
		else{
			$_POST['link']['moleculeID'] = insert("molecule",$_POST['molecule']);
			$namesUrl = "http://cactus.nci.nih.gov/chemical/structure/" . $_POST['molecule']['SMILES'] . "/names";
			$names = file_get_contents($namesUrl);
			$namesArray = explode("\n", $names);
			if($namesArray)
				foreach($namesArray as $name)
					if(trim($name) != "")
						insert("moleculeName",array("moleculeID"=>$_POST['link']['moleculeID'],"name"=>$name));
		}
		
		insert("moleculeReactionLink",$_POST['link']);
		echo "done";
	}
?>