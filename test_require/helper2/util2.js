define(["exports", "runtime/caml_string", "runtime/caml_builtin_exceptions"],
function (exports, CamlString, Caml_builtin_exceptions) {
    console.log("Yo! I'm util2.js!");

    console.log(Caml_builtin_exceptions.out_of_memory)

    exports.valueX = "Fifteen";
    exports.valueY = " twenty-five";
    exports.add = CamlString.add;
    exports.valueZ = String.fromCharCode(CamlString.caml_string_get(exports.valueY, 3));

});