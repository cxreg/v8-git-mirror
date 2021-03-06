// Copyright 2014 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --allow-natives-syntax --use-osr --turbo-osr

var counter = 188;

function gen() {  // defeat compiler cache.
 var num = counter++;
 var src =
  "function f" + num + "(Z,a,b,c) {" +
  "  var x = 0;" +
  "  var y = 0;" +
  "  var z = 0;" +
  "  while (a > 0) { Z(0); x += 19; a--; var j=2; while(j--); }" +
  "  while (b > 0) { Z(1); y += 23; b--; var j=2; while(j--); }" +
  "  while (c > 0) { Z(2); z += 29; c--; var j=2; while(j--); }" +
  "  return x + y + z;" +
  "} f" + num;

  return eval(src);
}

function compiler(a) {  // manual control of OSR compiles.
  var x = 0;
  function count(l) {
    if (l == a && (x++) > 0) {
      %OptimizeFunctionOnNextCall(count.caller, "osr");
    }
  }
  return count;
}

function check(x,a,b,c) {
  function none(l) { }

  for (var i = 0; i < 3; i++) {
    var f = gen();
    assertEquals(x, f(compiler(i), a, b, c));
    assertEquals(x, f(none, a, b, c));
  }
}

check(213, 3,3,3);
check(365, 4,5,6);
check(6948, 99,98,97);
