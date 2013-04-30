<?	error_reporting(E_ALL);

ini_set('display_errors', '1');
	require("../lib/template.inc.php");
	require("../lib/mysql.inc.php");
	function redirect($url){
	?>
		<script type="text/javascript">window.location = "<? echo $url; ?>";</script>
	<?
		exit;
	}	
?>