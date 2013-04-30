<?
	global $mysqli;
	$mysqli = new mysqli("localhost","root","root","div");
	
	
	function connectDb(){ //from old lib... will be taken out eventually.
		return true;
	}
	
	function addValsToFieldsArray($fields,$record){
		foreach($fields as $key => &$field)
			if(isset($record[$key]))$field['value'] = $record[$key];
			
		return $fields;
	}
	
	function mysqlError($error,$query){
		echo "<div class='error'>Mysql Error:<pre>" . $error . "</pre>The query that tried to run: <pre>" . $query . "</pre></div>";
		echo "<pre>";
		var_dump(debug_backtrace());
		echo "</pre>";
	}
	
	function cleanInput($input) {
	
		$search = array(
			'@<script[^>]*?>.*?</script>@si',   // Strip out javascript
			'@<style[^>]*?>.*?</style>@siU'    // Strip style tags properly
		);
		$output = preg_replace($search, '', $input);
		$output = str_replace("“","&ldquo;",$output);
		$output = str_replace("”","&rdquo;",$output);
		$output = str_replace("‘","&lsquo;",$output);
		$output = str_replace("’","&rsquo;",$output);
		return $output;
	}
	
	function sanitize($input) {
		global $mysqli;
	    if (is_array($input)) {
	    	$output = array();
	        foreach($input as $var=>$val) {
	            $output[$var] = sanitize($val);
	        }
	    }
	    else {
	    	 $input  = cleanInput($input);
	        if (function_exists('get_magic_quotes_gpc') && get_magic_quotes_gpc()) {
	            $input = stripslashes($input);
	        }
	       
	        $output = "";
	        $output = $mysqli->real_escape_string($input);
	    }
	    return $output;
	}
	
	function handleBr($input){
		
		if(is_array($input)){
			$output = array();
			foreach($input as $var=>$val){
				if(is_array($val)){
					$output[$var] = handleBr($val);
				}else{
					$output[$var] = nl2br($val);
				}
			}
		}else{
			$output = "";
			$output = nl2br($input);
		}
		return $output;
	}
	
	//CRUD stuff follows
	
	function select_one($query){
		global $mysqli;
		if($result = $mysqli->query($query)){
			$return = $result->fetch_assoc();
			$result->free();
		}else $return = false;
		return $return;
	}
	
	function select_many($query){
		/*$resource = mysql_query($query) 
			or die(mysqlError(mysql_error(),$query));
		while($row = mysql_fetch_assoc($resource)){
			$array_keys = array_keys($row);
			$primaryField = $array_keys[0];
			$return[$row[$primaryField]] = handleBr($row);
		}
		if(isset($return)) return $return;*/
		$return = array();
		global $mysqli;
		if($result = $mysqli->query($query)){
			while($row = $result->fetch_assoc()){
				$array_keys = array_keys($row);
				$primaryField = $array_keys[0];
				$return[$row[$primaryField]] = handleBr($row);
			}
			$result->free();
		}else $return = false;
		if($return) return $return;
	}
	
	function selectConditions($conditions){
		global $mysqli;
		$query = " ";
		if(isset($conditions) && is_array($conditions)){
			foreach($conditions as $key => $value){
				$query .= "`" . $key . "` = ";
				if(is_numeric($value))
					$query .= $value . " AND ";
				else
					$query .= "'" . $mysqli->real_escape_string($value) . "' AND ";
			}
		}
		$query = substr($query,0,-4);
		return $query;
	}
	
	function find_one($table,$conditions=array(),$order=""){
		$query = "SELECT * FROM `" . $table . "`";
		$query .= "WHERE " . selectConditions($conditions);
		$query .= $order . " ;";
		$return = select_one($query);
		return $return;
	}
	
	function find_many($table,$conditions=array(),$order=""){
		$query = "SELECT * FROM `" . $table . "`";
		if($conditions){
			if(is_array($conditions))$query .= " WHERE " . selectConditions($conditions);
			if(is_string($conditions)) $query .= " WHERE " . $conditions;
		}
		$query .= $order . " ;";
		$return = select_many($query);
		return $return;	
	}
	
	function find($table,$conditions=array(),$order=""){	//for backward compatibility
		return find_many($table,$conditions,$order);
	}
	
	function insert($table,$values){
		global $mysqli;

		$query = "INSERT INTO `" . $table . "` ";
		if(is_string($values))
			$query .= $values;
		else if(is_array($values)){
			$query .= "(";
			foreach($values as $key=>$value)
				$query .= "`" . $mysqli->real_escape_string($key) . "`,";
			$query = substr($query,0,-1); 
			$query .= ") VALUES (";
			foreach($values as $key => $value){
				if($key == "password")
					$query .= "PASSWORD('" . $value . "'),";
				else if($key == "dt" && $value == "now")
					$query .= "'" . date("Y-m-d H:i:s",strtotime("now")) . "',";
				else{
					if(is_numeric($value))
						$query .= $mysqli->real_escape_string($value) . ",";
					else 
						$query .= "'" . sanitize($value) . "',";
				}
			}
			$query = substr($query,0,-1);
			$query .= ") ;";
			/*mysql_query($query) or 
				die(mysqlError(mysql_error(),$query));
			return mysql_insert_id();*/
			$mysqli->query($query);
			return $mysqli->insert_id;
		}
	}
	
	function update($table,$values,$conditions){
		global $mysqli;

		$query = "UPDATE `" . $table . "` SET ";
		foreach($values as $key => $value){
			if($key == "password")
				$query .= "`password` = PASSWORD('" . $mysqli->real_escape_string($value) . "'),";
			else if(is_numeric($value))
				$query .= "`" . $mysqli->real_escape_string($key) . "` = " . $mysqli->real_escape_string($value) . ",";
			else
				$query .= "`" . $mysqli->real_escape_string($key) . "` = '" . sanitize($value) . "',";
		}
		$query = substr($query,0,-1);
		
		if(!is_string($conditions)){
			$conditionStr = "";
			foreach($conditions as $key => $value){
			
				if($key == "password")
					$conditionStr .= "`password` = PASSWORD('" . $mysqli->real_escape_string($value) . "') AND ";
				else if(is_numeric($value))
					$conditionStr .= "`" . $mysqli->real_escape_string($key) . "` = " . $mysqli->real_escape_string($value) . " AND ";
				else
					$conditionStr .= "`" . $mysqli->real_escape_string($key) . "` = '" . sanitize($value) . "' AND ";
			}
			$conditionStr .= substr($conditionStr,0,-4);
			$conditions = $conditionStr;
		}
		
		$query .= " WHERE " . $conditions . " ;";
		$mysqli->query($query);
	}
	
	function delete($table,$conditions){
		global $mysqli;
		if(!is_string($conditions)){
			$conditionStr = "";
			foreach($conditions as $key => $value){
			
				if($key == "password")
					$conditionStr .= "`password` = PASSWORD('" . $mysqli->real_escape_string($value) . "') AND ";
				else if(is_numeric($value))
					$conditionStr .= "`" . $mysqli->real_escape_string($key) . "` = " . $mysqli->real_escape_string($value) . " AND ";
				else
					$conditionStr .= "`" . $mysqli->real_escape_string($key) . "` = '" . sanitize($value) . "' AND ";
			}
			$conditionStr .= substr($conditionStr,0,-4);
			$conditions = $conditionStr;
		}
		//mysql_query("DELETE FROM `$table` WHERE " . $conditions);
		$query = "DELETE FROM `$table` WHERE " . $conditions;
		$mysqli->query($query);
	}
?>