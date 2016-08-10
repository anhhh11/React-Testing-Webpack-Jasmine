var env = {
  1: {2: 0, 3: 0},
  2: {4: 0, 5: 0},
  3: {6: 0, 7: 10},
  4: {8: 0},
  5: {9: 0},
  6: {},
  7: {10: 120},
  8: {},
  9: {10: 100},
  10: {}
};
var go = function go(from, to) {
  var q = [];
  q.push({position: from, cost: 0, path: []});
  var ret;
  while (q.length > 0) {
    // Implement WRONG, must reference a-star-search, q must be sorted before shift
    let current = q.shift();
    if (current.position.toString() === to.toString()) {
      if (_.isUndefined(ret) || current.cost < ret.cost) {
        ret = current
      }
    }
    let positions = _(env[current.position])
      .map((cost, position, obj) => ({cost: cost + current.cost, position, path: [...current.path, position]}))
      .filter(({cost}) => _.isUndefined(ret) || cost < ret.cost)
      .sortBy(({cost}) => cost)
      .value();
    q.push(...positions);
  }
  return ret;
};
export function run() {
  console.time('uniform-cost-search');
  console.log(go(1, 10, []));
  console.timeEnd('uniform-cost-search');
}