// GENERATED CODE BY BUCKLESCRIPT VERSION 0.3 , PLEASE EDIT WITH CARE
'use strict';

var Caml_builtin_exceptions = require("./bucklescript/runtime/caml_builtin_exceptions");
var Caml_float              = require("./bucklescript/runtime/caml_float");
var Pervasives              = require("./bucklescript/stdlib/pervasives");
var Block                   = require("./bucklescript/runtime/block");
var Curry                   = require("./bucklescript/runtime/curry");

function is_constant(_param) {
  while(true) {
    var param = _param;
    switch (param.tag | 0) {
      case 0 : 
      case 1 : 
          return /* true */1;
      case 2 : 
          _param = param[0];
          continue ;
          case 3 : 
      case 4 : 
          return /* false */0;
      
    }
  };
}

function get_binary_operator_symbol(param) {
  switch (param.tag | 0) {
    case 3 : 
        return "+";
    case 4 : 
        return "-";
    default:
      throw [
            Caml_builtin_exceptions.failure,
            "Not a valid binary operator"
          ];
  }
}

function get_binary_operator(param) {
  switch (param.tag | 0) {
    case 3 : 
        return function (prim, prim$1) {
          return prim + prim$1;
        };
    case 4 : 
        return function (prim, prim$1) {
          return prim - prim$1;
        };
    default:
      throw [
            Caml_builtin_exceptions.failure,
            "Not a valid binary operator"
          ];
  }
}

function roundf(x) {
  return Caml_float.caml_modf_float(x + Caml_float.caml_copysign_float(0.5, x))[1];
}

function number_option_of_expression(param) {
  if (param.tag) {
    return /* None */0;
  }
  else {
    return /* Some */[param[0]];
  }
}

function number_of_number_option(param) {
  if (param) {
    return param[0];
  }
  else {
    throw [
          Caml_builtin_exceptions.failure,
          "not a number"
        ];
  }
}

function to_string(param) {
  switch (param.tag | 0) {
    case 0 : 
        return "Number " + Pervasives.string_of_float(param[0]);
    case 1 : 
        return "Variable " + param[0];
    case 2 : 
        return "Negative of (" + (to_string(param[0]) + ")");
    case 3 : 
        return "Sum of (" + (to_string(param[0]) + (") and (" + (to_string(param[1]) + ")")));
    case 4 : 
        return "Difference between (" + (to_string(param[0]) + (") and (" + (to_string(param[1]) + ")")));
    
  }
}

function to_LaTeX_helper(parenthesize, expr) {
  var $js;
  var exit = 0;
  switch (expr.tag | 0) {
    case 0 : 
        var n = expr[0];
        $js = roundf(n) !== n ? Pervasives.string_of_float(n) : "" + (n | 0);
        break;
    case 1 : 
        $js = expr[0];
        break;
    case 2 : 
        var ex = expr[0];
        $js = "-" + (
          is_constant(ex) ? to_LaTeX_helper(/* false */0, ex) : to_LaTeX_helper(/* true */1, ex)
        );
        break;
    case 3 : 
    case 4 : 
        exit = 1;
        break;
    
  }
  if (exit === 1) {
    var ex2 = expr[1];
    var ex1 = expr[0];
    $js = "{" + ((
        is_constant(ex1) ? to_LaTeX_helper(/* false */0, ex1) : to_LaTeX_helper(/* true */1, ex1)
      ) + ("} " + (get_binary_operator_symbol(expr) + (" {" + ((
                is_constant(ex2) ? to_LaTeX_helper(/* false */0, ex2) : to_LaTeX_helper(/* true */1, ex2)
              ) + "}")))));
  }
  return (
          parenthesize ? "\\left(" : ""
        ) + ($js + (
            parenthesize ? "\\right)" : ""
          ));
}

function to_LaTeX(expr) {
  return to_LaTeX_helper(/* false */0, expr);
}

function evaluate(param) {
  var exit = 0;
  switch (param.tag | 0) {
    case 0 : 
        return /* Some */[param[0]];
    case 1 : 
        return /* None */0;
    case 2 : 
        var match = evaluate(param[0]);
        if (match) {
          return /* Some */[-match[0]];
        }
        else {
          return /* None */0;
        }
    case 3 : 
    case 4 : 
        exit = 1;
        break;
    
  }
  if (exit === 1) {
    var match$1 = evaluate(param[0]);
    var match$2 = evaluate(param[1]);
    if (match$1 && match$2) {
      return /* Some */[Curry._2(get_binary_operator(param), match$1[0], match$2[0])];
    }
    else {
      return /* None */0;
    }
  }
  
}

function simplify(_param) {
  while(true) {
    var param = _param;
    var exit = 0;
    var ex1;
    var ex2;
    var outer_ex;
    switch (param.tag | 0) {
      case 0 : 
          return /* Number */Block.__(0, [param[0]]);
      case 1 : 
          return /* Variable */Block.__(1, [param[0]]);
      case 2 : 
          var ex = param[0];
          switch (ex.tag | 0) {
            case 0 : 
                if (ex[0] !== 0) {
                  return /* Negative */Block.__(2, [simplify(ex)]);
                }
                else {
                  return /* Number */Block.__(0, [0]);
                }
            case 2 : 
                _param = ex[0];
                continue ;
                default:
              return /* Negative */Block.__(2, [simplify(ex)]);
          }
          break;
      case 3 : 
          var ex1$1 = param[0];
          var exit$1 = 0;
          if (ex1$1.tag === 2) {
            var match = param[1];
            if (match.tag === 2) {
              return /* Negative */Block.__(2, [/* Plus */Block.__(3, [
                            simplify(ex1$1[0]),
                            simplify(match[0])
                          ])]);
            }
            else {
              exit$1 = 2;
            }
          }
          else {
            var match$1 = param[1];
            if (match$1.tag === 2) {
              return /* Minus */Block.__(4, [
                        simplify(ex1$1),
                        simplify(match$1[0])
                      ]);
            }
            else {
              exit$1 = 2;
            }
          }
          if (exit$1 === 2) {
            if (ex1$1.tag === 2) {
              return /* Minus */Block.__(4, [
                        simplify(param[1]),
                        simplify(ex1$1[0])
                      ]);
            }
            else {
              ex1 = ex1$1;
              ex2 = param[1];
              outer_ex = param;
              exit = 1;
            }
          }
          break;
      case 4 : 
          var ex1$2 = param[0];
          var exit$2 = 0;
          if (ex1$2.tag === 2) {
            var match$2 = param[1];
            if (match$2.tag === 2) {
              return /* Minus */Block.__(4, [
                        simplify(match$2[0]),
                        simplify(ex1$2[0])
                      ]);
            }
            else {
              exit$2 = 2;
            }
          }
          else {
            var match$3 = param[1];
            if (match$3.tag === 2) {
              return /* Plus */Block.__(3, [
                        simplify(ex1$2),
                        simplify(match$3[0])
                      ]);
            }
            else {
              exit$2 = 2;
            }
          }
          if (exit$2 === 2) {
            if (ex1$2.tag === 2) {
              return /* Negative */Block.__(2, [/* Plus */Block.__(3, [
                            simplify(ex1$2[0]),
                            simplify(param[1])
                          ])]);
            }
            else {
              ex1 = ex1$2;
              ex2 = param[1];
              outer_ex = param;
              exit = 1;
            }
          }
          break;
      
    }
    if (exit === 1) {
      var ex1$prime = simplify(ex1);
      var ex2$prime = simplify(ex2);
      var ex1$prime$prime = number_option_of_expression(ex1$prime);
      var ex2$prime$prime = number_option_of_expression(ex2$prime);
      if (ex1$prime$prime === /* None */0 || ex2$prime$prime === /* None */0) {
        return /* Plus */Block.__(3, [
                  ex1$prime,
                  ex2$prime
                ]);
      }
      else {
        return /* Number */Block.__(0, [Curry._2(get_binary_operator(outer_ex), number_of_number_option(ex1$prime$prime), number_of_number_option(ex2$prime$prime))]);
      }
    }
    
  };
}

function equation_to_string(param) {
  return "(" + (to_string(param[0]) + (") = (" + (to_string(param[1]) + ")")));
}

function equation_to_LaTeX(param) {
  return "{" + (to_LaTeX(param[0]) + ("} = {" + (to_LaTeX(param[1]) + "}")));
}

function equation_simplify(param) {
  return /* tuple */[
          simplify(param[0]),
          simplify(param[1])
        ];
}

function number(x) {
  if (x >= 0.0) {
    return /* Number */Block.__(0, [x]);
  }
  else {
    return /* Negative */Block.__(2, [/* Number */Block.__(0, [-x])]);
  }
}

function variable(x) {
  return /* Variable */Block.__(1, [x]);
}

function negative(x) {
  return /* Negative */Block.__(2, [x]);
}

function plus(x, y) {
  return /* Plus */Block.__(3, [
            x,
            y
          ]);
}

function minus(x, y) {
  return /* Minus */Block.__(4, [
            x,
            y
          ]);
}

function equals(x, y) {
  return /* tuple */[
          x,
          y
        ];
}

exports.to_string          = to_string;
exports.equation_to_string = equation_to_string;
exports.to_LaTeX           = to_LaTeX;
exports.equation_to_LaTeX  = equation_to_LaTeX;
exports.evaluate           = evaluate;
exports.simplify           = simplify;
exports.equation_simplify  = equation_simplify;
exports.number             = number;
exports.variable           = variable;
exports.negative           = negative;
exports.plus               = plus;
exports.minus              = minus;
exports.equals             = equals;
/* No side effect */
