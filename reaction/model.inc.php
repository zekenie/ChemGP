<?

function dispReactions($reactions,$params=array()){
	echo "<script>var reactions = [];</script>";
?>
	<table class='table table-bordered masterReactionTable'>
		<thead>
			<tr>
				<th>Reaction</th>
				<th>Temperature</th>
				<th>Presure</th>
				<th>Rate</th>
				<th>&nbsp;</th>
			</tr>
		</thead>
		<tbody>
	
<?
	$i = 0;
	foreach($reactions as $reactionID=>$reaction){
		$reactantLinks = array();
		foreach(array("reactant","solvant","product") as $molType)
			$reactantLinks[$molType] = find("moleculeReactionLink",array('reactionID'=>$reaction['reactionID'],'role'=>$molType	));
?>
			<tr><td>
			<script>
			reactions[<? echo $i; ?>] = {
				reactant:[],
				solvant: [],
				product: [],
				layout: new ChemDoodle.SimpleReactionLayout("<? echo 'reaction' . $i; ?>")
			};
			<? 
			foreach($reactantLinks as $molType => $reactantLink){ 
				if(sizeof($reactantLink) != 0){
					foreach($reactantLink as $moleculeReactionLink){
						$molecule = find_one("molecule",array("moleculeID"=>$moleculeReactionLink['moleculeID']));
						$molecule['mol'] = str_replace("\n", '\n', $molecule['mol']);
				?>
					reactions[<? echo $i; ?>].<? echo $molType; ?>.push(ChemDoodle.readMOL("<? echo $molecule['mol']; ?>"));
					
					<? 
					if($molType != "solvant"){
						if($molType == "product"){ ?>
							reactions[<? echo $i; ?>].layout.addProduct(
						<? }else if($molType == "reactant"){ ?>
							reactions[<? echo $i; ?>].layout.addReactant(
						<? } ?>
							reactions[<? echo $i; ?>].<? echo $molType; ?>[reactions[<? echo $i; ?>].<? echo $molType; ?>.length - 1]
							);	
					<?  }
					}
				}
			} ?>
			  reactions[<? echo $i; ?>].layout.layout();</script></td>
			  	<td><? echo $reaction['temperature']; ?></td>
			  	<td><? echo $reaction['presure']; ?></td>
			  	<td>
			  		<? 
			  		echo $reaction['reactionRate']; 
			  		if($reaction['relativeToPaper'] == "1")
			  			echo "<sup>*</sup>";
			  		?>
			  	</td>
			  	<td><a href="../reaction/view.php?reactionID=<? echo $reaction['reactionID']; ?>" class="btn"><i class="icon icon-pencil"></i></a></td>
			</tr>
<?
		$i++;
	}
	echo "</tbody></table>";
}

?>