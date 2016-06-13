open UnitTest
open EquationTree

let () = print_endline "begin\n"

let () =
	let five = number 5. in
	let six = number 6. in
	let ten = number 10. in
	let six_plus_ten = plus six ten in
	let five_plus_sixplusten = plus five six_plus_ten in
	let sixplusten_plus_five = plus six_plus_ten five in

	let six_minus_ten = minus six ten in

	test_suite "to_LaTeX (positive)" [
		to_LaTeX six, "6";
		to_LaTeX ten, "10";
		to_LaTeX six_plus_ten, "{6} + {10}";
		to_LaTeX five_plus_sixplusten, "{5} + {\\left({6} + {10}\\right)}";
		to_LaTeX sixplusten_plus_five, "{{6} + {10}} + {5}";

		to_LaTeX six_minus_ten, "{6} - {10}";
	]

let () = print_endline "\nend"