define(["exports", "runtime/caml_string", "runtime/caml_builtin_exceptions", "helper2/util2"],
function (exports, CamlString, Caml_builtin_exceptions, Util2) {
    console.log("this is util.js! Indeed!");

    console.log(Caml_builtin_exceptions.out_of_memory)

    exports.valueX = "Fifteen";
    exports.valueY = " twenty-five";
    exports.add = Util2.add;
    exports.valueZ = String.fromCharCode(CamlString.caml_string_get(exports.valueY, 3));

});