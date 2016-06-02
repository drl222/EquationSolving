console.log("main.js");
requirejs.config({
	packages: [
		{name:'runtime', location:'../bucklescript/runtime'},
		{name:'stdlib', location:'../bucklescript/stdlib'},
		{name:'bucklescript', location:'bucklescript/stdlib'}
	]
});

requirejs(["helper/util"], function(util) {
    console.log("hello from main");
    console.log(util.add(util.valueX, util.valueY));
    console.log(util.valueZ);
});