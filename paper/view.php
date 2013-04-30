<?
	require("../lib/main.inc.php");
	require("../reaction/model.inc.php");
	require("model.inc.php");
	top();
	$conditions = array('paperID'=>$_GET['paperID']);
	$paper = find_one("paper",$conditions);
	$paper['shortName'] = getShortName($paper);
	$reactions = find("reaction",$conditions);
?>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
	<link rel="stylesheet" href="../chemdoodle/ChemDoodleWeb.css" type="text/css">
	<script src="../chemdoodle/ChemDoodleWeb-libs.js"></script>
	<script src="../chemdoodle/ChemDoodleWeb.js"></script>
	
	<ul class="breadcrumb">
		<li><a href="../paper/">Papers</a> <span class="divider">/</li>
		<li><? echo $paper['shortName']; ?></li>
		<li style='float: right;'><a id="showPaperDetails">Show paper details</a></li>
	</ul>
	
	<div class="well hide" id="paperDetails">
		<? foreach($paper as $key=>$val)
			echo $key . ": " . $val . "<br/>"; ?>
			Number of reactions entered: <? echo sizeof($reactions); ?>
	</div>
<?
	if($reactions)
		dispReactions($reactions);
?>
	<a href="../reaction/new.php?paperID=<? echo $_GET['paperID']; ?>" class="btn">+</a>
	<span style="float: right;">* denotes relative reaction rate</span>
<?
	javascript(array('jquery'=>false));
?>
	<script>
		$("#showPaperDetails").click(function(){
			$("#paperDetails").toggle(400);
		});
	</script>
<?
bottom(); ?>