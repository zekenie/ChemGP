<?	require("../lib/main.inc.php");
	require("model.inc.php");
	require("../reaction/model.inc.php");
	$conditions = array("moleculeID"=>$_GET['moleculeID']);
	$molecule = find_one("molecule",$conditions);
	$moleculeReactionLinks = find("moleculeReactionLink",$conditions);
	$moleculeNames = find("moleculeName",$conditions);
	$molecule['mol'] = str_replace("\n", '\n', $molecule['mol']);
	
	$reactions = array();
	foreach($moleculeReactionLinks as $moleculeReactionLink)
		array_push($reactions, find_one("reaction",array("reactionID"=>$moleculeReactionLink['reactionID'])));
	
	top();

	
?>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
	<link rel="stylesheet" href="../chemdoodle/ChemDoodleWeb.css" type="text/css">
	<script src="../chemdoodle/ChemDoodleWeb-libs.js"></script>
	<script src="../chemdoodle/ChemDoodleWeb.js"></script>
	<style>
	#names div{
		margin-bottom:1em;
	}
	.primaryName{
		font-weight: bold;
		color: #48b968;
	}
	</style>
	<div>
		<div class="thumbnail" style="display: inline-block;width: 290px;">
			<script>
				var molecule = ChemDoodle.readMOL("<? echo $molecule['mol']; ?>");
				var viewer = new ChemDoodle.ViewerCanvas("moleculeViewer",290,135);
				viewer.loadMolecule(molecule);
			</script>
		</div>

	</div>
	
	<section>
		<div class="page-header">
			<h3>Properties
			<a style="float: right;" class="btn">Recalculate</a></h3>
		</div>
		<div class="row">
			<div class="span6">
				<table class="table table-bordered">
					<tbody>
						<? foreach($molecule as $molProp=>$val){ 
								if(isset($paramNameMap[$molProp]))
									echo "<tr><td>" . $paramNameMap[$molProp] . "</td><td>$val</td></tr>";
						 } ?>
					</tbody>
				</table>
			</div>
			<div class="span6 thumbnail" style="margin-left: 10px;">
				<script>
					var transformBallAndStick = new ChemDoodle.TransformCanvas3D('transformBallAndStick',440,380);
					 //transformBallAndStick.specs.atoms_useJMOLColors = true;
					 transformBallAndStick.specs.set3DRepresentation('Ball and Stick');
					 transformBallAndStick.specs.backgroundColor = 'white';
					ChemDoodle.iChemLabs.optimize(molecule,3,function(newMol){
						 transformBallAndStick.loadMolecule(newMol);
					});
				
				 
				</script>
			</div>
		</div>
	</section>
	<section>
		<div class="page-header">
			<h3>Reactions</h3>
		</div>
		<?
			dispReactions($reactions);
		?>
	</section>
	<section>
		<div class="page-header">
			<h3>Names
				<a href="../moleculeName/new.php" class="btn" style="float: right;">Add Custom</a>
				<a href="../moleculeName/create.php?fromServer=true&moleculeID=<? echo $_GET['moleculeID']; ?>&redirect=../molecule/view.php?moleculeID=<? echo $_GET['moleculeID']; ?>" class="btn" style="float: right; margin-right: 5px;">Recompute Names</a> 
			</h3>
		</div>
		<div id="names">
				<? if($moleculeNames){
					foreach($moleculeNames as $moleculeName) { ?>
						<div>
							<a class="btn btn-mini nameDelete" data-moleculeNameID="<? echo $moleculeName['moleculeNameID']; ?>">x</a>
							<a class="btn btn-mini makePrimary" data-moleculeNameID="<? echo $moleculeName['moleculeNameID']; ?>">p</a>
							<span <? if($moleculeName['primary'] == "1") echo "class='primaryName'"; ?>><? echo $moleculeName['name']; ?></span>
							
						</div>
					<? }} ?>
		</div>
	</section>
<?
	javascript(array('jquery'=>false)); ?>
	<script>
		$(".nameDelete").click(function(){
			var mThis = $(this);
			if(confirm("Are you sure you want to remove this name?"))
				$.get("../moleculeName/delete.php","moleculeNameID=" + mThis.attr("data-moleculeNameID"),function(){ mThis.parent("div").hide(500); });
		});
		$(".makePrimary").click(function(){
			var mThis = $(this);
			$.get("../moleculeName/update.php","moleculeNameID=" + mThis.attr("data-moleculeNameID") + "&moleculeName[primary]=1",function(){
				$(".primaryName").removeClass("primaryName");
				mThis.siblings("span").addClass("primaryName");
			});
		});
	</script>	
<?	bottom();
?>