open UnitTest
open EquationTree

let () = print_endline "begin\n"

let () = test_suite "main" [
	3, 3;
	33, 22 + 11
]

let () = test_suite "failure" [
	3, 33
]

let () = test_suite "equals" [
	number 6.6, simplify(number 6.6)
]

let () = print_endline "\nend"