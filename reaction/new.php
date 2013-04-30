<?
	require("../lib/main.inc.php");
	$papers = find("paper");
	top();
?>

<select id="paperChoose">
	<option>[choose paper type]</option>
	<option value="newPaper">New Paper</option>
	<option value="oldPaper">Old Paper</option>
</select>

<form method="get" action="create.php">
	<fieldset class="newPaper">
		<legend>New Paper</legend>
		<div>
			<label for="paper[url]">url</label>
			<input type="url" name="paper[url]"/>
		</div>
		<div>
			<label for="paper[year]">year</label>
			<input type="text" name="paper[year]"/>
		</div>
		<div>
			<label for="paper[citation]">citation or descriptive text</label>
			<textarea name="paper[citation]"></textarea>
		</div>
	</fieldset>
	<fieldset class="oldPaper">
		<legend>Paper already in the system</legend>
		<div><br/>
			<select name="reaction[paperID]" class="select2">
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
	</fieldset><br/>
	
	<input class="reaction" type="text" placeholder="reaction rate" name="reaction[reactionRate]"/><br/><br/>
	<input class="reaction" type="text" placeholder="Presure (leave blank for 1atm)" name="reaction[presure]" /><br/><br/>
	<input class="reaction" type="text" placeholder="Temperature (leave blank for 25C)" name="reaction[temperature]" /><br/><br/>
	Relative to paper? <br/>
	<select class="reaction" name="reaction[relativeToPaper]">
		<option value="0">No</option>
		<option value="1">Yes</option>
	</select><br/><br/>
	
	<input class="reaction btn" type="submit" value="add"/>
</form>

<? javascript(); ?>

<script>
	$(".reaction,.oldPaper,.newPaper").hide();

	$("#paperChoose").change(function(){
		$(".oldPaper,.newPaper").hide();
		$(".reaction,." + $(this).val()).show(250);
	});
	$(".select2").select2();
	
	<? if(isset($_GET['paperID'])){ ?>
		$(".oldPaper,.reaction").show();
		$(".select2").val("<? echo $_GET['paperID']; ?>");
	<? } ?>
</script>

<? bottom(); ?>