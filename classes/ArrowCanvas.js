(function(c) {

	c.ArrowCanvas = function(id,width,height){
		this.create(id, width, height);
		this.selected = null;
		return true;		
	}
	c.ArrowCanvas.prototype = new c._Canvas();
	c.ArrowCanvas.prototype.addLonePairs =  function(){
		for(var i = 0, ii = this.molecule.atoms.length; i<ii; i++){
			var element = c.ELEMENT[this.molecule.atoms[i].label];
			this.molecule.atoms[i].numLonePair = (this.molecule.atoms[i].charge * -1) + element.lonePairs;
		}
		this.repaint();
	};
	c.ArrowCanvas.prototype.click = function(e){
		var min = Infinity;
		for(var i = 0, ii = this.molecule.atoms.length; i<ii; i++){
			var dist = e.p.distance(this.molecule.atoms[i]);
			if (dist < this.specs.bondLength && dist < min) {
				min = dist;
				this.selected = this.molecule.atoms[i];
				this.repaint();
			}
		}
		for(var i = 0, ii = this.molecule.bonds.length; i<ii; i++){
			
			var dist = e.p.distance(this.molecule.bonds[i].getCenter());
			if (dist < this.specs.bondLength && dist < min) {
				min = dist;
				this.selected = this.molecule.bonds[i];
				this.selected.center = this.selected.getCenter();
				this.selected.x = this.selected.center.x;
				this.selected.y = this.selected.center.y;			
				this.repaint();
			}
		}
		console.log(this.selected);	
	};
	c.ArrowCanvas.prototype.drawChildExtras = function(ctx){
		if(this.selected !== null){
			ctx.beginPath();
			ctx.fillStyle="green";
			ctx.arc(this.selected.x, this.selected.y, 3, 0, Math.PI * 2, false);
			ctx.fill();
		}
	}
	
})(ChemDoodle);