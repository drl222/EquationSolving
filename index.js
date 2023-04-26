console.log("index.js");

jQuery.htmlPrefilter = function( html ) {
	return html;
};

requirejs.config({
	packages: [
		{name:'runtime', location:'bucklescript/runtime'},
		{name:'stdlib', location:'bucklescript/stdlib'}
	],
	paths : {
		"mathjax": "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML&amp;delayStartupUntil=configured",
		"jquery" : "jquery-2.2.3.min"
	},
	shim: {
		"mathjax": {
			exports: "MathJax",
			init: function () {
				MathJax.Hub.Config({ 
					TeX: { extensions: ["color.js"], equationNumbers: { autoNumber: "AMS" } },
					showMathMenu: false });
				return MathJax;
			}
		}
	}
});

requirejs(["jquery", "EquationTree", "mathjax"], function($, EquationTree, MathJax) {
	var a = EquationTree.variable("a");
	var minus_three = EquationTree.number(-3.0);
	var five = EquationTree.number(5.5);
	var minus_three_plus_five = EquationTree.plus(minus_three, five);

	var a_is_minus_three = EquationTree.equals(a, minus_three_plus_five);

	console.log(EquationTree.equation_to_string(a_is_minus_three));
	console.log(EquationTree.equation_to_LaTeX(a_is_minus_three));

	$("#main_list").append("<li>HELLO!</li>");
	$("#main_list").append("<li>\\begin{equation}" + EquationTree.equation_to_LaTeX(a_is_minus_three) + "\\end{equation}</li>");
	$("#main_list").append("<li>\\begin{equation}" + EquationTree.equation_to_LaTeX(EquationTree.equation_simplify(a_is_minus_three)) + "\\end{equation}</li>");

	$("#main_list").append("<li>HELLO!</li>");
	$("#main_list").append("<li>\\begin{equation}" + EquationTree.to_LaTeX(EquationTree.plus(minus_three, minus_three_plus_five)) + "\\end{equation}</li>");
	$("#main_list").append("<li>\\begin{equation}" + EquationTree.to_LaTeX(EquationTree.simplify(EquationTree.plus(minus_three, minus_three_plus_five))) + "\\end{equation}</li>");

	$("#main_list").append("<li>HELLO!</li>");
	$("#main_list").append("<li>\\begin{equation}" + EquationTree.to_LaTeX(EquationTree.plus(five, five)) + "\\end{equation}</li>");
	$("#main_list").append("<li>\\begin{equation}" + EquationTree.to_LaTeX(EquationTree.simplify(EquationTree.plus(five, five))) + "\\end{equation}</li>");

	MathJax.Hub.Queue(["Typeset",MathJax.Hub,"main_list"]);
});
