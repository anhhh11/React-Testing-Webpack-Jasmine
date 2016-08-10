var env = {
  "S": {"A": 2, "B": 1},
  "A": {"B": 1, "C": 3, "D": 1},
  "B": {"D": 5, "G": 10},
  "C": {"G": 7},
  "D": {"G": 4}
};
var h = {
  "S": 0,
  "A": 3,
  "B": 3,
  "C": 1,
  "D": 2,
  "G": 0,
};
var go = function go(from, to) {
  var q = [];
  var ret;
  var start = {
    position: from,
    g: 0,
    h: 0,
    f: 0,
    path: [from]
  };
  q.push(start);
  var closedList = [];
  var ret;
  while (q.length > 0) {
    console.info(JSON.stringify(q));
    _(q)
      .sortBy(({f}) => f)
      .each(function (position, idx) {
        q[idx] = position;
      });
    let current = q.shift();
    if (current.position === to) {
      return current;
    }
    console.log('expand', current.position);
    let positions = env[current.position];
    let successors = [];
    _.each(positions, function (g, pos) {
      var successor = {position: pos};
      successor.path = [...current.path, pos];
      successor.g = current.g + g;
      successor.h = h[pos];
      successor.f = successor.g + successor.h;
      var node = _.find(q, (n) => n.position === pos);
      if (node && node.f < successor.f) {
        return;
      }
      var node = _.find(closedList, (n) => n.position === pos);
      if (node && node.f < successor.f) {
        return;
      }
      q.push(successor);
    });
    closedList.push(current);
  }
};
export function run() {
  console.time('a-star');
  console.log(go("S", "G", []));
  console.timeEnd('a-star');
}

function isAchievedGoal() {
  return state === goalState;
}