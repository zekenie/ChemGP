<?	require("../lib/main.inc.php");
	$molecules = find("molecule");
	$papers = find("paper");
	top();
?>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
	<link rel="stylesheet" href="../chemdoodle/ChemDoodleWeb.css" type="text/css">
	<script src="../chemdoodle/ChemDoodleWeb-libs.js"></script>
	<script src="../chemdoodle/ChemDoodleWeb.js"></script>
	<style>
		.btn{
			margin-bottom: 0.5em;
		}
	</style>
	<script>
		var viewers = [],
			molecules = [];
	</script>
	
	<div class="page-header">
		<h1>
			All Molecules <small>(<? echo sizeof($molecules); ?>)</small>
			
		</h1>
		<select id="filterPaper" style="float: right;">
				<option>[Filter by Paper]</option>
				<? 
					foreach($papers as $paperID=>$paper){ 
						$authors = $paper['authors'];
						if(strlen($authors) > 35)
							$authors = substr($authors, 0, 36) . "...";
				?>
						<option value="<? echo $paperID; ?>"><? echo  $paper['year'] . " " . $authors; ?></option>
				<? } ?>
			</select>
	</div>
	
	<table class="table table-bordered">
		<thead>
			<tr>
				<th>MoleculeID</th>
				<th>Molecule</th>
				<th># Names</th>
				<th># Reactions</th>
				<th>&nbsp;</th>
			</tr>
		</thead>
		<tbody>
			<?
			$i = 0;
			foreach($molecules as $moleculeID=>$molecule){
				$conditions = array("moleculeID"=>$moleculeID);
				$molecule['moleculeReactionLinks'] = find("moleculeReactionLink",$conditions);
				$molecule['names'] = find("moleculeName",$conditions);
				$molecule['reactions'] = find('moleculeReactionLink',$conditions);
				$molecule['mol'] = str_replace("\n", '\n', $molecule['mol']);
				echo "<tr class='moleculeRow ";
					if($molecule['moleculeReactionLinks'])
						foreach($molecule['moleculeReactionLinks'] as $moleculeReactionID=>$moleculeReactionLink)
							echo "paper" . $moleculeReactionLink['paperID'] . " ";
				echo "'>";
			?>
			
				<td><? echo $moleculeID; ?></td>
				<td>
					<script>
						var viewerI = viewers.push(new ChemDoodle.ViewerCanvas("viewer<? echo $i; ?>",290,135)),
							moleculeI = molecules.push(ChemDoodle.readMOL("<? echo $molecule['mol']; ?>"));
						
						viewers[viewerI-1].loadMolecule(molecules[moleculeI-1]);
					</script><br/>
					<small><? echo $molecule['SMILES']; ?></small>
				</td>
				<td><? echo sizeof($molecule['names']); ?></td>
				<td><? echo sizeof($molecule['reactions']); ?></td>
				<td>
					<button class="btn optomizeMol btn-mini" data-molI="<? echo $i; ?>" data-moleculeID="<? echo $moleculeID; ?>">Optomize</button>
					<button class="btn deleteMol btn-danger btn-mini" data-numReactions="<? echo sizeof($molecule['reactions']); ?>" data-moleculeID="<? echo $moleculeID; ?>">
						<i class="icon icon-trash"></i>
					</button><br/>
					<a href="view.php?moleculeID=<? echo $moleculeID; ?>" class="btn btn-mini">View</a>
				</td>
			</tr>
			<?
				$i++; 
			} ?>
		</tbody>
	</table>
<?
	javascript(array('jquery'=>false));
	?>
	<script>
		var filter = "";
		<?
			if(isset($_GET['filter'])){
				echo "filter = '" . $_GET['filter'] . "';";
				echo "$('.moleculeRow').hide();";
				echo "$(filter).show();";
			}
		?>
	
		$("#filterPaper")	.select2()
							.change(function(){
								filter = ".paper" + $(this).val();
								$(".moleculeRow").hide(150);
								$(filter).show(175);
							});
	
		$(".deleteMol").click(function(){
			var mThis = $(this);
			if(mThis.attr("data-numReactions") === "0"){
				if(confirm("Are you sure you want to remove this molecule?"))
					window.location="delete.php?moleculeID=" + mThis.attr("data-moleculeID");
			}else{
				alert("You can't delete a molecule that's in reactions. Remove the reaction links and try again");
			}
		});
		$(".optomizeMol").click(function(){
			var mThis = $(this);
			var thisMol = molecules[parseInt(mThis.attr("data-molI"))]
			ChemDoodle.iChemLabs.optimize(thisMol,2,function(){
				ChemDoodle.iChemLabs.writeSMILES(thisMol,function(SMILES){
					$.ajax({
						url:"update.php",
						data:{
							moleculeID: mThis.attr('data-moleculeID'),
							"molecule[SMILES]":SMILES,
							"molecule[mol]":ChemDoodle.writeMOL(thisMol)
						},
						type:"POST"
					}).done(function(cb){
						var redir = "index.php";
						if(filter !== "")
							redir += "?" + filter;
						window.location  = redir;
					});
				});
			});
		});
	</script>
	<?
	bottom();
?>