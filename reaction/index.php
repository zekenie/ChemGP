<? 	require("../lib/main.inc.php"); top();?>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
<link href="http://handsontable.com/jquery.handsontable.css" rel="stylesheet"/>
<script src="http://handsontable.com/jquery.handsontable.js"></script>
<style>path.line {
  fill: none;
  stroke: #666;
  stroke-width: 1px;
}
path {
    stroke: black;
    stroke-width: 2;
    fill: none;
}
 
line {
    stroke: black;
}

path.area {
  fill: #e7e7e7;
}

.axis {
  shape-rendering: crispEdges;
}

.x.axis line {
  stroke: #fff;
}

.x.axis .minor {
  stroke-opacity: .5;
}

.x.axis path {
  display: none;
}

.y.axis line, .y.axis path {
  fill: none;
  stroke: #000;
}

svg { padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 80px;}
 #bestProgram{word-wrap: break-word;font-size:0.7em; height: 200px; overflow-y:scroll;}
 #currentGen{
	 position:fixed;
	 top:60px;
	 left: 60px;
	 padding:2em;
	 font-size:1.5em;
 }
 #errorChart,#sizeChart{height: 215px;}
</style>
<script src="http://underscorejs.org/underscore.js"></script>
<script src="https://raw.github.com/mbostock/d3/master/d3.v2.min.js"></script>

<div id="dataTbl"></div>

<div>
	Popsize: <input type="text" id="popSize" />
	Stop at: <input id="stopAt" type="text"/>
	<button class="btn" id="evolve">Evolve</button>
</div>
<div id="currentGen" class="well"></div>
<div id="bestProgram" class="well">Best program:</div>

<div style="margin: 2em;" id="errorChart"></div>
<div style="margin: 2em;" id="sizeChart"></div>

<script>
function chart(config) {
        
    // set default options
    var defaultOptions = {
        selector: '#chartZone',
        class: 'chart',
        id: null,
        data: [0],
        type: 'column', 
        width: 900,
        height: 200,
        callback: null,
        interpolate: 'monotone'
    };
    
    // fill in unspecified settings in the config with the defaults
    this.settings = $.extend(defaultOptions, config);
    this.svg = d3.select(this.settings.selector) // create the main svg container
            .append("svg")
            .attr("width",this.w)
            .attr("height",this.h);
    
}

chart.prototype.draw = function () { // generate chart with this function        
        
         this.w = this.settings.width,
            this.h = this.settings.height,
            this.barPadding = 0,
            this.scale = 10,
            this.max = d3.max(this.settings.data);
        
         

         this.y = d3.scale.linear().range([this.h,0]),
            this.yAxis = d3.svg.axis().scale(this.y).ticks(5).orient("left"),
            this.x = d3.scale.linear().range([0, this.w]);

        this.y.domain([0, this.max]).nice();
        this.x.domain([0, this.settings.data.length]).nice();

         this.rect = this.svg.selectAll("rect")
           .data(this.settings.data, function(d,i) {return i;});

        var innerThis = this;
        this.rect.enter().append("rect")
           .attr("x", function(d,i) {return innerThis.x(i);})
           .attr("y", function(d,i) {return innerThis.y(d);})
           .attr("width", this.w / this.settings.data.length - this.barPadding)
           .attr("height", function(d) {return innerThis.h - innerThis.y(d);})
           .attr("fill", "rgb(90,90,90)");
                      
        this.svg.append("svg:g")
           .attr("class", "y axis")
           //.attr("transform", "translate(-4,0)")
           .call(this.yAxis);        
                   


    
       // setInterval(function(){addData(Math.round(Math.random() * 30));},2000);
      }

chart.prototype.addData = function(_y) {
            var newData = [];
                        
            newData = this.settings.data;
            newData.push(_y);
            
            this.settings.data = newData;
            newMax = d3.max(newData);
            
            this.y.domain([0, newMax]).nice();
            this.x.domain([0, newData.length]).nice();  
            
            var t = this.svg.transition().duration(0);
            
            t.select(".y.axis").call(this.yAxis);
            
            this.svg.selectAll("rect").attr("fill", "rgb(100,100,100)");
            var newrect = this.svg.selectAll("rect")
                .data(newData, function(d,i) {return i;});
            var innerThis = this;

            console.log(newData);
            newrect.enter().append("rect")
               .attr("fill", "rgb(0,100,0)");               
            newrect.transition().duration(0)
               .attr("x", function(d,i) {return innerThis.x(i);})
               .attr("y", function(d,i) {return innerThis.y(d);})
               .attr("width", this.w / newData.length - this.barPadding)
               .attr("height", function(d) {return innerThis.h - innerThis.y(d);});
            newrect.exit()
                .attr("fill", "rgb(100,0,0)")
              .transition().duration(750)
                .style("fill-opacity",1e-6)
                .remove();
        }

var errorChart = new chart({selector:"#errorChart"});
var sizeChart = new chart({selector:"#sizeChart"}); 
errorChart.draw();
sizeChart.draw();
<?

	$paramNameMap = array(
		"cmr" 			=> "Molar Refractivitys",
		"deg_unsat" 	=> "Degree of Unsaturation",
		"hba"			=> "Hydrogen Bond Acceptors",
		"hbd"			=> "Hydrogen Bond Donors",
		"mw"			=> "Molecular Weight",
		"pol_miller"	=> "pol_miller",
		"tpsa"			=> "Total Polar Surface Area",
		"xlogp2"		=> "LogP",
		"c"=>"c",
		"h"=>"h",
		"o"=>"o",
		"n"=>"n",
		"s"=>"s",
		"cl"=>"cl",
	);
	$paramNameMap = array_keys($paramNameMap);
	$terminalStr = "var terminals = [";

	foreach(array("product","diene","dieneophile","solvant") as $molType){
		foreach($paramNameMap as $param)
			$terminalStr .= "'" . $molType . "_" . $param . "',";
	}
		$terminalStr .= "'temperature'];";
		echo $terminalStr;

	$reactions = find("reaction",$_GET);
	echo "var targetData = [";
	$i = 0;
	foreach($reactions as $reactionID=>$reaction){
		if($reaction['temperature'] == "")
			$reaction['temperature'] = 25;
		echo "[";
		$moleculeReactionLinks = find("moleculeReactionLink",array("reactionID"=>$reactionID),"ORDER BY  `role` ,  `specificRole` ");
		foreach($moleculeReactionLinks as $moleculeReactionLink){
			$molecule = find_one("molecule",array("moleculeID"=>$moleculeReactionLink['moleculeID']));
			foreach($paramNameMap as $param)
				echo $molecule[$param] . ",";
		}
		echo $reaction['temperature'] . ",";
		echo $reaction['reactionRate'];
		echo "]";
		if($i < sizeof($reactions)-1)
			echo ",";
		$i++;
	}
	echo "]"; ?>
	
	var gridData = [];
	gridData.push(terminals);
	for(var i = 0,ii = targetData.length; i<ii; i++){
		gridData.push(targetData[i]);
	}
	
	var $container = $("#dataTbl");
	$container.handsontable({
	  data: gridData,
	  startRows: 100,
	  startCols: 75,
	  colHeaders: true,
	  minSpareRows: 1
	});
<?		
	/*foreach($reactions as $reactionID => &$reaction){
		foreach(array("reactant","solvant","product") as  $molType){
			$reaction[$molType] = array();
			$moleculeReactionLinks = find("moleculeReactionLink",array("reactionID"=>$reactionID,"role"=>$molType));
			foreach($moleculeReactionLinks as $moleculeReactionLink)
				//this doesn't get concentration... other think factors!!
				array_push($reaction[$molType], find_one("molecule",array("moleculeID"=>$moleculeReactionLink['moleculeID'])));
		}
	}
	echo json_encode($reactions);*/
?>
</script>
<script src="multiX.js"></script>
</div>
<? bottom(); ?>