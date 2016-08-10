var env = {
  1: {2: 0, 3: 0},
  2: {4: 0, 5: 0},
  3: {6: 0, 7: 0},
  4: {8: 0},
  5: {9: 0},
  6: {},
  7: {10: 0},
  8: {},
  9: {},
  10: {}
};
var go = function go(from, to, path, depth) {
  if (from.toString() === to.toString()) return path;
  var foundPath;
  if (depth > 0) {
    _.forEach(_.keys(env[from]), (next) => {
      foundPath = go(next, to, [...path, next], depth - 1);
      if (foundPath) return false;
    });
    if (foundPath) return foundPath;
  }
};
export function run() {
  console.time('bench');
  var ret = (function supervisor(depth) {
    if (depth === 10) return;
    var ret = go(1, 10, [], depth);
    if (ret) {
      return ret;
    } else {
      return supervisor(depth + 1);
    }
  })(1);
  console.timeEnd('bench');
  console.log(ret);
}