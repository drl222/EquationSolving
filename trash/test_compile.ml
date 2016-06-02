(*var NODE_ARG_TYPES = {
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
*)
(* 
type equation_tree =
	| Number of float
	| Variable of string
	| Equals of equation_tree * equation_tree

let rec print_et = function
	| Number n -> print_float n
	| Variable s -> print_endline s
	| Equals (et1, et2) -> print_et et1; print_et et2

let number f = Number f
let variable x = Variable x
let equals et1 et2 = Equals (et1, et2) *)

let () = print_int 5
let x = 14