<?
	require("../lib/main.inc.php");
	top();
?>
	<input type="hidden" id="e12" style="width:300px" value="brown, red, green"/>
<?
	javascript();
?>
	<script>
		$("#e12").select2({tags:["red", "green", "blue"]});
		$("#e12").change(function(cb){
			console.log(cb);
			console.log($(this).val());
		});
	</script>
<?
	bottom();
?>