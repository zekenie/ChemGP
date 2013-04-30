var terminalProbability = 0.5,
	variableVsConstant = 0.5,
	stopAt = 100,
	bestProgram,
	popsize = 100
	stop = false;
	
	var bestError = null;
	var generations = [];
	
	$("#evolve").click(function(){
		stopAt  = $("#stopAt").val();
		popsize = $("#popSize").val();
		evolve();
	});

//var targetData = _.map(_.range(-1.0,1.0,0.1),function(x){return x + 1 + (x*x) });

var Xs = [];
var Ys = [];

//var terminals = ["x"];

_.each(targetData,function(r){
	Xs.push(_.initial(r));
	Ys.push(_.last(r));
});

Ys = _.map(Ys,function(y){ return y * 100000});

function sum(){
	return _.reduce(arguments,function(memo,x){ return x+memo; });
}
function subtract(){
	return _.reduce(arguments,function(memo,x){ return x-memo; });
}
function mult(){
	return _.reduce(arguments,function(memo,x){ return x * memo; });
}
function sin(){
	return Math.sin(arguments[0]);
}

function pd(){
	var a  = arguments;
	var numerator = _.first(a),
		denominator = a[1];
	if(denominator == 0 || denominator === null || denominator == NaN)
		denominator = 1;
	return numerator / denominator;
}

_.mixin({
	randNth:function(a){
		return a[_.random(a.length-1)];
	},
	getIndexes:function(needle,haystack){
		var output = [];
		_.each(haystack,function(letter,key){
			if(letter === needle)
				output.push(key);
		});
		return output;
	}
});

var functionTable = {
		mult:2,
		sum:2,
		subtract:2,
		pd:2//,
		//sin:1
	};



var randomFunction = function(){
	return _.randNth(_.keys(functionTable));
}

var randomTerminal = function(){
	// could be modified for multiple terminals
	if(Math.random() < variableVsConstant){
		return _.randNth(terminals);
	}
	return (Math.random() * 10) - 5;
}

var randomCode = function(depth){

	if(depth == 0 || Math.random() < terminalProbability)
		return randomTerminal();
	else{
			var fn = randomFunction(),
				innerCode = ""
				numParams = functionTable[fn];
				_.each(_.range(numParams),function(){
					innerCode += randomCode(depth-1) + ",";
				});
				innerCode = innerCode.slice(0,-1);
			return fn + "(" + innerCode + ")";
	}
}

var _eval = function(code){
	var terminalStr = "";
	_.each(terminals,function(t){terminalStr += t + ",";});
	terminalStr = terminalStr.slice(0,-1);
	code = "function(" + terminalStr + "){ return  " + code + "; }";
	return eval('_.map(Xs,function(reaction){return (' + code + ').apply(this,reaction)});');
}

var error = function(individual){
	var indSeq = _eval(individual);
	return _.reduce(
				_.map(Ys,function(val,key){
					return Math.abs(val - indSeq[key]);
				}),
				function(memo,x){return x+memo;}
			);
}

function codeSize(code){
	//return 1 + ((code.split("(").length - 1) * 2)
	return _.getIndexes("(",code).length;
}

function atIndex(treeStr,point){
	var startParen = _.getIndexes("(",treeStr)[point],
		i = startParen + 1,
		endParen = null,
		numComma = null;

	for(var parenCount=0; parenCount >= 0;i++){
		if(parenCount === 0 && treeStr[i] === ",")
			numComma++;
		if(treeStr[i] === "(")
			parenCount++;
		if(treeStr[i] === ")")
			parenCount--;
		if(parenCount === 0)
			endParen = i;
	}
	var numExp = numComma+1;
	return [startParen,endParen,numExp];
}

function mutate(i){
	var size = codeSize(i);
	if(size > 0){
		var indexes = atIndex(i,_.random(size-1));
		var newInd = i.slice(0,indexes[0]+1);
		_.each(_.range(indexes[2]),function(){
			newInd += randomCode(_.random(1,2)) + ",";
		});
		newInd = newInd.slice(0,-1);
		newInd += i.slice(indexes[1]+1,i.length);
		return newInd;
	}else	//if its a terminal, you can just make a new one.
		return randomCode(2);
}

function crossover(i,j){
	var sizeI = codeSize(i),
		sizeJ = codeSize(j);
	if(sizeI > 0 && sizeJ > 0){	
		var	partI = atIndex(i,_.random(codeSize(i)-1)),
			partJ = atIndex(j,_.random(codeSize(j)-1)),
			newInd = i.slice(0,partI[0]+1);
			newInd += j.slice(partJ[0]+1,partJ[1]+1);
			newInd += i.slice(partI[1]+1,i.length);
		return newInd;
	}else{
		return i;
	}
}

function select(population,tournamentSize){
	var size = population.length;
	var toReturn = _.min(_.map(_.range(tournamentSize),function(){return _.random(size)}));
	return population[toReturn].program;
}

function makeGens(gen,genPop){
	
	if(gen > stopAt){
		return;
	}
	
	generations[gen] = [];
	if(!genPop){
		_.each(_.range(popsize),function(){
			var ind = randomCode(4);
			var _error = error(ind);
			generations[gen].push({program:ind,error:_error,size:codeSize(ind)});
			
		});
	}else{
		_.each(genPop,function(ind){
			var _error = error(ind);
			_error = _error + (2 * codeSize(ind));
			generations[gen].push({program:ind,error:_error,size:codeSize(ind)});
		});
	}
	generations[gen] = generations[gen].sort(function(a,b){return a.error-b.error});
	
	var best = generations[gen][0];
	
	console.log("=============");
	console.log("Generation: " + gen);
	console.log("Best: " + best.program);
	console.log("Best size: " + best.size);
	console.log("Best Error: " + best.error);
	bestProgram = best.program;
	
//	bestError = generations[gen][0].error;
	
		var nextGen = [];
		_.times(popsize/2,function(){
			nextGen.push(mutate(select(generations[gen],7)));
		});
		_.times(popsize/2,function(){
			nextGen.push(crossover(select(generations[gen],7),select(generations[gen],7)))
		});
		_.times(popsize/8,function(){
			nextGen.push(select(generations[gen],7));
		})
		setTimeout(function(){
			errorChart.addData(best.error);
			sizeChart.addData(best.size);
			document.querySelector("#currentGen").innerHTML = gen;
			document.querySelector("#bestProgram").innerHTML = bestProgram;
			document.querySelector("#bestProgram").offsetWidth;
			makeGens(gen+1,nextGen);
		},75);
	
		
	}

function evolve(){
	
	console.log("starting evolution.....");
	
	
	
	makeGens(0);
}
