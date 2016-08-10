import _ from 'lodash'
var env = {
  S: {C: 0},
  C: {A: 0, B: 0},
  A: {B: 0},
  B: {G: 0}
};
var go = function go(from, to, path) {
  var s = [];
  s.push({position: from, path: [...path, from.toString()]});
  while (s.length > 0) {
    var cur = s.shift(),
      nexts = _.sortBy(_.keys(env[cur.position]), (s) => -s.charCodeAt());
    if (cur.position.toString() === to.toString()) {
      return cur;
    }
    _.forEach(nexts, function (position) {
      s.push({position, path: [...cur.path, position]});
    });
  }
};
export function run() {
  console.time('uniform-cost-search');
  console.log(go("S", "G", []));
  console.timeEnd('uniform-cost-search');
}