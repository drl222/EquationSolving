let test_suite test_name lst =

  let rec helper n = function
    | (val1, val2)::tl ->
      if val1 = val2 then
        helper (n+1) tl
      else
        Printf.printf "  FAILURE: %s failed test case number %d\n" test_name n
    | [] ->
      Printf.printf "  %s passed all %d test case(s)\n" test_name (n - 1)
  in

  helper 1 lst