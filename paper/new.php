<?
	require("../lib/main.inc.php");
	top();
?>
<div class="page-header">
		<h1>New Paper</h1>
	</div>
<form method="get" action="create.php">
	<div>
		<label for="paper[title]">Title</label>
		<input autofocus="true" type="text" name="paper[title]"/>
	</div>
	<div>
		<label for="paper[journal]">Journal</label>
		<input type="text" name="paper[journal]"/>
	</div>
	<div>
		<label for="paper[year]">Year</label>
		<input type="text" name="paper[year]"/>
	</div>
	<div>
		<label for="paper[voluem]">Volume</label>
		<input type="text" name="paper[volume]"/>
	</div>
	<div>
		<label for="paper[issue]">Issue</label>
		<input type="text" name="paper[issue]"/>
	</div>
	<div>
		<label for="paper[pages]">Pages</label>
		<input type="text" name="paper[pages]"/>
	</div>
	<div>
		<label for="paper[abstract]">Abstract</label>
		<textarea name="paper[abstract]"></textarea>
	</div>
	<div>
		<label for="paper[authors]">Authors</label>
		<textarea name="paper[authors]"></textarea>
	</div>
	<div>
		<label for="paper[url]">URL</label>
		<input type="url" name="paper[url]"/>
	</div>
	<div>
		<label for="paper[citation]">Citation</label>
		<textarea name="paper[citation]"></textarea>
	</div>
	<div>
		<button type="submit" class="btn">Add</button>
	</div>
</form>

<? javascript(); 
	bottom(); ?>