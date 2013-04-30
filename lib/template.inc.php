<?
function top(){
?>

<!doctype html>
<html>
<head>
	<title>Div</title>
	<link href="../bootstrap/css/bootstrap.min.css" type="text/css" rel="stylesheet"/>
	<link href="../lib/select2/select2.css" type="text/css" rel="stylesheet"/>
	<style>
		canvas.ChemDoodleWebComponent {
			border:none !important; 
		}
		#sketcher label{
			display: inline-block;
			
		}
		.span4 h4{
			padding-left: 15px;
		}
		.popover{text-align: center;}
		.popover button{
			width: 100%;
			margin-bottom: 9px;
		}
		.masterReactionTable table td{
			border-left: none !important;
			vertical-align: middle !important;
		}
	</style>
</head>
<body><br/>
	<div class="container">

<? }

function javascript($params=array('jquery'=>true)){ ?>
	</div> <!-- [/container] -->
	<? if($params['jquery'] == true){ ?>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
	<? } ?>
	<script src="../bootstrap/js/bootstrap.min.js"></script>
	<script src="../lib/select2/select2.min.js"></script>
	
<? }


function bottom(){
 ?>
</body>
</html>
 <? } ?>