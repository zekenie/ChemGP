<?
	function getShortName($paper){
		$aAuthors = explode(",", $paper['authors']);
		$shortName = $aAuthors[0] . " et al " . $paper['year'];
		return $shortName;
	}
?>