all: EquationTree.js

EquationTree.js: EquationTree.ml EquationTree.mli
	bsc -I bucklescript/stdlib/ -I bucklescript/runtime/ EquationTree.mli EquationTree.ml

# bucklescript/UnitTest.cmo: bucklescript/UnitTest.ml
# 	ocamlc -c bucklescript/UnitTest.ml

# bucklescript/UnitTest.cma: bucklescript/UnitTest.cmo
# 	ocamlc -o bucklescript/UnitTest.cma -a bucklescript/UnitTest.cmo

Test: bucklescript/UnitTest.ml EquationTreeTesting.ml
	ocamlc -o Test -I bucklescript bucklescript/UnitTest.ml EquationTree.mli EquationTree.ml EquationTreeTesting.ml

clean:
	rm -f bucklescript/UnitTest.cmi bucklescript/UnitTest.cmx
	rm -f EquationTreeTesting.cmi EquationTreeTesting.cmx
	rm -f Test.cmi Test.cmx Test