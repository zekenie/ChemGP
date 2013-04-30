<?
	require("../lib/main.inc.php");
	top();
	$papers = find("paper");
	
	?>
	<div class="page-header">
		<h1>Paper list
		<a class="btn" href="new.php" style="float: right;">Add Paper</a></h1>
	</div>
	<table class='table'>
		<thead>
			<tr>
				<th>Title</th>
				<th>Journal</th>
				<th>year</th>
				<th>&nbsp;</th>			
			</tr>
		</thead>
		<tbody>
	<?
	if($papers){
		foreach($papers as $paperID=>$paper){
	?>
			<tr>
				<td><? echo $paper['title']; ?></td>
				<td><? echo $paper['journal']; ?></td>
				<td><? echo $paper['year']; ?></td>
				<td><a href="view.php?paperID=<? echo $paperID; ?>">View</a></td>
			</tr>
	<?	}
	}
	echo "</tbody></table>";
	javascript();
	bottom();	?>