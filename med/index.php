
<?

require("../lib/main.inc.php");
if(!isset($_GET['page']))
	$_GET['page'] = 0;
$count = $mysqli -> query("SELECT `medID` FROM `med`");
$count = $count->num_rows;
$numPages = $count / 20; // the number of drugs / 20 drugs per page.

$counterOutput = "";
for($i = 0; $i <= $numPages-1; $i++){
	$style = "";
	if($i == $_GET['page'])
		$style = "style='font-weight:bold;'";
	$counterOutput .= "<a " . $style. " href='index.php?page=" . $i . "'>" . ($i + 1) . "</a> | ";
}
$counterOutput = substr($counterOutput, 0,-3);
echo $counterOutput;
?>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<link rel="stylesheet" href="../chemdoodle/ChemDoodleWeb.css" type="text/css">
<script src="../chemdoodle/ChemDoodleWeb-libs.js"></script>
<script src="ChemDoodleWeb-unpacked.js"></script>

<?
$min = $_GET['page'] * 20 ;
//$max = $min + 20;
$meds = find("med",""," ORDER BY `medID` LIMIT " . $min . ", 20  " );
if($meds){
	foreach($meds as $med){
		$specName = trim(str_replace(" ","_", $med['generic']));
		$specName = str_replace("-","_",$specName);
		$med['mol'] = str_replace("<br />", "", $med['mol']);
		$med['mol'] = str_replace("\n", '\n', $med['mol']);
	?>
		<article style="border-top: 1px solid gray; margin-top:2em; padding:2em;">
			<div>
				<a target="_blank" href="http://en.wikipedia.org/wiki/<? echo $med['generic']; ?>"><? echo $med['generic']; ?></a> - <? echo $med['ba']; ?>% - <a href="view.php?medID=<? echo $med['medID']; ?>">View</a>
			</div>
			<script>
					var <? echo  $specName; ?>molecule = ChemDoodle.readMOL("<? echo $med['mol']; ?>");
					var <? echo  $specName; ?>viewer = new ChemDoodle.ViewerCanvas("<? echo  $specName; ?>moleculeViewer",280,200);
					<? echo  $specName; ?>viewer.loadMolecule(<? echo  $specName; ?>molecule);
				</script>
			<script>
				var <? echo $specName; ?>_raw = <? echo $med['h']; ?>;
			  var <? echo  $specName; ?>_protonNMR = new ChemDoodle.PerspectiveCanvas('protonNMR_<? echo  $specName; ?>', 460, 200);
			  <? echo  $specName; ?>_protonNMR.specs.plots_showYAxis = true;
			  <? echo  $specName; ?>_protonNMR.specs.plots_flipXAxis = true;
			  <? echo  $specName; ?>_protonNMR.specs.backgroundColor = '#FFFBC9';
			  var <? echo $specName; ?>_spec = new ChemDoodle.structures.Spectrum();
			  <? echo $specName; ?>_spec.data = <? echo $specName; ?>_raw.data;
			  <? echo $specName; ?>_spec.title = "1H";
			  <? echo $specName; ?>_spec.setup();
			  <? echo  $specName; ?>_protonNMR.loadSpectrum(<? echo $specName; ?>_spec);
			  <? echo  $specName; ?>_protonNMR.repaint();
			</script>
			<? if($med['c13']){ ?>
			<script>
				var <? echo $specName; ?>_craw = <? echo $med['c13']; ?>;
			  var <? echo  $specName; ?>_carbonNMR = new ChemDoodle.PerspectiveCanvas('carbonNMR_<? echo  $specName; ?>', 460, 200);
			  <? echo  $specName; ?>_carbonNMR.specs.plots_showYAxis = true;
			  <? echo  $specName; ?>_carbonNMR.specs.plots_flipXAxis = true;
			  <? echo  $specName; ?>_carbonNMR.specs.backgroundColor = '#FFFBC9';
			  var <? echo $specName; ?>_cspec = new ChemDoodle.structures.Spectrum();
			  <? echo $specName; ?>_cspec.data = <? echo $specName; ?>_craw.data;
			  <? echo $specName; ?>_cspec.title = "13C";
			  <? echo $specName; ?>_cspec.setup();
			  <? echo  $specName; ?>_carbonNMR.loadSpectrum(<? echo $specName; ?>_cspec);
			  <? echo  $specName; ?>_carbonNMR.repaint();
			</script>
			<? } ?>
		</article>
	<?

	}
	echo $counterOutput;
}else
	echo "No matches for query.";
?>