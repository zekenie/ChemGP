<?
	require("../lib/main.inc.php");
	$moleculeName = find_one("moleculeName",array("moleculeNameID"=>$_GET['moleculeNameID']));
	$currentPrimary = find_one("moleculeName",array("moleculeID"=>$moleculeName['moleculeID'],"primary"=>"1"));
	if(isset($_GET['moleculeName']['primary']) && $currentPrimary)
		update("moleculeName",array("primary"=>"0"),array("moleculeNameID"=>$currentPrimary['moleculeNameID']));
	
	update("moleculeName",$_GET['moleculeName'],array("moleculeNameID"=>$_GET['moleculeNameID']));
		
		
?>