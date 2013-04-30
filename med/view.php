<?

/*
This page is designed for the prototyping of new functions in the specrum class
Ideas for functions to test

getMaxima(minX,maxX) - returns an array of x y pairs cooresponding to the local maxima in a given range. If no range specified, take the whole spectra. If numbers are out of range??
getIntegration(minX,maxX) - returns the integration in a range
peakThreshold(minX,maxX,yThreshold) - "draws" a horizontal line at yThreshold. Looks for peaks that pass that threshold. Does this only for range x to max x
*/

require("../lib/main.inc.php"); 
if(isset($_GET['medID'])){
	$med = find_one("med",array("medID"=>$_GET['medID']));

?>

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
	<link rel="stylesheet" href="../chemdoodle/ChemDoodleWeb.css" type="text/css">
	<script src="../chemdoodle/ChemDoodleWeb-libs.js"></script>
	<script src="ChemDoodleWeb-unpacked.js"></script>
	<script src="http://underscorejs.org/underscore.js"></script>
	<script>
		ChemDoodle.structures.Spectrum.prototype.getPointsForRange = function(x1,x2,y1,y2){
			if(!x1)
				x1 = this.minX;
			if(!x2)
				x2 = this.maxX;
			if(!y1)
				y1 = 0;
			if(!y2)
				y2 = 100;
			return _.filter(this.data,function(point){
				return point.x >= x1 && point.x < x2 && point.y >= y1 && point.y < y2;
			});
		};
	</script>
	<?
	$specName = trim(str_replace(" ","_", $med['generic']));
		$specName = str_replace("-","_",$specName);
		$med['mol'] = str_replace("<br />", "", $med['mol']);
		$med['mol'] = str_replace("\n", '\n', $med['mol']);
	?>
		<article style="border-top: 1px solid gray; margin-top:2em; padding:2em;">
			<div>
				<a target="_blank" href="http://en.wikipedia.org/wiki/<? echo $med['generic']; ?>"><? echo $med['generic']; ?></a> - <? echo $med['ba']; ?>%
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
	

<? } ?>