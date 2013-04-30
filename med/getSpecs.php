
<?
ini_set("memory_limit","40M");
require("../lib/main.inc.php");

?>
<script src="http://underscorejs.org/underscore.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<link rel="stylesheet" href="../chemdoodle/ChemDoodleWeb.css" type="text/css">
<script src="../chemdoodle/ChemDoodleWeb-libs.js"></script>
<script src="../chemdoodle/ChemDoodleWeb.js"></script>

<?
$meds = select_many("SELECT `generic`,`mol` FROM `med` WHERE `generic` = 'k-strophanthoside'");//find("med");
echo "<script>var meds = [";
$output = "";
foreach($meds as &$med){
	$med['mol'] = str_replace("<br />", "", $med['mol']);
	$med['mol'] = str_replace("\n", '\n', $med['mol']);

	//$output .= json_encode($med)."', ";
	$output .= "{generic: '" . $med['generic'] . "',mol:'" . $med['mol'] . "'}, ";
}
	$output = substr($output, 0,-2);
	echo $output . "]";

?>



function getSpecs(n){
	var molObj = ChemDoodle.readMOL(meds[n].mol);
	ChemDoodle.iChemLabs.simulate1HNMR(molObj,function(spec){
		console.log("going in for " + meds[n].generic);
		var safeSpec = JSON.stringify(spec);
		$.ajax({
			url: "update.php",
			type:"POST",
			data:{h:safeSpec,generic:meds[n].generic}
		}).done(function(){
			if(n > 0)
				getSpecs(n-1);
		});
	},"",function(){
			getSpecs(n-1);
	}
);
	
}
getSpecs(meds.length-1);
</script>