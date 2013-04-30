ChemDoodle.ReactionStep = (function() {

	var p = {};

	p.actions = {};
	p.gui = {};
	p.states = {};
	p.gui.desktop = {};
	p.gui.mobile = {};
	return p;

})();

(function(actions) {

	actions._Action = function() {
		this.forward = function(ReactionStep) {
			this.innerForward();
			this.checks(ReactionStep);
		};
		this.reverse = function(ReactionStep) {
			this.innerReverse();
			this.checks(ReactionStep);
		};
		this.checks = function(ReactionStep) {
			//ReactionStep.molecule.check();
			for(var i=0,ii = ReactionStep.molecules.length; i<ii;i++)
				molecules[i].check();
			ReactionStep.repaint();
		};
		return true;
	};

})(ChemDoodle.ReactionStep.actions);

(function(actions, inArray) {

	actions.AddAction = function(mol, as, bs) {
		this.mol = mol;
		this.as = as;
		this.bs = bs;
		return true;
	};
	actions.AddAction.prototype = new actions._Action();
	actions.AddAction.prototype.innerForward = function() {
		if (this.as != null) {
			for ( var i = 0, ii = this.as.length; i < ii; i++) {
				this.mol.atoms.push(this.as[i]);
			}
		}
		if (this.bs != null) {
			for ( var i = 0, ii = this.bs.length; i < ii; i++) {
				this.mol.bonds.push(this.bs[i]);
			}
		}
	};
	actions.AddAction.prototype.innerReverse = function() {
		if (this.as != null) {
			var aKeep = [];
			for ( var i = 0, ii = this.mol.atoms.length; i < ii; i++) {
				if (inArray(this.mol.atoms[i], this.as) == -1) {
					aKeep.push(this.mol.atoms[i]);
				}
			}
			this.mol.atoms = aKeep;
		}
		if (this.bs != null) {
			var bKeep = [];
			for ( var i = 0, ii = this.mol.bonds.length; i < ii; i++) {
				if (inArray(this.mol.bonds[i], this.bs) == -1) {
					bKeep.push(this.mol.bonds[i]);
				}
			}
			this.mol.bonds = bKeep;
		}
	};

})(ChemDoodle.ReactionStep.actions, jQuery.inArray);

(function(actions, Bond) {

	actions.ChangeBondAction = function(b, orderAfter, stereoAfter) {
		this.b = b;
		this.orderBefore = b.bondOrder;
		this.stereoBefore = b.stereo;
		if (orderAfter) {
			this.orderAfter = orderAfter;
			this.stereoAfter = stereoAfter;
		} else {
			this.orderAfter = b.bondOrder + 1;
			if (this.orderAfter > 3) {
				this.orderAfter = 1;
			}
			this.stereoAfter = Bond.STEREO_NONE;
		}
		return true;
	};
	actions.ChangeBondAction.prototype = new actions._Action();
	actions.ChangeBondAction.prototype.innerForward = function() {
		this.b.bondOrder = this.orderAfter;
		this.b.stereo = this.stereoAfter;
	};
	actions.ChangeBondAction.prototype.innerReverse = function() {
		this.b.bondOrder = this.orderBefore;
		this.b.stereo = this.stereoBefore;
	};

})(ChemDoodle.ReactionStep.actions, ChemDoodle.structures.Bond);

(function(actions) {

	actions.ChangeChargeAction = function(a, delta) {
		this.a = a;
		this.delta = delta;
		return true;
	};
	actions.ChangeChargeAction.prototype = new actions._Action();
	actions.ChangeChargeAction.prototype.innerForward = function() {
		this.a.charge += this.delta;
	};
	actions.ChangeChargeAction.prototype.innerReverse = function() {
		this.a.charge -= this.delta;
	};

})(ChemDoodle.ReactionStep.actions);

(function(actions) {

	actions.ChangeCoordinatesAction = function(as, newCoords) {
		this.as = as;
		this.recs = [];
		for ( var i = 0, ii = this.as.length; i < ii; i++) {
			this.recs[i] = {'xo':this.as[i].x, 'yo':this.as[i].y, 'xn':newCoords[i].x, 'yn':newCoords[i].y};
		}
		return true;
	};
	actions.ChangeCoordinatesAction.prototype = new actions._Action();
	actions.ChangeCoordinatesAction.prototype.innerForward = function() {
		for ( var i = 0, ii = this.as.length; i < ii; i++) {
			this.as[i].x = this.recs[i].xn;
			this.as[i].y = this.recs[i].yn;
		}
	};
	actions.ChangeCoordinatesAction.prototype.innerReverse = function() {
		for ( var i = 0, ii = this.as.length; i < ii; i++) {
			this.as[i].x = this.recs[i].xo;
			this.as[i].y = this.recs[i].yo;
		}
	};

})(ChemDoodle.ReactionStep.actions);

(function(actions) {

	actions.ChangeLabelAction = function(a, after) {
		this.a = a;
		this.before = a.label;
		this.after = after;
		return true;
	};
	actions.ChangeLabelAction.prototype = new actions._Action();
	actions.ChangeLabelAction.prototype.innerForward = function() {
		this.a.label = this.after;
	};
	actions.ChangeLabelAction.prototype.innerReverse = function() {
		this.a.label = this.before;
	};

})(ChemDoodle.ReactionStep.actions);

(function(actions) {

	actions.ChangeLonePairAction = function(a, delta) {
		this.a = a;
		this.delta = delta;
		return true;
	};
	actions.ChangeLonePairAction.prototype = new actions._Action();
	actions.ChangeLonePairAction.prototype.innerForward = function() {
		this.a.numLonePair += this.delta;
	};
	actions.ChangeLonePairAction.prototype.innerReverse = function() {
		this.a.numLonePair -= this.delta;
	};

})(ChemDoodle.ReactionStep.actions);

(function(actions) {

	actions.ClearAction = function(ReactionStep) {
		this.ReactionStep = ReactionStep;
		this.before = this.ReactionStep.getMolecules();
		this.ReactionStep.clear();
		this.after = this.ReactionStep.getMolecules();
		return true;
	};
	actions.ClearAction.prototype = new actions._Action();
	actions.ClearAction.prototype.innerForward = function() {
		this.ReactionStep.molecules = this.after;
	};
	actions.ClearAction.prototype.innerReverse = function() {
		this.ReactionStep.molecules = this.before;
	};

})(ChemDoodle.ReactionStep.actions);

(function(actions) {

	actions.DeleteAction = function(mol, as, bs) {
		this.mol = mol;
		this.as = as;
		this.bs = bs;
		return true;
	};
	actions.DeleteAction.prototype = new actions._Action();
	actions.DeleteAction.prototype.innerForward = actions.AddAction.prototype.innerReverse;
	actions.DeleteAction.prototype.innerReverse = actions.AddAction.prototype.innerForward;

})(ChemDoodle.ReactionStep.actions);

(function(actions) {

	actions.FlipBondAction = function(b) {
		this.b = b;
		return true;
	};
	actions.FlipBondAction.prototype = new actions._Action();
	actions.FlipBondAction.prototype.innerForward = function() {
		var temp = this.b.a1;
		this.b.a1 = this.b.a2;
		this.b.a2 = temp;
	};
	actions.FlipBondAction.prototype.innerReverse = function() {
		this.innerForward();
	};

})(ChemDoodle.ReactionStep.actions);

(function(actions) {

	actions.MoveAction = function(as, dif) {
		this.as = as;
		this.dif = dif;
		return true;
	};
	actions.MoveAction.prototype = new actions._Action();
	actions.MoveAction.prototype.innerForward = function() {
		for ( var i = 0, ii = this.as.length; i < ii; i++) {
			this.as[i].add(this.dif);
		}
	};
	actions.MoveAction.prototype.innerReverse = function() {
		for ( var i = 0, ii = this.as.length; i < ii; i++) {
			this.as[i].sub(this.dif);
		}
	};

})(ChemDoodle.ReactionStep.actions);

(function(actions, m) {

	actions.RotateAction = function(as, dif, center) {
		this.as = as;
		this.dif = dif;
		this.center = center;
		return true;
	};
	actions.RotateAction.prototype = new actions._Action();
	actions.RotateAction.prototype.innerForward = function() {
		for ( var i = 0, ii = this.as.length; i < ii; i++) {
			var dist = this.center.distance(this.as[i]);
			var angle = this.center.angle(this.as[i]) + this.dif;
			this.as[i].x = this.center.x + dist * m.cos(angle);
			this.as[i].y = this.center.y - dist * m.sin(angle);
		}
	};
	actions.RotateAction.prototype.innerReverse = function() {
		for ( var i = 0, ii = this.as.length; i < ii; i++) {
			var dist = this.center.distance(this.as[i]);
			var angle = this.center.angle(this.as[i]) - this.dif;
			this.as[i].x = this.center.x + dist * m.cos(angle);
			this.as[i].y = this.center.y - dist * m.sin(angle);
		}
	};

})(ChemDoodle.ReactionStep.actions, Math);

/*(function(actions, inArray) {

	actions.SwitchMoleculeAction = function(sketcher, mol) {
		this.sketcher = sketcher;
		this.molB = sketcher.molecule;
		this.molA = mol;
		return true;
	};
	actions.SwitchMoleculeAction.prototype = new actions._Action();
	actions.SwitchMoleculeAction.prototype.innerForward = function() {
		this.sketcher.loadMolecule(this.molA);
	};
	actions.SwitchMoleculeAction.prototype.innerReverse = function() {
		this.sketcher.molecule = this.molB;
	};

})(ChemDoodle.sketcher.actions, jQuery.inArray);*/

(function(actions, inArray) {

	actions.AddMoleculeAction = function(ReactionStep, mol) {
		this.ReactionStep = ReactionStep;
		this.mol = mol;
		return true;
	};
	actions.AddMoleculeAction.prototype = new actions._Action();
	actions.AddMoleculeAction.prototype.innerForward = function() {
		this.ReactionStep.loadMolecule(this.molA);
	};
	actions.SwitchMoleculeAction.prototype.innerReverse = function() {
		this.sketcher.molecule = this.molB;
	};

})(ChemDoodle.sketcher.actions, jQuery.inArray);

(function(actions) {

	actions.HistoryManager = function(ReactionStep) {
		this.ReactionStep = ReactionStep;
		this.undoStack = [];
		this.redoStack = [];
		return true;
	};
	actions.HistoryManager.prototype.undo = function() {
		if (this.undoStack.length != 0) {
			var a = this.undoStack.pop();
			a.reverse(this.ReactionStep);
			this.redoStack.push(a);
			if (this.undoStack.length == 0) {
				this.ReactionStep.toolbarManager.buttonUndo.disable();
			}
			this.ReactionStep.toolbarManager.buttonRedo.enable();
		}
	};
	actions.HistoryManager.prototype.redo = function() {
		if (this.redoStack.length != 0) {
			var a = this.redoStack.pop();
			a.forward(this.sketcher);
			this.undoStack.push(a);
			this.ReactionStep.toolbarManager.buttonUndo.enable();
			if (this.redoStack.length == 0) {
				this.ReactionStep.toolbarManager.buttonRedo.disable();
			}
		}
	};
	actions.HistoryManager.prototype.pushUndo = function(a) {
		a.forward(this.ReactionStep);
		this.undoStack.push(a);
		if (this.redoStack.length != 0) {
			this.redoStack = [];
		}
		this.ReactionStep.toolbarManager.buttonUndo.enable();
		this.ReactionStep.toolbarManager.buttonRedo.disable();
	};
	actions.HistoryManager.prototype.clear = function(a) {
		if (this.undoStack.length != 0) {
			this.undoStack = [];
			this.ReactionStep.toolbarManager.buttonUndo.disable();
		}
		if (this.redoStack.length != 0) {
			this.redoStack = [];
			this.ReactionStep.toolbarManager.buttonRedo.disable();
		}
	};

})(ChemDoodle.ReactionStep.actions);




(function(math, monitor, actions, states, structures, SYMBOLS, inArray, m) {

	states._State = function() {
		return true;
	};
	states._State.prototype.setup = function(ReactionStep) {
		this.ReactionStep = ReactionStep;
	};

	states._State.prototype.bondExists = function(a1, a2) {
		if(a1.molecule == a2.molecule){
			var molecule = a1.molecule;
			for ( var j = 0, jj = molecule.bonds.length; j < jj; j++) {
				if (molecule.bonds[j].contains(a1) && molecule.bonds[j].contains(a2)) {
					return true;
				}
			}
		}
		return false
	};
	states._State.prototype.getBond = function(a1, a2) {
		if(a1.molecule == a2.molecule){
			var molecule = a1.molecule;
			for ( var j = 0, jj = molecule.bonds.length; j < jj; j++) {
				if (molecule.bonds[j].contains(a1) && molecule.bonds[j].contains(a2)) {
					return molecule.bonds[j];
				}
			}
		}
		return null;
	};
	states._State.prototype.clearHover = function() {
		if (this.ReactionStep.hovering != null) {
			this.ReactionStep.hovering.isHover = false;
			this.ReactionStep.hovering.isSelected = false;
		}
		this.ReactionStep.hovering = null;
	};
	states._State.prototype.findHoveredObject = function(e, includeAtoms, includeBonds) {
		this.clearHover();
		var min = Infinity;
		var hovering = null;
		
		for(var i = 0, ii = this.ReactionStep.molecules.length; i<ii;i++){
			if(includeAtoms){
				for ( var j = 0, jj = this.ReactionStep.molecules[i].atoms.length; j < jj; j++) {
					this.ReactionStep.molecules[i].atoms[h].isHover = false;
					var dist = e.p.distance(this.ReactionStep.molecules[i].atoms[j]);
					if (dist < this.ReactionStep.specs.bondLength && dist < min) {
						min = dist;
						hovering = this.ReactionStep.molecules[i].atoms[j];
					}
				}
			}
			if(includeBonds){
				for ( var j = 0, jj = this.ReactionStep.molecules[i].bonds.length; j < jj; j++) {
					this.ReactionStep.molecule.bonds[j].isHover = false;
					var dist = e.p.distance(this.ReactionStep.molecules[i].bonds[j].getCenter());
					if (dist < this.ReactionStep.specs.bondLength && dist < min) {
						min = dist;
						hovering = this.ReactionStep.molecules[i].bonds[j];
					}
				}
			}
		}

		
		if (hovering != null) {
			hovering.isHover = true;
			this.ReactionStep.hovering = hovering;
		}
	};
	states._State.prototype.getOptimumAngle = function(a) {
		var angles = a.molecule.getAngles(a);
		var angle = 0;
		if (angles.length == 0) {
			angle = m.PI / 6;
		} else if (angles.length == 1) {
			var b = null;
			for(var i = 0, ii = this.ReactionStep.molecules.length; i<ii;i++){
				for ( var j = 0, jj = this.ReactionStep.molecules[i].bonds.length; j < jj; j++) {
					if (this.ReactionStep.molecules[i].bonds[j].contains(this.ReactionStep.hovering)) {
						b = this.ReactionStep.molecules[i].bonds[j];
					}
				}
			}
			if (b.bondOrder >= 3) {
				angle = angles[0] + m.PI;
			} else {
				var concerned = angles[0] % m.PI * 2;
				if (math.isBetween(concerned, 0, m.PI / 2) || math.isBetween(concerned, m.PI, 3 * m.PI / 2)) {
					angle = angles[0] + 2 * m.PI / 3;
				} else {
					angle = angles[0] - 2 * m.PI / 3;
				}
			}

		} else {
			angle = math.angleBetweenLargest(angles).angle;
		}
		return angle;
	};

	states._State.prototype.click = function(e) {
		if (this.innerclick) {
			this.innerclick(e);
		}
	};
	states._State.prototype.rightclick = function(e) {
		if (this.innerrightclick) {
			this.innerrightclick(e);
		}
	};
	states._State.prototype.dblclick = function(e) {
		if (this.innerdblclick) {
			this.innerdblclick(e);
		}
		if (this.ReactionStep.hovering == null) {
			// center structure
			//we will center structures in frame... ACTION STEP
			/*
			var dif = new structures.Point(this.sketcher.width / 2, this.sketcher.height / 2);
			dif.sub(this.sketcher.molecule.getCenter());
			this.sketcher.historyManager.pushUndo(new actions.MoveAction(this.sketcher.molecule.atoms, dif));*/
		}
	};
	states._State.prototype.mousedown = function(e) {
		/*this.ReactionStep.lastPoint = e.p;
		if (this.ReactionStep.isHelp || this.ReactionStep.isMobile && e.op.distance(this.ReactionStep.helpPos) < 10) {
			this.ReactionStep.isHelp = false;
			this.ReactionStep.repaint();
			window.open('http://web.chemdoodle.com/sketcher');
		} else */
		if (this.innermousedown) {
			this.innermousedown(e);
		}
	};
	states._State.prototype.rightmousedown = function(e) {
		if (this.innerrightmousedown) {
			this.innerrightmousedown(e);
		}
	};
	states._State.prototype.mousemove = function(e) {
		if (this.innermousemove) {
			this.innermousemove(e);
		}
		//call the repaint here to repaint the help button, also this is called by other functions, so the repaint must be here
		this.ReactionStep.repaint();
	};
	states._State.prototype.mouseout = function(e) {
		if (this.innermouseout) {
			this.innermouseout(e);
		}
	};
	states._State.prototype.mouseover = function(e) {
		if (this.innermouseover) {
			this.innermouseover(e);
		}
	};
	states._State.prototype.mouseup = function(e) {
		this.parentAction = null;
		if (this.innermouseup) {
			this.innermouseup(e);
		}
	};
	states._State.prototype.rightmouseup = function(e) {
		if (this.innerrightmouseup) {
			this.innerrightmouseup(e);
		}
	};
	states._State.prototype.mousewheel = function(e, delta) {
		if (this.innermousewheel) {
			this.innermousewheel(e);
		}
		this.ReactionStep.specs.scale += delta / 10;
		this.ReactionStep.checkScale();
		this.ReactionStep.repaint();
	};
	states._State.prototype.drag = function(e) {
		if (this.innerdrag) {
			this.innerdrag(e);
		}
		/*if (this.ReactionStep.hovering == null) {
			if (monitor.SHIFT) {
				// rotate structure
				var center = new structures.Point(this.ReactionStep.width / 2, this.ReactionStep.height / 2);
				var oldAngle = center.angle(this.ReactionStep.lastPoint);
				var newAngle = center.angle(e.p);
				var rot = newAngle - oldAngle;
				if (this.parentAction == null) {
					this.parentAction = new actions.RotateAction(this.ReactionStep.molecule.atoms, rot, center);
					this.ReactionStep.historyManager.pushUndo(this.parentAction);
				} else {
					this.parentAction.dif += rot;
					for ( var i = 0, ii = this.sketcher.molecule.atoms.length; i < ii; i++) {
						var dist = center.distance(this.sketcher.molecule.atoms[i]);
						var angle = center.angle(this.sketcher.molecule.atoms[i]) + rot;
						this.sketcher.molecule.atoms[i].x = center.x + dist * m.cos(angle);
						this.sketcher.molecule.atoms[i].y = center.y - dist * m.sin(angle);
					}
					// must check here as change is outside of an action
					this.sketcher.molecule.check();
				}
			} else {
				if(!this.sketcher.lastPoint){
					// this prevents the structure from being rotated and translated at the same time while a gesture is occuring, which is preferable based on use cases since the rotation center is the canvas center
					return;
				}
				// move structure
				var dif = new structures.Point(e.p.x, e.p.y);
				dif.sub(this.sketcher.lastPoint);
				if (this.parentAction == null) {
					this.parentAction = new actions.MoveAction(this.sketcher.molecule.atoms, dif);
					this.sketcher.historyManager.pushUndo(this.parentAction);
				} else {
					this.parentAction.dif.add(dif);
					for ( var i = 0, ii = this.sketcher.molecule.atoms.length; i < ii; i++) {
						this.sketcher.molecule.atoms[i].add(dif);
					}
					// must check here as change is outside of an action
					this.sketcher.molecule.check();
				}
			}
			this.sketcher.repaint();
		}*/
		this.ReactionStep.lastPoint = e.p;
	};
	states._State.prototype.keydown = function(e) {
		if (monitor.CANVAS_DRAGGING == this.ReactionStep) {
			if (this.ReactionStep.lastPoint != null) {
				e.p = this.ReactionStep.lastPoint;
				this.drag(e);
			}
		} else if (monitor.META) {
			if (e.which == 90) {
				// z
				this.ReactionStep.historyManager.undo();
			} else if (e.which == 89) {
				// y
				this.ReactionStep.historyManager.redo();
			} else if (e.which == 83) {
				// s
				this.ReactionStep.toolbarManager.buttonSave.getElement().click();
			} else if (e.which == 79) {
				// o
				this.ReactionStep.toolbarManager.buttonOpen.getElement().click();
			} else if (e.which == 78) {
				// n
				this.ReactionStep.toolbarManager.buttonClear.getElement().click();
			} else if (e.which == 187 || e.which==61) {
				// +
				this.ReactionStep.toolbarManager.buttonScalePlus.getElement().click();
			} else if (e.which == 189 || e.which==109) {
				// -
				this.ReactionStep.toolbarManager.buttonScaleMinus.getElement().click();
			}
		} else if (e.which >= 37 && e.which <= 40) {
			// arrow keys
			var dif = new structures.Point();
			switch (e.which) {
			case 37:
				dif.x = -10;
				break;
			case 38:
				dif.y = -10;
				break;
			case 39:
				dif.x = 10;
				break;
			case 40:
				dif.y = 10;
				break;
			}
			//this would be much easier if there was an atoms array
			for(var i =0, ii = this.ReactionStep.molecules.length; i < ii; i++)
				new actions.MoveAction(this.ReactionStep.molecules[i].atoms, dif)
		} else if (e.which == 187 || e.which == 189 || e.which==61 || e.which==109) {
			// plus or minus
			//if its hovering on an atom, and they press + or - change charge
			if (this.ReactionStep.hovering != null && this.ReactionStep.hovering instanceof structures.Atom) {
				this.ReactionStep.historyManager.pushUndo(new actions.ChangeChargeAction(this.ReactionStep.hovering, e.which == 187 || e.which == 61 ? 1 : -1));
			}
		} else if (e.which == 8 || e.which == 127) {
			// delete or backspace
			this.ReactionStep.stateManager.STATE_ERASE.handleDelete();
		} else if (e.which >= 48 && e.which <= 57) {
			// digits
			//if its hovering and a diget is pressed
			if (this.ReactionStep.hovering != null) {
				var number = e.which - 48; //the diget they're pressing
				var as = [];
				var bs = [];
				//if its hovering on an atom
				if (this.ReactionStep.hovering instanceof structures.Atom) {
					if (monitor.SHIFT) {
						if (number > 2 && number < 9) {
							var angles = this.ReactionStep.hovering.molecule.getAngles(this.ReactionStep.hovering);
							var angle = 3 * m.PI / 2;
							if (angles.length != 0) {
								angle = math.angleBetweenLargest(angles).angle;
							}
							var ring = this.ReactionStep.stateManager.STATE_NEW_RING.getRing(this.ReactionStep.hovering, number, this.ReactionStep.specs.bondLength, angle, false);
							if (inArray(ring[0], this.ReactionStep.hovering.molecule.atoms) == -1) {
								as.push(ring[0]);
							}
							if (!this.bondExists(this.ReactionStep.hovering, ring[0])) {
								bs.push(new structures.Bond(this.ReactionStep.hovering, ring[0]));
							}
							for ( var i = 1, ii = ring.length; i < ii; i++) {
								if (inArray(ring[i], this.ReactionStep.hovering.molecule.atoms) == -1) {
									as.push(ring[i]);
								}
								if (!this.bondExists(ring[i - 1], ring[i])) {
									bs.push(new structures.Bond(ring[i - 1], ring[i]));
								}
							}
							if (!this.bondExists(ring[ring.length - 1], this.ReactionStep.hovering)) {
								bs.push(new structures.Bond(ring[ring.length - 1], this.ReactionStep.hovering));
							}
						}
					} else {
						if (number == 0) {
							number = 10;
						}
						var p = new structures.Point(this.ReactionStep.hovering.x, this.ReactionStep.hovering.y);
						var a = this.getOptimumAngle(this.ReactionStep.hovering);
						var prev = this.ReactionStep.hovering;
						for ( var i = 0; i < number; i++) {
							var ause = a + (i % 2 == 1 ? m.PI / 3 : 0);
							p.x += this.ReactionStep.specs.bondLength * m.cos(ause);
							p.y -= this.ReactionStep.specs.bondLength * m.sin(ause);
							var use = new structures.Atom('C', p.x, p.y);
							var minDist = Infinity;
							var closest = null;
							for ( var j = 0, jj = this.ReactionStep.hovering.molecule.atoms.length; j < jj; j++) {
								var dist = this.ReactionStep.molecule.atoms[j].distance(use);
								if (dist < minDist) {
									minDist = dist;
									closest = this.ReactionStep.molecule.atoms[j];
								}
							}
							if (minDist < 5) {
								use = closest;
							} else {
								as.push(use);
							}
							if (!this.bondExists(prev, use)) {
								bs.push(new structures.Bond(prev, use));
							}
							prev = use;
						}
					}
				} else if (this.ReactionStep.hovering instanceof structures.Bond) {
					if (monitor.SHIFT) {
						if (number > 2 && number < 9) {
							var ring = this.ReactionStep.stateManager.STATE_NEW_RING.getOptimalRing(this.ReactionStep.hovering, number);
							var start = this.ReactionStep.hovering.a2;
							var end = this.ReactionStep.hovering.a1;
							if (ring[0] == this.ReactionStep.hovering.a1) {
								start = this.ReactionStep.hovering.a1;
								end = this.ReactionStep.hovering.a2;
							}
							if (inArray(ring[1], this.ReactionStep.hovering.molecule.atoms) == -1) {
								as.push(ring[1]);
							}
							if (!this.bondExists(start, ring[1])) {
								bs.push(new structures.Bond(start, ring[1]));
							}
							for ( var i = 2, ii = ring.length; i < ii; i++) {
								if (inArray(ring[i], this.ReactionStep.hovering.molecule.atoms) == -1) {
									as.push(ring[i]);
								}
								if (!this.bondExists(ring[i - 1], ring[i])) {
									bs.push(new structures.Bond(ring[i - 1], ring[i]));
								}
							}
							if (!this.bondExists(ring[ring.length - 1], end)) {
								bs.push(new structures.Bond(ring[ring.length - 1], end));
							}
						}
					} else if (number > 0 && number < 4) {
						this.ReactionStep.historyManager.pushUndo(new actions.ChangeBondAction(this.ReactionStep.hovering, number, structures.Bond.STEREO_NONE));
					}
				}
				if (as.length != 0 || bs.length != 0) {
					this.ReactionStep.historyManager.pushUndo(new actions.AddAction(this.ReactionStep.hovering.molecule, as, bs));
				}
			}
		} else if (e.which >= 65 && e.which <= 90) {
			// alphabet
			if (this.ReactionStep.hovering != null) {
				if (this.ReactionStep.hovering instanceof structures.Atom) {
					var check = String.fromCharCode(e.which);
					var firstMatch = null;
					var firstAfterMatch = null;
					var found = false;
					for ( var j = 0, jj = SYMBOLS.length; j < jj; j++) {
						if (this.ReactionStep.hovering.label.charAt(0) == check) {
							if (SYMBOLS[j] == this.ReactionStep.hovering.label) {
								found = true;
							} else if (SYMBOLS[j].charAt(0) == check) {
								if (found && firstAfterMatch == null) {
									firstAfterMatch = SYMBOLS[j];
								} else if (firstMatch == null) {
									firstMatch = SYMBOLS[j];
								}
							}
						} else {
							if (SYMBOLS[j].charAt(0) == check) {
								firstMatch = SYMBOLS[j];
								break;
							}
						}
					}
					var use = 'C';
					if (firstAfterMatch != null) {
						use = firstAfterMatch;
					} else if (firstMatch != null) {
						use = firstMatch;
					}
					this.ReactionStep.historyManager.pushUndo(new actions.ChangeLabelAction(this.ReactionStep.hovering, use));
				} else if (this.ReactionStep.hovering instanceof structures.Bond) {
					if (e.which == 70) {
						// f
						this.ReactionStep.historyManager.pushUndo(new actions.FlipBondAction(this.ReactionStep.hovering));
					}
				}
			}
		}
		if (this.innerkeydown) {
			this.innerkeydown(e);
		}
	};
	states._State.prototype.keypress = function(e) {
		if (this.innerkeypress) {
			this.innerkeypress(e);
		}
	};
	states._State.prototype.keyup = function(e) {
		if (monitor.CANVAS_DRAGGING == this.ReactionStep) {
			if (this.ReactionStep.lastPoint != null) {
				e.p = this.ReactionStep.lastPoint;
				this.ReactionStep.drag(e);
			}
		}
		if (this.innerkeyup) {
			this.innerkeyup(e);
		}
	};

})(ChemDoodle.math, ChemDoodle.monitor, ChemDoodle.ReactionStep.actions, ChemDoodle.ReactionStep.states, ChemDoodle.structures, ChemDoodle.SYMBOLS, jQuery.inArray, Math);



(function(actions, states) {

	states.ChargeState = function(ReactionStep) {
		this.setup(ReactionStep);
		this.delta = 1;
		return true;
	};
	states.ChargeState.prototype = new states._State();
	states.ChargeState.prototype.innermouseup = function(e) {
		if (this.ReactionStep.hovering != null) {
			this.ReactionStep.historyManager.pushUndo(new actions.ChangeChargeAction(this.ReactionStep.hovering, this.delta));
		}
	};
	states.ChargeState.prototype.innermousemove = function(e) {
		this.findHoveredObject(e, true, false);
	};

})(ChemDoodle.ReactionStep.actions, ChemDoodle.ReactionStep.states);


(function(actions, states, structures, inArray) {

	states.EraseState = function(ReactionStep) {
		this.setup(ReactionStep);
		return true;
	};
	states.EraseState.prototype = new states._State();
	states.EraseState.prototype.handleDelete = function() {
		if (this.ReactionStep.hovering != null) {
			if (this.ReactionStep.hovering instanceof structures.Atom) {
				for ( var j = 0, jj = this.ReactionStep.hovering.molecule.atoms.length; j < jj; j++) {
					this.ReactionStep.hovering.molecule.atoms[j].visited = false;
				}
				var connectionsA = [];
				var connectionsB = [];
				this.ReactionStep.hovering.visited = true;
				for ( var j = 0, jj = this.ReactionStep.hovering.molecule.bonds.length; j < jj; j++) {
					if (this.ReactionStep.hovering.molecule.bonds[j].contains(this.ReactionStep.hovering)) {
						var atoms = [];
						var bonds = [];
						var q = new structures.Queue();
						q.enqueue(this.ReactionStep.hovering.molecule.bonds[j].getNeighbor(this.ReactionStep.hovering));
						while (!q.isEmpty()) {
							var a = q.dequeue();
							if (!a.visited) {
								a.visited = true;
								atoms.push(a);
								for ( var k = 0, kk = this.ReactionStep.hovering.molecule.bonds.length; k < kk; k++) {
									if (this.ReactionStep.hovering.molecule.bonds[k].contains(a) && !this.ReactionStep.hovering.molecule.bonds[k].getNeighbor(a).visited) {
										q.enqueue(this.ReactionStep.hovering.molecule.bonds[k].getNeighbor(a));
										bonds.push(this.ReactionStep.hovering.molecule.bonds[k]);
									}
								}
							}
						}
						connectionsA.push(atoms);
						connectionsB.push(bonds);
					}
				}
				var largest = -1;
				var index = -1;
				for ( var j = 0, jj = connectionsA.length; j < jj; j++) {
					if (connectionsA[j].length > largest) {
						index = j;
						largest = connectionsA[j].length;
					}
				}
				if (index > -1) {
					var as = [];
					var bs = [];
					for ( var i = 0, ii = this.ReactionStep.hovering.molecule.atoms.length; i < ii; i++) {
						if (inArray(this.ReactionStep.hovering.molecule.atoms[i], connectionsA[index]) == -1) {
							as.push(this.ReactionStep.hovering.molecule.atoms[i]);
						}
					}
					for ( var i = 0, ii = this.ReactionStep.hovering.molecule.bonds.length; i < ii; i++) {
						if (inArray(this.ReactionSte.hovering.molecule.bonds[i], connectionsB[index]) == -1) {
							bs.push(this.ReactionStep.hovering.molecule.bonds[i]);
						}
					}
					this.ReactionStep.historyManager.pushUndo(new actions.DeleteAction(this.ReactionStep.hovering.molecule, as, bs));
				} else {
					this.ReactionStep.historyManager.pushUndo(new actions.ClearAction(this.ReactionStep));
				}
			} else if (this.ReactionStep.hovering instanceof structures.Bond) {
				if (this.ReactionStep.hovering.ring != null) {
					var bs = [];
					bs[0] = this.ReactionStep.hovering;
					this.ReactionStep.historyManager.pushUndo(new actions.DeleteAction(this.ReactionStep.hovering.molecule, null, bs));
				}
			}
			this.ReactionStep.repaint();
		}
	};
	states.EraseState.prototype.innermouseup = function(e) {
		this.handleDelete();
	};
	states.EraseState.prototype.innermousemove = function(e) {
		this.findHoveredObject(e, true, true);
	};

})(ChemDoodle.ReactionStep.actions, ChemDoodle.ReactionStep.states, ChemDoodle.structures, jQuery.inArray);


(function(actions, states) {

	states.LabelState = function(ReactionStep) {
		this.setup(ReactionStep);
		this.label = 'C';
		return true;
	};
	states.LabelState.prototype = new states._State();
	states.LabelState.prototype.innermouseup = function(e) {
		if (this.ReactionStep.hovering != null) {
			this.ReactionStep.historyManager.pushUndo(new actions.ChangeLabelAction(this.ReactionStep.hovering, this.label));
		}
	};
	states.LabelState.prototype.innermousemove = function(e) {
		this.findHoveredObject(e, true, false);
	};

})(ChemDoodle.ReactionStep.actions, ChemDoodle.ReactionStep.states);

(function(actions, states) {

	states.LonePairState = function(ReactionStep) {
		this.setup(ReactionStep);
		this.delta = 1;
		return true;
	};
	states.LonePairState.prototype = new states._State();
	states.LonePairState.prototype.innermouseup = function(e) {
		if(this.delta<0&&this.ReactionStep.hovering.numLonePair<1){
			return;
		}
		if (this.ReactionStep.hovering != null) {
			this.ReactionStep.historyManager.pushUndo(new actions.ChangeLonePairAction(this.ReactionStep.hovering, this.delta));
		}
	};
	states.LonePairState.prototype.innermousemove = function(e) {
		this.findHoveredObject(e, true, false);
	};

})(ChemDoodle.ReactionStep.actions, ChemDoodle.ReactionStep.states);


(function(actions, states, structures) {

	states.MoveState = function(ReactionStep) {
		this.setup(ReactionStep);
		this.action = null;
		return true;
	};
	states.MoveState.prototype = new states._State();
	states.MoveState.prototype.innerdrag = function(e) {
		if (this.ReactionStep.hovering != null) {
			if (this.action == null) {
				var as = [];
				var dif = new structures.Point(e.p.x, e.p.y);
				if (this.ReactionStep.hovering instanceof structures.Atom) {
					dif.sub(this.ReactionStep.hovering);
					as[0] = this.ReactionStep.hovering;
				} else if (this.ReactionStep.hovering instanceof structures.Bond) {
					dif.sub(this.ReactionStep.lastPoint);
					as[0] = this.ReactionStep.hovering.a1;
					as[1] = this.ReactionStep.hovering.a2;
				}
				this.action = new actions.MoveAction(as, dif);
				this.ReactionStep.historyManager.pushUndo(this.action);
			} else {
				var dif = new structures.Point(e.p.x, e.p.y);
				dif.sub(this.ReactionStep.lastPoint);
				this.action.dif.add(dif);
				for ( var i = 0, ii = this.action.as.length; i < ii; i++) {
					this.action.as[i].add(dif);
				}
				for(var i = 0; i = this.ReactionStep.molecules.length; i < ii; i++){
					this.ReactionStep.molecules[i].check();
				}
				this.ReactionStep.repaint();
			}
		}
	};
	states.MoveState.prototype.innermousemove = function(e) {
		this.findHoveredObject(e, true, true);
	};
	states.MoveState.prototype.innermouseup = function(e) {
		this.action = null;
	};

})(ChemDoodle.ReactionStep.actions, ChemDoodle.ReactionStep.states, ChemDoodle.structures);


(function(monitor, actions, states, structures, m) {

	states.NewBondState = function(ReactionStep) {
		this.setup(ReactionStep);
		this.bondOrder = 1;
		this.stereo = structures.Bond.STEREO_NONE;
		return true;
	};
	states.NewBondState.prototype = new states._State();
	states.NewBondState.prototype.incrementBondOrder = function(b) {
		if (this.bondOrder == 1 && this.stereo == structures.Bond.STEREO_NONE) {
			this.ReactionStep.historyManager.pushUndo(new actions.ChangeBondAction(b));
		} else {
			if(b.bondOrder==this.bondOrder&&b.stereo==this.stereo){
				if(b.bondOrder==1&&b.stereo!=structures.Bond.STEREO_NONE || b.bondOrder==2 && b.stereo==structures.Bond.STEREO_NONE){
					this.ReactionStep.historyManager.pushUndo(new actions.FlipBondAction(b));
				}
			}else{
				this.ReactionStep.historyManager.pushUndo(new actions.ChangeBondAction(b, this.bondOrder, this.stereo));
			}
		}
	};

	states.NewBondState.prototype.innerdrag = function(e) {
		if (this.ReactionStep.hovering instanceof structures.Atom) {
			if (e.p.distance(this.ReactionStep.hovering) < 15) {
				var angle = this.getOptimumAngle(this.ReactionStep.hovering);
				var x = this.ReactionStep.hovering.x + this.ReactionStep.specs.bondLength * m.cos(angle);
				var y = this.ReactionStep.hovering.y - this.ReactionStep.specs.bondLength * m.sin(angle);
				this.ReactionStep.tempAtom = new structures.Atom('C', x, y, 0);
			} else {
				if (monitor.ALT && monitor.SHIFT) {
					this.ReactionStep.tempAtom = new structures.Atom('C', e.p.x, e.p.y, 0);
				} else {
					var angle = this.ReactionStep.hovering.angle(e.p);
					var length = this.ReactionStep.hovering.distance(e.p);
					if (!monitor.SHIFT) {
						length = this.ReactionStep.specs.bondLength;
					}
					if (!monitor.ALT) {
						var increments = m.floor((angle + m.PI / 12) / (m.PI / 6));
						angle = increments * m.PI / 6;
					}
					this.ReactionStep.tempAtom = new structures.Atom('C', this.ReactionStep.hovering.x + length * m.cos(angle), this.ReactionStep.hovering.y - length * m.sin(angle), 0);
				}
			}
			for(var i = 0, ii = this.ReactionStep.molecules.length; i<ii; i++){
				for ( var j = 0, jj = this.ReactionStep.molecules[i].atoms.length; j < jj; j++) {
					if (this.ReactionStep.molecules[i].atoms[j].distance(this.ReactionStep.tempAtom) < 5) {
						this.ReactionStep.tempAtom.x = this.ReactionStep.molecules[i].atoms[j].x;
						this.ReactionStep.tempAtom.y = this.ReactionStep.molecules[i].atoms[j].y;
						this.ReactionStep.tempAtom.isOverlap = true;
					}
				}
			}
			this.ReactionStep.repaint();
		}
	};
	states.NewBondState.prototype.innermousedown = function(e) {
		if (this.ReactionStep.hovering instanceof structures.Atom) {
			this.ReactionStep.hovering.isHover = false;
			this.ReactionStep.hovering.isSelected = true;
			this.drag(e);
		} else if (this.ReactionStep.hovering instanceof structures.Bond) {
			this.ReactionStep.hovering.isHover = false;
			this.incrementBondOrder(this.ReactionStep.hovering);
			for(var i = 0,ii=this.ReactionStep.molecules.length;i<ii;i++){
				this.ReactionStep.molecules[i].check();
			}
			this.ReactionStep.repaint();
		}
	};
	states.NewBondState.prototype.innermouseup = function(e) {
		if (this.ReactionStep.tempAtom != null && this.ReactionStep.hovering != null) {
			var as = [];
			var bs = [];
			var makeBond = true;
			if (this.ReactionStep.tempAtom.isOverlap) {
				for(var i = 0,ii = this.ReactionStep.molecules.length;i<ii;i++){
					for ( var j = 0, jj = this.ReactionStep.molecules[i].atoms.length; j < jj; j++) {
						if (this.ReactionStep.molecules[i].atoms[j].distance(this.ReactionStep.tempAtom) < 5) 
							if(this.ReactionStep.hovering.moleule == this.ReactionStep.moluclules[i])
								this.ReactionStep.tempAtom = this.ReactionStep.molecules[i].atoms[j];
							else
								console.log("trying to bond 2 molecules in a way that will most likely break everything -z");
					}
				}
				var bond = this.getBond(this.ReactionStep.hovering, this.ReactionStep.tempAtom);
				if (bond != null) {
					this.incrementBondOrder(bond);
					makeBond = false;
				}
			} else {
				as.push(this.ReactionStep.tempAtom);
			}
			if (makeBond) {
				bs[0] = new structures.Bond(this.ReactionStep.hovering, this.ReactionStep.tempAtom, this.bondOrder);
				bs[0].stereo = this.stereo;
				this.sketcher.historyManager.pushUndo(new actions.AddAction(this.ReactionStep.hovering.molecule, as, bs));
			}
		}
		this.ReactionStep.tempAtom = null;
		if (!this.ReactionStep.isMobile) {
			this.mousemove(e);
		}
	};
	states.NewBondState.prototype.innermousemove = function(e) {
		if (this.ReactionStep.tempAtom != null) {
			return;
		}
		this.findHoveredObject(e, true, true);
	};

})(ChemDoodle.monitor, ChemDoodle.ReactionStep.actions, ChemDoodle.ReactionStep.states, ChemDoodle.structures, Math);



(function(math, monitor, actions, states, structures, inArray, m) {

	states.NewRingState = function(ReactionStep) {
		this.setup(ReactionStep);
		this.numSides = 6;
		this.unsaturated = false;
		return true;
	};
	states.NewRingState.prototype = new states._State();
	states.NewRingState.prototype.getRing = function(a, numSides, bondLength, angle, setOverlaps) {
		var innerAngle = m.PI - 2 * m.PI / numSides;
		angle += innerAngle / 2;
		var ring = [];
		for ( var i = 0; i < numSides - 1; i++) {
			var p = i == 0 ? new structures.Atom('C', a.x, a.y) : new structures.Atom('C', ring[ring.length - 1].x, ring[ring.length - 1].y);
			p.x += bondLength * m.cos(angle);
			p.y -= bondLength * m.sin(angle);
			ring.push(p);
			angle += m.PI + innerAngle;
		}
		for ( var j = 0, jj = this.sketcher.molecule.atoms.length; j < jj; j++) {
			this.sketcher.molecule.atoms[j].isOverlap = false;
		}
		for ( var i = 0, ii = ring.length; i < ii; i++) {
			var minDist = Infinity;
			var closest = null;
			for(var k = 0, kk = this.ReactionStep.molecules.length; k<kk; k++){
				for ( var j = 0, jj = this.ReactionStep.molecules[k].atoms.length; j < jj; j++) {
					var dist = this.ReactionStep.molecule[k].atoms[j].distance(ring[i]);
					if (dist < minDist) {
						minDist = dist;
						closest = this.ReactionStep.molecule[k].atoms[j];
					}
				}
			}
			if (minDist < 5) {
				ring[i] = closest;
				if (setOverlaps) {
					closest.isOverlap = true;
				}
			}
		}
		return ring;
	};
	states.NewRingState.prototype.getOptimalRing = function(b, numSides) {
		var molecule = b.molecule;
		var innerAngle = m.PI / 2 - m.PI / numSides;
		var bondLength = b.a1.distance(b.a2);
		var ring1 = this.getRing(b.a1, numSides, bondLength, b.a1.angle(b.a2) - innerAngle, false);
		var ring2 = this.getRing(b.a2, numSides, bondLength, b.a2.angle(b.a1) - innerAngle, false);
		var dist1 = 0, dist2 = 0;
		for ( var i = 1, ii = ring1.length; i < ii; i++) {
			for ( var j = 0, jj = molecule.atoms.length; j < jj; j++) {
				var d1 = molecule.atoms[j].distance(ring1[i]);
				var d2 = molecule.atoms[j].distance(ring2[i]);
				dist1 += m.min(1E8, 1 / (d1*d1));
				dist2 += m.min(1E8, 1 / (d2*d2));
			}
		}
		if (dist1 < dist2) {
			return ring1;
		} else {
			return ring2;
		}
	};

	states.NewRingState.prototype.innerdrag = function(e) {
		if (this.ReactionStep.hovering instanceof structures.Atom) {
			var a = 0;
			var l = 0;
			if (e.p.distance(this.ReactionStep.hovering) < 15) {
				var angles = this.ReactionStep.hovering.molecule.getAngles(this.ReactionStep.hovering);
				if (angles.length == 0) {
					a = 3 * m.PI / 2;
				} else {
					a = math.angleBetweenLargest(angles).angle;
				}
				l = this.ReactionStep.specs.bondLength;
			} else {
				a = this.ReactionStep.hovering.angle(e.p);
				l = this.ReactionStep.hovering.distance(e.p);
				if (!(monitor.ALT && monitor.SHIFT)) {
					if (!monitor.SHIFT) {
						l = this.ReactionStep.specs.bondLength;
					}
					if (!monitor.ALT) {
						var increments = m.floor((a + m.PI / 12) / (m.PI / 6));
						a = increments * m.PI / 6;
					}
				}
			}
			this.ReactionStep.tempRing = this.getRing(this.ReactionStep.hovering, this.numSides, l, a, true);
			this.ReactionStep.repaint();
		} else if (this.ReactionStep.hovering instanceof structures.Bond) {
			var dist = math.distanceFromPointToLineInclusive(e.p, this.ReactionStep.hovering.a1, this.ReactionStep.hovering.a2);
			var ringUse = null;
			if (dist != -1 && dist <= 7) {
				ringUse = this.getOptimalRing(this.ReactionStep.hovering, this.numSides);
			} else {
				var innerAngle = m.PI / 2 - m.PI / this.numSides;
				var bondLength = this.ReactionStep.hovering.a1.distance(this.ReactionStep.hovering.a2);
				var ring1 = this.getRing(this.ReactionStep.hovering.a1, this.numSides, bondLength, this.ReactionStep.hovering.a1.angle(this.ReactionStep.hovering.a2) - innerAngle, false);
				var ring2 = this.getRing(this.ReactionStep.hovering.a2, this.numSides, bondLength, this.ReactionStep.hovering.a2.angle(this.ReactionStep.hovering.a1) - innerAngle, false);
				var center1 = new structures.Point();
				var center2 = new structures.Point();
				for ( var i = 1, ii = ring1.length; i < ii; i++) {
					center1.add(ring1[i]);
					center2.add(ring2[i]);
				}
				center1.x /= (ring1.length - 1);
				center1.y /= (ring1.length - 1);
				center2.x /= (ring2.length - 1);
				center2.y /= (ring2.length - 1);
				var dist1 = center1.distance(e.p);
				var dist2 = center2.distance(e.p);
				ringUse = ring2;
				if (dist1 < dist2) {
					ringUse = ring1;
				}
			}
			for ( var j = 1, jj = ringUse.length; j < jj; j++) {
				if (inArray(ringUse[j], this.ReactionStep.hovering.molecule.atoms) != -1) {
					ringUse[j].isOverlap = true;
				}
			}
			this.ReactionStep.tempRing = ringUse;
			this.ReactionStep.repaint();
		}
	};
	states.NewRingState.prototype.innermousedown = function(e) {
		if (this.ReactionStep.hovering != null) {
			this.ReactionStep.hovering.isHover = false;
			this.ReactionStep.hovering.isSelected = true;
			this.drag(e);
		}
	};
	states.NewRingState.prototype.innermouseup = function(e) {
		if (this.ReactionStep.tempRing != null && this.ReactionStep.hovering != null) {
			var as = [];
			var bs = [];
			if (this.ReactionStep.hovering instanceof structures.Atom) {
				if (inArray(this.ReactionStep.tempRing[0], this.ReactionStep.hovering.molecule.atoms) == -1) {
					as.push(this.ReactionStep.tempRing[0]);
				}
				if (!this.bondExists(this.ReactionStep.hovering, this.ReactionStep.tempRing[0])) {
					bs.push(new structures.Bond(this.ReactionStep.hovering, this.ReactionStep.tempRing[0]));
				}
				for ( var i = 1, ii = this.ReactionStep.tempRing.length; i < ii; i++) {
					if (inArray(this.ReactionStep.tempRing[i], this.ReactionStep.hovering.molecule.atoms) == -1) {
						as.push(this.ReactionStep.tempRing[i]);
					}
					if (!this.bondExists(this.ReactionStep.tempRing[i - 1], this.ReactionStep.tempRing[i])) {
						bs.push(new structures.Bond(this.ReactionStep.tempRing[i - 1], this.ReactionStep.tempRing[i], i % 2 == 1 && this.unsaturated ? 2 : 1));
					}
				}
				if (!this.bondExists(this.ReactionStep.tempRing[this.ReactionStep.tempRing.length - 1], this.ReactionStep.hovering)) {
					bs.push(new structures.Bond(this.ReactionStep.tempRing[this.ReactionStep.tempRing.length - 1], this.ReactionStep.hovering, this.unsaturated ? 2 : 1));
				}
			} else if (this.ReactionStep.hovering instanceof ReactionStep.Bond) {
				var start = this.ReactionStep.hovering.a2;
				var end = this.ReactionStep.hovering.a1;
				if (this.ReactionStep.tempRing[0] == this.ReactionStep.hovering.a1) {
					start 	= this.ReactionStep.hovering.a1;
					end 	= this.ReactionStep.hovering.a2;
				}
				if (inArray(this.ReactionStep.tempRing[1], this.ReactionStep.hovering.molecule.atoms) == -1) {
					as.push(this.ReactionStep.tempRing[1]);
				}
				if (!this.bondExists(start, this.ReactionStep.tempRing[1])) {
					bs.push(new structures.Bond(start, this.ReactionStep.tempRing[1]));
				}
				for ( var i = 2, ii = this.ReactionStep.tempRing.length; i < ii; i++) {
					if (inArray(this.ReactionStep.tempRing[i], this.ReactionStep.hovering.molecule.atoms) == -1) {
						as.push(this.ReactionStep.tempRing[i]);
					}
					if (!this.bondExists(this.ReactionStep.tempRing[i - 1], this.ReactionStep.tempRing[i])) {
						bs.push(new structures.Bond(this.ReactionStep.tempRing[i - 1], this.ReactionStep.tempRing[i], i % 2 == 0 && this.unsaturated ? 2 : 1));
					}
				}
				if (!this.bondExists(this.ReactionSteo.tempRing[this.ReactionStep.tempRing.length - 1], end)) {
					bs.push(new structures.Bond(this.ReactionStep.tempRing[this.ReactionStep.tempRing.length - 1], end));
				}
			}
			if (as.length != 0 || bs.length != 0) {
				this.ReactionStep.historyManager.pushUndo(new actions.AddAction(this.ReactionStep.hovering.molecule, as, bs));
			}
		}
		for ( var j = 0, jj = this.ReactionStep.hovering.molecule.atoms.length; j < jj; j++) {
			this.ReactionStep.hovering.molecule.atoms[j].isOverlap = false;
		}
		this.ReactionStep.tempRing = null;
		if (!this.ReactionStep.isMobile) {
			this.mousemove(e);
		}
	};
	states.NewRingState.prototype.innermousemove = function(e) {
		if (this.ReactionStep.tempAtom != null) {
			return;
		}
		this.findHoveredObject(e, true, true);
	};

})(ChemDoodle.math, ChemDoodle.monitor, ChemDoodle.ReactionStep.actions, ChemDoodle.ReactionStep.states, ChemDoodle.structures, jQuery.inArray, Math);



(function(states) {

	states.StateManager = function(ReactionStep) {
		this.STATE_NEW_BOND = new states.NewBondState(ReactionStep);
		this.STATE_NEW_RING = new states.NewRingState(ReactionStep);
		this.STATE_CHARGE = new states.ChargeState(ReactionStep);
		this.STATE_LONE_PAIR = new states.LonePairState(ReactionStep);
		this.STATE_MOVE = new states.MoveState(ReactionStep);
		this.STATE_ERASE = new states.EraseState(ReactionStep);
		this.STATE_LABEL = new states.LabelState(ReactionStep);
		this.currentState = this.STATE_NEW_BOND;
		return true;
	};

})(ChemDoodle.ReactionStep.states);


(function(desktop, q) {

	desktop.Button = function(id, iconPath, icon, tooltip, func) {
		this.id = id;
		this.iconPath = iconPath;
		this.icon = icon;
		this.toggle = false;
		this.tooltip = tooltip ? tooltip : '';
		this.func = func ? func : null;
		return true;
	};
	desktop.Button.prototype.getElement = function() {
		return q('#' + this.id);
	};
	desktop.Button.prototype.getSource = function(buttonGroup) {
		var sb = [];
		if (this.toggle) {
			sb.push('<input type="radio" name="');
			sb.push(buttonGroup);
			sb.push('" id="');
			sb.push(this.id);
			sb.push('"><label for="');
			sb.push(this.id);
			sb.push('"><img id="');
			sb.push(this.id);
			sb.push('_icon" title="');
			sb.push(this.tooltip);
			sb.push('" src="');
			sb.push(this.iconPath);
			sb.push(this.icon);
			sb.push('.png"></label>');
		} else {
			sb.push('<button id="');
			sb.push(this.id);
			sb.push('" onclick="return false;"><img title="');
			sb.push(this.tooltip);
			sb.push('" width="20" height="20" src="');
			sb.push(this.iconPath);
			sb.push(this.icon);
			sb.push('.png"></button>');
		}
		return sb.join('');
	};
	desktop.Button.prototype.setup = function(lone) {
		if (!this.toggle || lone) {
			this.getElement().button();
		}
		this.getElement().click(this.func);
	};
	desktop.Button.prototype.disable = function() {
		var element = this.getElement();
		element.mouseout();
		element.button('disable');
	};
	desktop.Button.prototype.enable = function() {
		this.getElement().button('enable');
	};
	desktop.Button.prototype.select = function() {
		var element = this.getElement();
		element.attr('checked', true);
		element.button('refresh');
	};

})(ChemDoodle.ReactionStep.gui.desktop, jQuery);


(function(desktop, q) {

	desktop.ButtonSet = function(id) {
		this.id = id;
		this.buttons = [];
		this.buttonGroup = 'main_group';
		this.toggle = true;
		return true;
	};
	desktop.ButtonSet.prototype.getElement = function() {
		return q('#' + this.id);
	};
	desktop.ButtonSet.prototype.getSource = function() {
		var sb = [];
		sb.push('<span id="');
		sb.push(this.id);
		sb.push('">');
		for ( var i = 0, ii = this.buttons.length; i < ii; i++) {
			if (this.toggle) {
				this.buttons[i].toggle = true;
			}
			sb.push(this.buttons[i].getSource(this.buttonGroup));
		}
		if (this.dropDown != null) {
			sb.push(this.dropDown.getButtonSource());
		}
		sb.push('</span>');
		if (this.dropDown != null) {
			sb.push(this.dropDown.getHiddenSource());
		}
		return sb.join('');
	};
	desktop.ButtonSet.prototype.setup = function() {
		this.getElement().buttonset();
		for ( var i = 0, ii = this.buttons.length; i < ii; i++) {
			this.buttons[i].setup(false);
		}
		if (this.dropDown != null) {
			this.dropDown.setup();
		}
	};
	desktop.ButtonSet.prototype.addDropDown = function(tooltip, iconPath) {
		this.dropDown = new desktop.DropDown(this.id + '_dd', iconPath, tooltip, this.buttons[this.buttons.length - 1]);
	};

})(ChemDoodle.ReactionStep.gui.desktop, jQuery);

(function(desktop, q, document) {

	desktop.Dialog = function(id, title) {
		this.id = id;
		this.title = title ? title : 'Information';
		this.buttons = null;
		this.message = null;
		this.afterMessage = null;
		this.includeTextArea = false;
		return true;
	};
	desktop.Dialog.prototype.getElement = function() {
		return q('#' + this.id);
	};
	desktop.Dialog.prototype.getTextArea = function() {
		return q('#' + this.id + '_ta');
	};
	desktop.Dialog.prototype.setup = function() {
		var sb = [];
		sb.push('<div style="font-size:12px;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		if (this.message != null) {
			sb.push('<p>');
			sb.push(this.message);
			sb.push('</p>');
		}
		if (this.includeTextArea) {
			sb.push('<textarea style="font-family:\'Courier New\';" id="');
			sb.push(this.id);
			sb.push('_ta" cols="55" rows="10"></textarea>');
		}
		if (this.afterMessage != null) {
			sb.push('<p>');
			sb.push(this.afterMessage);
			sb.push('</p>');
		}
		sb.push('</div>');
		document.writeln(sb.join(''));
		var self = this;
		this.getElement().dialog({
			autoOpen : false,
			width : 435,
			buttons : self.buttons
		});
	};

})(ChemDoodle.ReactionStep.gui.desktop, jQuery, document);

(function(c, desktop, q, document) {

	desktop.MolGrabberDialog = function(id) {
		this.id = id;
		this.title = 'MolGrabber';
		this.buttons = null;
		this.message = null;
		this.afterMessage = null;
		this.includeTextArea = false;
		return true;
	};
	desktop.MolGrabberDialog.prototype = new desktop.Dialog();
	desktop.MolGrabberDialog.prototype.setup = function() {
		var sb = [];
		sb.push('<div style="font-size:12px;text-align:center;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		if (this.message != null) {
			sb.push('<p>');
			sb.push(this.message);
			sb.push('</p>');
		}
		document.writeln(sb.join(''));
		this.canvas = new ChemDoodle.MolGrabberCanvas(this.id+'_mg', 200, 200);
		sb = [];
		if (this.afterMessage != null) {
			sb.push('<p>');
			sb.push(this.afterMessage);
			sb.push('</p>');
		}
		sb.push('</div>');
		document.writeln(sb.join(''));
		var self = this;
		this.getElement().dialog({
			autoOpen : false,
			width : 250,
			buttons : self.buttons
		});
	};

})(ChemDoodle, ChemDoodle.ReactionStep.gui.desktop, jQuery, document);

(function(c, desktop, q, document) {

	desktop.PeriodicTableDialog = function(id) {
		this.id = id;
		this.title = 'Periodic Table';
		this.buttons = null;
		this.message = null;
		this.afterMessage = null;
		this.includeTextArea = false;
		return true;
	};
	desktop.PeriodicTableDialog.prototype = new desktop.Dialog();
	desktop.PeriodicTableDialog.prototype.setup = function() {
		var sb = [];
		sb.push('<div style="text-align:center;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		document.writeln(sb.join(''));
		this.canvas = new ChemDoodle.PeriodicTableCanvas(this.id+'_pt', 20);
		document.writeln('</div>');
		var self = this;
		this.getElement().dialog({
			autoOpen : false,
			width : 400,
			buttons : self.buttons
		});
	};

})(ChemDoodle, ChemDoodle.ReactionStep.gui.desktop, jQuery, document);


(function(c, desktop, q, document) {

	desktop.SaveFileDialog = function(id, ReactionStep) {
		this.id = id;
		this.ReactionStep = ReactionStep;
		this.title = 'Save File';
		this.buttons = null;
		this.afterMessage = null;
		this.includeTextArea = false;
		return true;
	};
	desktop.SaveFileDialog.prototype = new desktop.Dialog();
	desktop.SaveFileDialog.prototype.clear = function() {
		//q('#' + this.id + '_link').html('The file link will appear here.');
		return false;
	};
	desktop.SaveFileDialog.prototype.setup = function() {
		var sb = [];
		sb.push('<div style="font-size:12px;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		sb.push('<p>You can\'t really save with this tool because we\'re working with multible molecules.</p>');
		/*sb.push('<select id="');
		sb.push(this.id);
		sb.push('_select">');
		sb.push('<option value="sk2">ACD/ChemSketch Document {sk2}');
		sb.push('<option value="ros">Beilstein ROSDAL {ros}');
		sb.push('<option value="cdx">Cambridgesoft ChemDraw Exchange {cdx}');
		sb.push('<option value="cdxml">Cambridgesoft ChemDraw XML {cdxml}');
		sb.push('<option value="mrv">ChemAxon Marvin Document {mrv}');
		sb.push('<option value="cml">Chemical Markup Language {cml}');
		sb.push('<option value="smiles">Daylight SMILES {smiles}');
		sb.push('<option value="icl" selected>iChemLabs ChemDoodle Document {icl}');
		sb.push('<option value="inchi">IUPAC InChI {inchi}');
		sb.push('<option value="jdx">IUPAC JCAMP-DX {jdx}');
		sb.push('<option value="skc">MDL ISIS Sketch {skc}');
		sb.push('<option value="tgf">MDL ISIS Sketch Transportable Graphics File {tgf}');
		sb.push('<option value="mol">MDL MOLFile {mol}');
		//sb.push('<option value="rdf">MDL RDFile {rdf}');
		//sb.push('<option value="rxn">MDL RXNFile {rxn}');
		sb.push('<option value="sdf">MDL SDFile {sdf}');
		sb.push('<option value="jme">Molinspiration JME String {jme}');
		sb.push('<option value="pdb">RCSB Protein Data Bank {pdb}');
		sb.push('<option value="mmd">Schr&ouml;dinger Macromodel {mmd}');
		sb.push('<option value="mae">Schr&ouml;dinger Maestro {mae}');
		sb.push('<option value="smd">Standard Molecular Data {smd}');
		sb.push('<option value="mol2">Tripos Mol2 {mol2}');
		sb.push('<option value="sln">Tripos SYBYL SLN {sln}');
		sb.push('<option value="xyz">XYZ {xyz}');
		sb.push('</select>');
		sb.push('<button id="');
		sb.push(this.id);
		sb.push('_button">');
		sb.push('Generate File</button>');
		sb.push('<p>When the file is written, a link will appear in the red-bordered box below, right-click on the link and choose the browser\'s <strong>Save As...</strong> function to save the file to your computer.</p>');
		sb.push('<div style="width:100%;height:30px;border:1px solid #c10000;text-align:center;" id="');
		sb.push(this.id);
		sb.push('_link">The file link will appear here.</div>');
		sb.push('<p><a href="http://www.chemdoodle.com" target="_blank">How do I use these files?</a></p>');*/
		sb.push('</div>');
		document.writeln(sb.join(''));
		//var self = this;
		/*q('#' + this.id + '_button').click(function() {
			q('#' + self.id + '_link').html('Generating file, please wait...');
			ChemDoodle.iChemLabs.saveFile(self.sketcher.molecule, q('#' + self.id + '_select').val(), function(link){
				q('#' + self.id + '_link').html('<a href="'+link+'"><span style="text-decoration:underline;">File is generated. Right-click on this link and Save As...</span></a>');
			});
		});*/
		this.getElement().dialog({
			autoOpen : false,
			width : 435,
			buttons : self.buttons
		});
	};

})(ChemDoodle, ChemDoodle.ReactionStep.gui.desktop, jQuery, document);

(function(c, actions, gui, desktop, q) {

	gui.DialogManager = function(ReactionStep) {
		if (ReactionStep.useServices) {
			this.saveDialog = new desktop.SaveFileDialog(ReactionStep.id+'_save_dialog', ReactionStep);
		} else {
			this.saveDialog = new desktop.Dialog(sketcher.id+'_save_dialog', 'Save Molecule');
			this.saveDialog.message = 'Copy and paste the content of the textarea into a file and save it with the extension <strong>.mol</strong>.';
			this.saveDialog.includeTextArea = true;
			// You must keep this link displayed at all times to abide by the
			// license
			// Contact us for permission to remove it,
			// http://www.ichemlabs.com/contact-us
			this.saveDialog.afterMessage = '<a href="http://www.chemdoodle.com" target="_blank">How do I use MOLFiles?</a>';
		}
		this.saveDialog.setup();

		this.loadDialog = new desktop.Dialog(ReactionStep.id+'_load_dialog', 'Load Molecule');
		this.loadDialog.message = 'Copy and paste the contents of a MOLFile (extension <strong>.mol</strong>) in the textarea below and then press the <strong>Load</strong> button.';
		this.loadDialog.includeTextArea = true;
		// You must keep this link displayed at all times to abide by the
		// license
		// Contact us for permission to remove it,
		// http://www.ichemlabs.com/contact-us
		this.loadDialog.afterMessage = '<a href="http://www.chemdoodle.com" target="_blank">Where do I get MOLFiles?</a>';
		var self = this;
		this.loadDialog.buttons = {
			'Load' : function() {
				q(this).dialog('close');
				var newMol = c.readMOL(self.loadDialog.getTextArea().val());
				if (newMol.atoms.length != 0) {
					ReactionStep.historyManager.pushUndo(new actions.AddMoleculeAction(ReactionStep, newMol));
				} else {
					alert('No chemical content was recognized.');
				}
			}
		};
		this.loadDialog.setup();

		this.searchDialog = new desktop.MolGrabberDialog(sketcher.id+'_search_dialog');
		this.searchDialog.buttons = {
			'Load' : function() {
				q(this).dialog('close');
				var newMol = self.searchDialog.canvas.molecule;
				if (newMol != null && newMol.atoms.length != 0 && newMol != sketcher.molecule) {
					sketcher.historyManager.pushUndo(new actions.SwitchMoleculeAction(sketcher, newMol));
				}
			}
		};
		this.searchDialog.setup();

		this.periodicTableDialog = new desktop.PeriodicTableDialog(sketcher.id+'_periodicTable_dialog');
		this.periodicTableDialog.buttons = {
			'Close' : function() {
				q(this).dialog('close');
			}
		};
		this.periodicTableDialog.setup();
		this.periodicTableDialog.canvas.click = function(evt) {
			if (this.hovered != null) {
				this.selected = this.hovered;
				var e = this.getHoveredElement();
				sketcher.stateManager.currentState = sketcher.stateManager.STATE_LABEL;
				sketcher.stateManager.STATE_LABEL.label = e.symbol;
				this.repaint();
			}
		};

		this.calculateDialog = new desktop.Dialog(sketcher.id+'_calculate_dialog', 'Calculations');
		this.calculateDialog.includeTextArea = true;
		// You must keep this link displayed at all times to abide by the
		// license
		// Contact us for permission to remove it,
		// http://www.ichemlabs.com/contact-us
		this.calculateDialog.afterMessage = '<a href="http://www.chemdoodle.com" target="_blank">Want more calculations?</a>';
		this.calculateDialog.setup();
		return true;
	};

})(ChemDoodle, ChemDoodle.ReactionStep.actions, ChemDoodle.ReactionStep.gui, ChemDoodle.ReactionStep.gui.desktop, jQuery);

/*

(function(c, q, document) {

	c.ReactionStepLayout = function(name){
		
		this.molecules = [];
		this.arrows = [];
		
		this.note = null;
		this.statusMessage = null;
		this.selectedTool = null;
	
		this.create(name);
		return true;
		
	};
	c.ReactionStepLayout.prototype = new c._Layout();
	
	c.ReactionStepLayout.prototype.setStatusMessage = function(message,timeout=null){
		//sets the thing somehow
		if(timeout !== null)
			setTimeout(this.clearStatusMessage(),timeout);
	}
	
	c.ReactionStepLayout.prototype.clearStatusMessage = function(){
		//clears the status message
	}
	
	c.ReactionStepLayout.prototype.innerLayout = function() {
		//loop through molecules, give them each an arrowcanvas
	};
	c.ReactionStepLayout.prototype.addMolecules = function(molecule) {
		this.molecules.push(molecule);
	};
})(ChemDoodle, jQuery, document);*/