var NODE_ARG_TYPES = {
	"number" : [Number],
	//"constant" : [String],
	"variable" : [String],
	"equals" : [EquationTree, EquationTree], //LHS, RHS

	"plus" : [EquationTree, EquationTree], //LHS, RHS
	"minus" : [EquationTree, EquationTree], //LHS, RHS
	"plusminus" : [EquationTree, EquationTree], //LHS, RHS
	"times" : [EquationTree, EquationTree], //LHS, RHS
	"exponent" : [EquationTree, EquationTree], //base, exponent

	"divided by" : [EquationTree, EquationTree], //numerator, denominator
	"logarithm" : [EquationTree, EquationTree], //base, argument

	"ln" : [EquationTree],
	"sqrt" : [EquationTree],
	"pm" : [EquationTree],
	"negative" : [EquationTree]
}

//simplify code for unary and binary operators
var NODE_INFO = {
	//infix binary operators
	"equals" : {
		symbol : "=", 
		parenthesize : [function(lhs){return false;}, function(rhs){return false;}]
	},
	"plus" : {
		symbol : "+", 
		parenthesize : [function(lhs){return false;}, function(rhs){return false;}]
	},
	"minus" : {
		symbol : "-", 
		parenthesize : [function(lhs){return false;},
		                function(rhs){return new Set(["plus", "minus", "plusminus"]).has(rhs.nodeType);}]
	},
	"plusminus" : {
		symbol : "\\pm", 
		parenthesize : [function(lhs){return false;},
		                function(rhs){return new Set(["plus", "minus", "plusminus"]).has(rhs.nodeType);}]
	},
	"times" : {
		symbol : "\\cdot", 
		parenthesize : [function(lhs){return new Set(["plus", "minus", "plusminus"]).has(lhs.nodeType);},
		                function(rhs){return new Set(["plus", "minus", "plusminus"]).has(rhs.nodeType);}]
	},
	"exponent" : {
		symbol : "^", 
		parenthesize : [function(lhs){return new Set(["plus", "minus", "plusminus", "times", "divided by", "exponent", "negative", "pm"]).has(lhs.nodeType); /*negative numbers need to be parenthesized*/
		                },
		                function(rhs){return new Set(["plus", "minus", "plusminus", "times", "divided by", "exponent"]).has(rhs.nodeType);}]
	},

	//prefix binary operators
	"divided by" : {
		symbol : "\\frac",
		parenthesize : [function(lhs){return new Set(["divided by"]).has(lhs.nodeType);},
		                function(rhs){return new Set(["divided by"]).has(rhs.nodeType);}]
	},
	"logarithm" : {
		symbol : "\\log_",
		parenthesize : [function(lhs){return new Set(["plus", "minus", "times", "divided by", "exponent"]).has(lhs.nodeType);},
		                function(rhs){return true;}]
	},

	//unary operators (with prefix symbol)
	"sqrt" : {
		symbol : "\\sqrt",
		parenthesize : [function(lhs){return false;}]
	},
	"pm" : {
		symbol : "\\pm",
		parenthesize : [function(lhs){return false;}]
	},
	"negative" : {
		symbol : "-",
		parenthesize : [function(lhs){return !(new Set(["number", "variable"]).has(lhs.nodeType));}]
	},
	"ln" : {
		symbol : "\\ln",
		parenthesize : [function(lhs){return true;}]
	}
}

//simplify code for equation solving
// //TODO: add unary operators
// var NODE_INVERSE = {
// 	"plus" : "minus",
// 	"minus" : "plus",
// 	// "plusminus" //TODO: make a minusplus type
// 	"times" : "divided by",
// 	"divided by" : "times"
// 	// "exponent" : "logarithm" //TODO: need to move around the first argument, not the second
// 	// "logarithm" : "exponent" //TODO: need to move around the first argument, not the second
// 		//also, have a separate inverse function for 2^x and x^2
// }

function throwTypeError(msg) {
	var e = new TypeError(msg);
	console.log(e.stack);
	throw e;
}

function EquationTree(nodeType, args){
	//typechecking
	if(!NODE_ARG_TYPES.hasOwnProperty(nodeType)){
		throwTypeError("\"" + nodeType + "\" is not a valid node type.");
	}
	if(args.length !== NODE_ARG_TYPES[nodeType].length){
		throwTypeError("\"" + nodeType + "\" requires " + NODE_ARG_TYPES[nodeType].length + " arguments; " +
			args.length + " received");
	}
	for (var i = 0; i < args.length; i++) {
		if (! (Object(args[i]) instanceof NODE_ARG_TYPES[nodeType][i]) ){
			throwTypeError("expected an expression of type " + NODE_ARG_TYPES[nodeType][i] +
				" but received an expression of type " + (typeof args[i]));
		}
	}
	//special case: don't include negative numbers
	if(nodeType == "number" && args[0] < 0) {
		throwTypeError("numbers must be positive!")
	}

	this.nodeType = nodeType;
	this.args = args;
}
EquationTree.prototype.toString = function() {
	return this.nodeType + "(" + this.args + ")";
}
EquationTree.prototype.toLaTeX = function(parenthesize = false) {
	var returnString = parenthesize ? "\\left(" : "";

	switch(this.nodeType) {
		case "number":
		case "variable":
			returnString += this.args[0].toString();
			break;
		case "equals":
		case "plus":
		case "minus":
		case "plusminus":
		case "times":
		case "exponent":
			var binaryNodeInfo = NODE_INFO[this.nodeType];
			returnString += "{";
			returnString += this.args[0].toLaTeX(binaryNodeInfo.parenthesize[0](this.args[0]));
			returnString += "} " + binaryNodeInfo.symbol + " {";
			returnString += this.args[1].toLaTeX(binaryNodeInfo.parenthesize[1](this.args[1]));
			returnString += "}";
			break;
		case "ln":
		case "sqrt":
		case "pm":
		case "negative":
			var binaryNodeInfo = NODE_INFO[this.nodeType];
			returnString += binaryNodeInfo.symbol + " {";
			returnString += this.args[0].toLaTeX(binaryNodeInfo.parenthesize[0](this.args[0]));
			returnString += " }";
			break;
		case "divided by":
		case "logarithm":
			var binaryNodeInfo = NODE_INFO[this.nodeType];
			returnString += binaryNodeInfo.symbol + "{";
			returnString += this.args[0].toLaTeX(binaryNodeInfo.parenthesize[0](this.args[0]));
			returnString += "}{";
			returnString += this.args[1].toLaTeX(binaryNodeInfo.parenthesize[1](this.args[1]));
			returnString += "}";
			break;
		default:
			throwTypeError("\"" + this.nodeType + "\" was not recognized!");
			break;
	}

	returnString += parenthesize ? "\\right)" : "";

	return returnString;
}
EquationTree.prototype.isConst = function() {
	return this.nodeType === "number" || this.nodeType === "constant" || 
		(this.nodeType === "negative" && this.args[0].isConst);
}
EquationTree.prototype.lhs = function() {
	if(this.args.length !== 2) throwTypeError("lhs is only defined for binary operators.");
	return this.args[0];
}
EquationTree.prototype.rhs = function() {
	if(this.args.length !== 2) throwTypeError("rhs is only defined for binary operators.");
	return this.args[1];
}

//convenience constructor functions
function ConstNumber(n)       {
	if (n < 0)                  return Negative(ConstNumber(-n));
	else                        return new EquationTree("number",     [n]);
}
function Variable(x)          { return new EquationTree("variable",   [x]); }
function Equals(lhs, rhs)     { return new EquationTree("equals",     [lhs, rhs]); }

function Plus(lhs, rhs)       { return new EquationTree("plus",       [lhs, rhs]); }
function Minus(lhs, rhs)      { return new EquationTree("minus",      [lhs, rhs]); }
function PlusMinus(lhs, rhs)  { return new EquationTree("plusminus",  [lhs, rhs]); }
function Times(lhs, rhs)      { return new EquationTree("times",      [lhs, rhs]); }
function DividedBy(num, den)  { return new EquationTree("divided by", [num, den]); }
function Exponent(base, exp)  { return new EquationTree("exponent",   [base, exp]); }
function Logarithm(base, arg) { return new EquationTree("logarithm",  [base, arg]); }

function Ln(arg)              { return new EquationTree("ln",         [arg]); }
function Sqrt(arg)            { return new EquationTree("sqrt",       [arg]); }
function PM(arg)              { return new EquationTree("pm",         [arg]); }
function Negative(arg)        { return new EquationTree("negative",   [arg]); }

/** varName is a string representing the variable to search for */
EquationTree.prototype.hasVariable = function(varName) {
	if(typeof varName !== "string") throwTypeError ("string expected, but received " + (typeof varName));
	switch(this.nodeType) {
		case "number":
			return false;
		case "variable":
			return varName === this.args[0];
		case "equals":
		case "plus":
		case "minus":
		case "plusminus":
		case "times":
		case "exponent":
		case "divided by":
		case "logarithm":
			var lhs = this.args[0];
			var rhs = this.args[1];
			return lhs.hasVariable(varName) || rhs.hasVariable(varName);
		case "ln":
		case "sqrt":
		case "pm":
		case "negative":
			var arg = this.args[0];
			return arg.hasVariable(varName);
		default:
			throwTypeError("\"" + this.nodeType + "\" was not recognized!");
			return null;

	}
}

/** TODO: optimize */
//TODO: simplify a la NODE_INFO
//for now, just simplify numeric expressions.
//TODO: reduce negative of negative, division of division
/** returns the same expression, but simplified */
EquationTree.prototype.simplify = function(expr) {
	switch(this.nodeType){
		case "variable":
			return this;
		case "number":
			return this;
		case "equals":
			var lhs = this.lhs().simplify();
			var rhs = this.rhs().simplify();
			return Equals(lhs, rhs);
		case "minus":
			var lhs = this.lhs().simplify();
			var rhs = this.rhs().simplify();
			if ( lhs.nodeType === "number" && rhs.nodeType === "number") {
				return ConstNumber(lhs.args[0] - rhs.args[0]);
			}
			return Minus(lhs, rhs);
		case "plus":
			var lhs = this.lhs().simplify();
			var rhs = this.rhs().simplify();
			if ( lhs.nodeType === "number" && rhs.nodeType === "number") {
				return ConstNumber(lhs.args[0] + rhs.args[0]);
			}
			return Plus(lhs, rhs);
		case "times":
			var lhs = this.lhs().simplify();
			var rhs = this.rhs().simplify();
			if ( lhs.nodeType === "number" && rhs.nodeType === "number") {
				return ConstNumber(lhs.args[0] * rhs.args[0]);
			}
			return Times(lhs, rhs);
		case "divided by":
			var lhs = this.lhs().simplify();
			var rhs = this.rhs().simplify();
			if ( lhs.nodeType === "number" && rhs.nodeType === "number") {
				return ConstNumber(lhs.args[0] / rhs.args[0]);
			}
			return DividedBy(lhs, rhs);
		case "exponent":
			var lhs = this.lhs().simplify();
			var rhs = this.rhs().simplify();
			if ( lhs.nodeType === "number" && rhs.nodeType === "number") {
				return ConstNumber(Math.pow(lhs.args[0], rhs.args[0]));
			}
			return Exponent(lhs, rhs);

		case "negative":
			var arg = this.args[0].simplify();
			if ( arg.nodeType === "number") {
				return ConstNumber(-arg.args[0]);
			}
			return Negative(arg);

		case "plusminus":
		case "logarithm":

		case "ln":
		case "sqrt":
		case "pm":
			//TODO
			return this;
			throw Error("Unimplemented");
		default:
			throw Error("Something seriously went wrong in simplify.")

	}
}

/** like _solveFor, but simplifying at the end*/
EquationTree.prototype.solveFor = function(varName) {
	return this._solveFor(varName).simplify();
}

/** TODO: optimize */
/** returns null if not an equation, or it cannot be solved by 
 * the current algorithm, or if the varName is not found; otherwise,
 * return the solveFor */
EquationTree.prototype._solveFor = function(varName) {
	if (this.nodeType !== "equals" || !this.hasVariable(varName)) {
		return null;
	}
	var lhs = this.args[0];
	var rhs = this.args[1];

	if (rhs.hasVariable(varName)) {
		if (lhs.hasVariable(varName)) {
			//for the moment, don't be able to handle if the variable exists in multiple places
			//TODO: start handling these
			return null;
		} else {
			//switch lhs and rhs
			return Equals(rhs, lhs)._solveFor(varName);
		}
	} else { //where lhs.hasVariable(varName)
		switch (lhs.nodeType) {
			case "variable":
				return this;
			case "plus":
				var innerlhs = lhs.args[0];
				var innerrhs = lhs.args[1];
				if(innerlhs.hasVariable(varName)) {
					return Equals(innerlhs, Minus(rhs, innerrhs))._solveFor(varName);
				} else {
					return Equals(Plus(innerrhs, innerlhs), rhs)._solveFor(varName);
				}
			case "minus":
				var innerlhs = lhs.args[0];
				var innerrhs = lhs.args[1];
				return Equals(Plus(innerlhs, Negative(innerrhs)), rhs)._solveFor(varName);
			case "times":
				var innerlhs = lhs.args[0];
				var innerrhs = lhs.args[1];
				if(innerlhs.hasVariable(varName)) {
					return Equals(innerlhs, DividedBy(rhs, innerrhs))._solveFor(varName);
				} else {
					return Equals(Times(innerrhs, innerlhs), rhs)._solveFor(varName);
				}
			case "divided by":
				var innerlhs = lhs.args[0];
				var innerrhs = lhs.args[1];
				return Equals(innerlhs, Times(rhs, innerrhs))._solveFor(varName);
			case "exponent":
				var innerlhs = lhs.args[0];
				var innerrhs = lhs.args[1];
				if(innerlhs.hasVariable(varName)) {
					return Equals(innerlhs, Exponent(rhs, DividedBy(ConstNumber(1), innerrhs)))._solveFor(varName);
				} else {
					//TODO
					throw Error("Unimplemented");
					return Equals(Plus(innerrhs, innerlhs), rhs)._solveFor(varName);
				}

			case "plusminus":
			case "logarithm":
			case "ln":
			case "sqrt":
			case "pm":
				//TODO
				throw Error("Unimplemented");

			case "negative":
				var inner = lhs.args[0];
				return Equals(inner, Negative(rhs))._solveFor(varName);

			case "number":
			case "equals":
			default:
				throw Error("Something seriously went wrong in _solveFor.")
		}
	}
}