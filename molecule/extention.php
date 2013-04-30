
<? 	require("../lib/main.inc.php"); top();
	//$conditions = array("moleculeID"=>$_GET['moleculeID']);
	$molecules = find("molecule");
	

?>
<script>var molecules = [];moleculeIDs = [];</script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
	<link rel="stylesheet" href="../chemdoodle/ChemDoodleWeb.css" type="text/css">
	<script src="../chemdoodle/ChemDoodleWeb-libs.js"></script>
	<script src="../chemdoodle/ChemDoodleWeb.js"></script>
<script>
	ChemDoodle.structures.Molecule.prototype.getAtomCount = function(atom){
		var counter = 0;
		if(atom === "H"){
			for(var i = 0; i< this.atoms.length; i++){
				if(this.atoms[i].label === atom){
					console.log("actual hydrogen counted");
					counter++;
				}
				if(this.atoms[i].label === "C"){
					var bonds = this.getBonds(this.atoms[i]);
					var toAdd = 4;
					for(var j = 0; j< bonds.length; j++){
						toAdd -= bonds[j].bondOrder;
					}
					counter += toAdd;
				}
			}
		}else{
			for(var i = 0; i< this.atoms.length; i++){
				if(this.atoms[i].label === atom)
					counter++;
			}
		}
		return counter;
	}
	
	ChemDoodle.structures.Molecule.prototype.getNumRings = function(){
		return this.rings.length;
	}
<?
foreach($molecules as $molecule){
		$molecule['mol'] = str_replace("\n", '\n', $molecule['mol']);
	?>
	molecules.push(ChemDoodle.readMOL("<? echo $molecule['mol']; ?>"));
	moleculeIDs.push(<? echo $molecule['moleculeID']; ?>);
	
<? } ?>
function updateMol(i){
		
		$.post("update.php",{
			//'molecule[c]':molecules[i].getAtomCount("C"),
			//'molecule[h]':molecules[i].getAtomCount("H"),
			//'molecule[o]':molecules[i].getAtomCount("O"),
			//'molecule[n]':molecules[i].getAtomCount("N"),
			//'molecule[s]':molecules[i].getAtomCount("S"),
			//'molecule[cl]':molecules[i].getAtomCount("Cl"),
			'molecule[rings]':molecules[i].rings.length,//molecules[i].getNumRings(),
			'moleculeID':moleculeIDs[i]
		
		},function(response){
			console.log("page was hit for moleculeID " + moleculeIDs[i] + " and the response from the server was :" + response);
			if(molecules[i + 1]){ //if the next molecule exsists
				setTimeout(function(){
					updateMol(i+1);
				},500);
			}
		});
		
	}
</script>