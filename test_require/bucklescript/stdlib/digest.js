// GENERATED CODE BY BUCKLESCRIPT VERSION 0.3 , PLEASE EDIT WITH CARE
'use strict';
define(["exports", "../runtime/caml_builtin_exceptions", "./pervasives", "./char", "../runtime/caml_md5", "./string", "../runtime/caml_string"],
  function(exports, Caml_builtin_exceptions, Pervasives, Char, Caml_md5, $$String, Caml_string){
    'use strict';
    function string(str) {
      return Caml_md5.caml_md5_string(str, 0, str.length);
    }
    
    function bytes(b) {
      return string(Caml_string.bytes_to_string(b));
    }
    
    function substring(str, ofs, len) {
      if (ofs < 0 || len < 0 || ofs > (str.length - len | 0)) {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "Digest.substring"
            ];
      }
      else {
        return Caml_md5.caml_md5_string(str, ofs, len);
      }
    }
    
    function subbytes(b, ofs, len) {
      return substring(Caml_string.bytes_to_string(b), ofs, len);
    }
    
    function file(filename) {
      Pervasives.open_in_bin(filename);
      var exit = 0;
      var d;
      try {
        d = function () {
            throw "caml_md5_chan not implemented by bucklescript yet\n";
          }();
        exit = 1;
      }
      catch (e){
        (function () {
              throw "caml_ml_close_channel not implemented by bucklescript yet\n";
            }());
        throw e;
      }
      if (exit === 1) {
        (function () {
              throw "caml_ml_close_channel not implemented by bucklescript yet\n";
            }());
        return d;
      }
      
    }
    
    var output = Pervasives.output_string
    
    function input(chan) {
      return Pervasives.really_input_string(chan, 16);
    }
    
    function char_hex(n) {
      return n + (
              n < 10 ? /* "0" */48 : 87
            ) | 0;
    }
    
    function to_hex(d) {
      var result = new Array(32);
      for(var i = 0; i <= 15; ++i){
        var x = d.charCodeAt(i);
        result[(i << 1)] = char_hex((x >>> 4));
        result[(i << 1) + 1 | 0] = char_hex(x & 15);
      }
      return Caml_string.bytes_to_string(result);
    }
    
    function from_hex(s) {
      if (s.length !== 32) {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "Digest.from_hex"
            ];
      }
      var digit = function (c) {
        if (c >= 65) {
          if (c >= 97) {
            if (c >= 103) {
              throw [
                    Caml_builtin_exceptions.invalid_argument,
                    "Digest.from_hex"
                  ];
            }
            else {
              return (c - /* "a" */97 | 0) + 10 | 0;
            }
          }
          else if (c >= 71) {
            throw [
                  Caml_builtin_exceptions.invalid_argument,
                  "Digest.from_hex"
                ];
          }
          else {
            return (c - /* "A" */65 | 0) + 10 | 0;
          }
        }
        else if (c > 57 || c < 48) {
          throw [
                Caml_builtin_exceptions.invalid_argument,
                "Digest.from_hex"
              ];
        }
        else {
          return c - /* "0" */48 | 0;
        }
      };
      var $$byte = function (i) {
        return (digit(s.charCodeAt(i)) << 4) + digit(s.charCodeAt(i + 1 | 0)) | 0;
      };
      var result = new Array(16);
      for(var i = 0; i <= 15; ++i){
        result[i] = Char.chr($$byte((i << 1)));
      }
      return Caml_string.bytes_to_string(result);
    }
    
    var compare = $$String.compare;
    
    exports.compare   = compare;
    exports.string    = string;
    exports.bytes     = bytes;
    exports.substring = substring;
    exports.subbytes  = subbytes;
    exports.file      = file;
    exports.output    = output;
    exports.input     = input;
    exports.to_hex    = to_hex;
    exports.from_hex  = from_hex;
    
  })
/* No side effect */
