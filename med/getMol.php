
<?

require("../lib/main.inc.php");

?>
<script src="http://underscorejs.org/underscore.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<link rel="stylesheet" href="../chemdoodle/ChemDoodleWeb.css" type="text/css">
<script src="../chemdoodle/ChemDoodleWeb-libs.js"></script>
<script src="../chemdoodle/ChemDoodleWeb.js"></script>

<?
$meds = find("med",array("generic"=>"Nicotinic acid"));
echo "<script>var meds = [";
$output = "";
foreach($meds as $med){
	$output .= "'" . trim($med['generic']) . "', ";
}
	$output = substr($output, 0,-2);
	echo $output . "]";

?>

/*_.each(meds,function(med){
	ChemDoodle.iChemLabs.getMoleculeFromDatabase("pubchem", med, function(mol) {
		var dotMol = ChemDoodle.writeMOL(mol);
		$.ajax({
			url: "update.php",
			type:"POST",
			data:{mol:dotMol,generic:med}
		});
	});
});*/

function getMols(n,service,attempts){
	if(!service)
		service = "pubchem";
	ChemDoodle.iChemLabs.getMoleculeFromDatabase(service,meds[n],function(mol){
		console.log("going in for " + meds[n]);
		var dotMol = ChemDoodle.writeMOL(mol);
		$.ajax({
			url: "update.php",
			type:"POST",
			data:{mol:dotMol,generic:meds[n]}
		}).done(function(){
			if(n > 0)
				getMols(n-1);
		});
	},"",function(){
		if(attempts != 1)
			getMols(n,"chemspider",1);
		else
			getMols(n-1);
	}
);
	
}
getMols(meds.length-1);
</script>