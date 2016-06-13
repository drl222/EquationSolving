type expression =
  (* single values *)
  | Number of float (* always a positive number *)
  | Variable of string
  (* unary operators *)
  | Negative of expression
  (* binary operators *)
  | Plus of expression * expression 
  | Minus of expression * expression

(* the following helper functions take in an expression, but mainly just pattern match
 * the type of the outermost expression *)
let rec is_constant = function
  | Number _ -> true
  | Variable _ -> true
  | Negative ex -> is_constant ex
  | Plus _ -> false
  | Minus _ -> false
let get_binary_operator_symbol = function
  | Plus _ -> "+"
  | Minus _ -> "-"
  | Number _
  | Variable _
  | Negative _ ->
    failwith "Not a valid binary operator"
let get_binary_operator = function
  | Plus _ -> (+.)
  | Minus _ -> (-.)
  | Number _
  | Variable _
  | Negative _ ->
    failwith "Not a valid binary operator"

(* http://stackoverflow.com/questions/30732709/does-ocaml-have-c-like-round-and-trunc-functions *)
let roundf x = snd (modf (x +. copysign 0.5 x))

(** Some n if the given expr is Number n, None otherwise*)
let number_option_of_expression = function
  | Number n -> Some n
  | _ -> None
let number_of_number_option = function
  | Some n -> n
  | None -> failwith "not a number"

let rec to_string = function
  | Number n -> "Number " ^ (string_of_float n)
  | Variable x -> "Variable " ^ x
  | Negative ex -> "Negative of (" ^ (to_string ex) ^ ")"
  | Plus (ex1, ex2) -> "Sum of (" ^ (to_string ex1) ^ ") and (" ^ (to_string ex2) ^ ")"
  | Minus (ex1, ex2) -> "Difference between (" ^ (to_string ex1) ^ ") and (" ^ (to_string ex2) ^ ")"

let rec to_LaTeX_helper parenthesize expr = 
  (if parenthesize then "\\left(" else "") ^
  (match expr with 
    | Number n ->
      (* if it's an int, then print it as an int
       * 
       * note that my check for if it's an int is very far from correct - it only checks
       * for exact equality of a float with an integer value
       *
       * all floats within a few million (if they're C-floats) or quintillion (if they're C-doubles)
       * are exactly representable, but results of calculations may not be these exact values
       *
       * I'm not actually sure which one OCaml uses, and if there's some weird off-by-one issue
       * with a garbage collection flag, but either way, for normal-sized numbers, it's no problem*)
      if roundf n <> n then (string_of_float n)
      else string_of_int (int_of_float n)
    | Variable x -> x
    | Negative ex -> "-" ^ (
        if is_constant ex then to_LaTeX_helper false ex
        else to_LaTeX_helper true ex
      )
    | ( Plus (ex1, ex2) as outer_ex )
    | ( Minus (ex1, ex2) as outer_ex )
      -> "{" ^
      ( to_LaTeX_helper false ex1 ) ^ (* lhs of plus and minus never need to be parenthesized *)
      "} " ^
      ( get_binary_operator_symbol outer_ex ) ^
      " {" ^
      ( if is_constant ex2 then to_LaTeX_helper false ex2
        else to_LaTeX_helper true ex2 ) ^
      "}"
  ) ^
  (if parenthesize then "\\right)" else "")

let rec to_LaTeX expr = to_LaTeX_helper false expr

let rec evaluate = function
  | Number n -> Some n
  | Variable x -> None
  | Negative ex ->
    (match evaluate ex with
      | Some n -> Some (-. n)
      | None -> None
    )
  | ( Plus (ex1, ex2) as outer_ex )
  | ( Minus (ex1, ex2) as outer_ex ) ->
    (match (evaluate ex1), (evaluate ex2) with
      | None, _
      | _, None -> None
      | Some n1, Some n2 -> Some ( (get_binary_operator outer_ex) n1 n2 )
    )

let rec simplify = function
  (* values *)
  | Number n -> Number n
  | Variable x -> Variable x
  (* unary *)
  | Negative (Number 0.) -> Number 0.
  | Negative (Negative ex) -> simplify ex
  | Negative ex -> Negative (simplify ex)
  (* addition and subtraction with negatives *)
  | Plus (Negative ex1, Negative ex2) ->
      Negative ( Plus (simplify ex1, simplify ex2) )
  | Plus (ex1, Negative ex2) ->
      Minus (simplify ex1, simplify ex2)
  | Plus (Negative ex1, ex2) ->
      Minus (simplify ex2, simplify ex1)
  | Minus (Negative ex1, Negative ex2) ->
      Minus (simplify ex2, simplify ex1)
  | Minus (ex1, Negative ex2) ->
      Plus (simplify ex1, simplify ex2)
  | Minus (Negative ex1, ex2) ->
      Negative ( Plus (simplify ex1, simplify ex2) )
  (* normal-case binary operators *)
  | ( Plus (ex1, ex2) as outer_ex )
  | ( Minus (ex1, ex2) as outer_ex )
    ->
      let ex1' = simplify ex1 in
      let ex2' = simplify ex2 in
      let ex1'' = number_option_of_expression ex1' in
      let ex2'' = number_option_of_expression ex2' in

      if ex1'' = None || ex2'' = None then
        Plus (ex1', ex2')
      else
        Number ((get_binary_operator outer_ex) (number_of_number_option ex1'') (number_of_number_option ex2''))

type equation = expression * expression
let rec equation_to_string (ex1, ex2) = 
  "(" ^ (to_string ex1) ^ ") = (" ^ (to_string ex2) ^ ")"
let rec equation_to_LaTeX (ex1, ex2) = 
  "{" ^ (to_LaTeX ex1) ^ "} = {" ^ (to_LaTeX ex2) ^ "}"
let rec equation_simplify (ex1, ex2) = 
  (simplify ex1, simplify ex2)

(* expose the variant types to Javascript *)
let number x = 
  if x >= 0.0 then Number x
  else Negative ( Number (-. x) )
let variable x = Variable x
let negative x = Negative x
let plus x y = Plus (x, y)
let minus x y = Minus (x, y)

let equals x y = (x, y)