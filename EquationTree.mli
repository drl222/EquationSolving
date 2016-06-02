type expression
type equation

val to_string : expression -> string
val equation_to_string: equation -> string

val to_LaTeX : expression -> string
val equation_to_LaTeX: equation -> string

(* arithmetic simplification *)
val evaluate : expression -> float option

(* algebraic simplification, including arithmetic simplification *)
val simplify : expression -> expression
val equation_simplify : equation -> equation

(* expose the variant types to Javascript *)
val number : float -> expression
val variable : string -> expression
val negative : expression -> expression
val plus : expression -> expression -> expression
val minus : expression -> expression -> expression
val equals : expression -> expression -> equation