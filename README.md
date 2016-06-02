#Equation Solving Game

This (once it's completed) will be a puzzle game wherein the player is given some starting equation and some ending equation, and a series of intermediate equations and identities. (S)He then is tasked to use the identities to transform the starting equation into the ending equation.

##Code Layout
The basic layout of the "backend" code is:
```
OCaml Scripts (mainly, EquationTree.ml)
     ↓
(compiled with bucklescript, https://github.com/bloomberg/bucklescript)
     ↓
Compiled Javascript (e.g. EquationTree.js)
```

And the "frontend" code is written in Javascript, with the following libraries:

- require.js (to use the packages outputted by bucklescript)
- JQuery (for easy DOM manipulation)
- MathJax (to format LaTeX in the browser)

(I use quotes around frontend and backend because everything is actually frontend.)
And of course basic HTML and CSS is necessary.