<?
	require("../lib/main.inc.php");
	require("../paper/model.inc.php");
	top();
	$conditions = array("reactionID"=>$_GET['reactionID']);
	$reaction = find_one("reaction",$conditions);
	$tagReactionLinks = find("tagReactionLink",$conditions);
	$tags = find("tag");
	$paper = find_one("paper",array("paperID"=>$reaction['paperID']));
	$paper['shortName'] = getShortName($paper);
	
	$reactantLinks = array();
	$molTypes = array("reactant","solvant","product");
	
	foreach($molTypes as $molType)
		$reactantLinks[$molType] = find("moleculeReactionLink",array('reactionID'=>$_GET['reactionID'],'role'=>$molType	));
	
	?>

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
	<link rel="stylesheet" href="../chemdoodle/ChemDoodleWeb.css" type="text/css">
	<script src="../chemdoodle/ChemDoodleWeb-libs.js"></script>
	<script src="../chemdoodle/ChemDoodleWeb.js"></script>
	<!--these three are required by the SketcherCanvas plugin-->
	<link rel="stylesheet" href="../chemdoodle/sketcher/jquery-ui-1.8.7.custom.css" type="text/css">
	<script src="../chemdoodle/sketcher/jquery-ui-1.8.7.custom.min.js"></script>
	<script src="../chemdoodle/sketcher/ChemDoodleWeb-sketcher.js"></script>
	
	<script>
		var	molecules = {
				reactant:{},
				solvant: {},
				product: {}
			},
			viewers = [];
	</script>
	
	<ul class="breadcrumb">
		<li><a href="../paper/">Papers</a> <span class="divider">/</li>
		<li><a href="../paper/view.php?paperID=<? echo $paper['paperID']; ?>"><? echo $paper['shortName']; ?></a> <span class="divider">/</li>
		<li class="active">This Reaction</li>
	</ul>
	
	<?
		$tagInputStr = "";
		if($tagReactionLinks){
			foreach($tagReactionLinks as $tagReactionLink)
				$tagInputStr .= $tags[$tagReactionLink['tagID']]['tag'] . ",";
			$tagInputStr = substr($tagInputStr, 0, -1);
		}
	?>
	
	<div>
		<input type="hidden" id="tags" value="<? echo $tagInputStr; ?>"/>
	</div>
	
	<div id="molecules">
		<div class="row">
			<div class="span4"><h4>Reactants</h4></div>
			<div class="span4"><h4>Solvants</h4></div>
			<div class="span4"><h4>Products</h4></div>
		</div>
		
			
	</div>
	
	<hr/>
	
	<div class="row">
		<? foreach($reactantLinks as $molType => $links){ ?>
		<div class='span4' id="<? echo $molType; ?>">
			<ul class="thumbnails">
		<?	
		if($links){
			$i = 0; 
			foreach($links as $link){ 
					$mol = find_one("molecule",array("moleculeID"=>$link['moleculeID']));
					$molName = find_one("moleculeName",array("moleculeID"=>$link['moleculeID'],"primary"=>"1"));
					if($molName)
						$molName = $molName['name'];
					else
						$molName = "No Name...";
					$mol['mol'] = str_replace("\n", '\n', $mol['mol']);
			?>
					<li  class="span4">
						<a href="#" class="thumbnail molWrapper" rel="popover" <? 
					foreach($link as $key => $value)
						echo " data-" . $key . "='" .  $value . "' ";
					 ?>  data-title="<? echo $molName; ?>">
							<script>
								var viewerIndex = viewers.push(new ChemDoodle.ViewerCanvas("<? echo $molType . "_" . $i; ?>",290,135));
								molecules.<? echo $molType . "[" . $i . "]"; ?> = ChemDoodle.readMOL("<? echo $mol['mol']; ?>");
								viewers[viewerIndex-1].loadMolecule(molecules.<? echo $molType . "[" . $i . "]"; ?>);
							</script>
						</a>
					</li>
			<?	$i++; 
				}
		}
			echo "	</ul>";
			echo "</div>";
		} ?>
	</div>
	
	<br/>
	
	<div id="mnewMol" >
		<div class="modal-header"><h4>Add Molecule</h4></div>
		<div class="row modal-body">
			<div  class="span3">
				<select id="role" >
					<option value="reactant">Reactant</option>
					<option value="product">Product</option>
					<option value="solvant">Solvant</option>
				</select>
				<textarea id="notes" placeholder="Notes..."></textarea>
				<div>
					<input type="text" name="concentration" id="concentration" placeholder="Concentration (Molarity)"/>
				</div>
				<div>
					<input type="text" name="specificRole" id="specificRole" placeholder="Role"/>
				</div>
			</div>
			<div class="span7">
				<div id="sketcher">
					<script>var sketcher = new ChemDoodle.SketcherCanvas("newMol", 500, 300, "../chemdoodle/sketcher/icons/", ChemDoodle.featureDetection.supports_touch(), true);</script>
				</div>
			</div>
		</div>
		<div class="modal-footer">
			<button id="addMol" class="btn success">Add</button>
		</div>
	</div>
	
<? javascript(array('jquery'=>false)); ?>
	<!--these four are required by the ChemDoodle Web Components library-->
	
	
	
	<script src="../lib/js/molEdit.js"></script>
	
	
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
	
		<? 
			$tagStr = '';
			if($tags){
				foreach($tags as $tag)
					$tagStr .= "'" . $tag['tag'] . "',"; 
				$tagStr = substr($tagStr,0,-1);
			}
		?>
		$("#tags").select2({tags:[<? echo $tagStr; ?>]});
		$("#tags").change(function(){
			$.ajax({
				url: "../tagReactionLink/update.php",
				type: "POST",
				data:{
					reactionID:<? echo $_GET['reactionID']; ?>,
					tags: $(this).val()
				}
			});
		});
	
		$("#addMol").click(function(){
			$(this).attr("disabled", "disabled");
			var mol = sketcher.getMolecule();
			var dotMol = ChemDoodle.writeMOL(mol);
			console.log(dotMol);
			ChemDoodle.iChemLabs.calculate(mol, ['mf', 'mw', 'miw', 'deg_unsat', 'hba', 'hbd', 'pol_miller', 'cmr', 'tpsa', 'xlogp2'], function(calculations){	
				//it would be really nice to know if we had the molecule in the db at this point to save us from the API call... later.
				ChemDoodle.iChemLabs.writeSMILES(mol,function(SMILES){
					$.ajax({
						url: "../molecule/create.php",
						type:"POST",
						data:{
							'molecule[mf]':calculations['mf'],
							'molecule[mw]':calculations['mw'],
							'molecule[miw]':calculations['miw'],
							'molecule[deg_unsat]':calculations['deg_unsat'],
							'molecule[hba]':calculations['hba'],
							'molecule[hbd]':calculations['hbd'],
							'molecule[pol_miller]':calculations['pol_miller'],
							'molecule[cmr]':calculations['cmr'],
							'molecule[tpsa]':calculations['tpsa'],
							'molecule[xlogp2]':calculations['xlogp2'],
							'molecule[mol]':dotMol,
							'molecule[SMILES]':SMILES,
							'molecule[c]':mol.getAtomCount('C'),
							'molecule[h]':mol.getAtomCount('H'),
							'molecule[o]':mol.getAtomCount('O'),
							'molecule[n]':mol.getAtomCount('N'),
							'molecule[s]':mol.getAtomCount('S'),
							'molecule[cl]':mol.getAtomCount('Cl'),
							'link[reactionID]':'<? echo $_GET['reactionID']; ?>',
							'link[role]':$("#role").val(),
							'link[notes]':$("#notes").val(),
							'link[specificRole]':$("#specificRole").val(),
							'link[concentration]':$("#concentration").val(),
							'link[paperID]':<? echo $reaction['paperID']; ?>
						},
					
					}).done(function(response){
						console.log(response);
						window.location.reload();
					});

				});
			});
			
			
		});
	</script>
<? bottom(); ?>