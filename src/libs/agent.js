'use strict';
import im, {Map, List, Stack} from 'immutable'
export default function create(initialState = Map(), initialEnvironment = Map()) {
  var state = initialState,
    env = initialEnvironment,
    actions = Map({}),
    goals = Map({});

  function addAction(actionName, actionHandler, actionInfo = Map({})) {
    if (actions.get(actionName)) throw new Error(`Action ${actionName} had already registered`);
    actions =
      actions
        .set(actionName, Map({}))
        .setIn([actionName, 'handler'], actionHandler)
        .setIn([actionName, 'info'], actionInfo);
  }

  function act(actionName, ...args) {
    if (!actions.get(actionName)) throw new Error(`Not implemented action ${actionName}`);
    const actionHandler = actions.getIn([actionName, 'handler']);
    return dispatch(actionHandler(...args), actionName);
  }

  function dispatch(actionFn, actionName = '') {
    const {nextState, nextEnv} = actionFn(state, env);
    if (!nextState) throw new Error(`Action - ${actionName} - not return state`);
    if (!nextEnv) throw new Error(`Action - ${actionName} - not return next env`);
    state = nextState;
    env = nextEnv;
  }

  function addGoal(goalName, predicate, info) {
    if (goals.get(goalName)) throw new Error(`Goal ${goalName} had already registered`);
    goals =
      goals
        .set(goalName, Map({}))
        .setIn([goalName, 'predicate'], predicate)
        .setIn([goalName, 'info'], info);
  }

  function getState() {
    return state;
  }

  function printState() {
    return console.info(getState().toJS());
  }

  function dfs(goalPredicate, goalName) {
    if (state.get('currentPosition')) {
      state = state.update('path', (path) => path.push(state.get('currentPosition')));
    }

    const nextPositions = function (position) {
      var positions = env
        .getIn(["maps", position.toString()]);
      if (!positions) return [];
      return prioritizedPositions(positions);
    };

    const prioritizedPositions = function (positions) {
      return positions.sortBy((distance, pos) => {
        return pos;
      }, (pos1, pos2) => {
        return pos1 > pos2 ? 1 : -1;
      }).keys();
    };


    const go = function go(position, destination, path) {
      if (goalPredicate(state, env)) return path;
      for (let nextPosition of nextPositions(position)) {
        let nextPath = path.push(parseInt(nextPosition));
        go(parseInt(nextPosition), destination, nextPath);
        if (goalPredicate(state, env)) return nextPath;
        state = state.set('path', nextPath);
        // printState()
      }
    };
    go(state.get('currentPosition'), state.get('destination'), state.get('path'));
    if (goalPredicate(state, env)) {
      console.info("Obtained", goalName, state.get('path').toJS());
    } else {
      console.info("Cannot obtained", goalName, state.get('path').toJS());
    }
  }

  function bfs(goalPredicate, goalName) {
    const nextPositions = function (position) {
      var positions = env
        .getIn(["maps", position.toString()]);
      if (!positions) return [];
      return prioritizedPositions(positions);
    };

    const prioritizedPositions = function (positions) {
      return positions.sortBy((distance, pos) => {
        return pos;
      }, (pos1, pos2) => {
        return pos1 > pos2 ? 1 : -1;
      })
        .keySeq()
        .map((pos) => parseInt(pos))
        .toArray();
    };
    var position = state.get('currentPosition');
    var stack = Stack();
    stack = stack.push({position, path: position.toString()});
    while (stack.count() > 0) {
      var {position: nextPosition, path} = stack.first();
      stack = stack.pop();
      if (nextPosition === state.get('destination')) {
        console.info("Obtained", goalName, path);
        state = state.set('path', path.split(',').map((pos) => parseInt(pos)));
        return path;
      }
      var nextPoss = nextPositions(nextPosition);
      nextPoss
        .forEach(function (position) {
          stack = stack.push({position, path: path + ',' + position.toString()});
        });
      // stack = stack.pushAll(nextPoss);
      // state = state.update('path', (path) => path.push(nextPosition));
      // if (nextPoss.length == 0) {
      //   state = state.update('path', (path) => path.pop());
      // }
    }

  }

  function obtain(goalName, actionArray) {
    const goalPredicate = goals.getIn([goalName, "predicate"]);
    const actionHandlers =
      actions
        .filter((v, k) => actionArray.contains(k))
        .valueSeq()
        .map((v) => v.get('handler'));

    if (state.get('currentPosition')) {
      state = state.update('path', (path) => path.push(state.get('currentPosition')));
    }
    bfs(goalPredicate, goalName);
    printState()
  }


  // function go(position, destination, path) {
  //   // console.log(position, destination, path.toJS());
  //   if (position === destination) return path.push(destination);
  //   var nextPath;
  //   for (let nextPosition of nextPositions(position)) {
  //     nextPath = go(parseInt(nextPosition), destination, path.push(position));
  //     if (nextPath) return nextPath;
  //   }
  // }

  // function live() {
  //   var path = go(state.get('currentPosition'), env.get('destination'), List());
  //   if (!path) {
  //     console.log('Not found path');
  //   } else {
  //     console.log('Found', path.toJS());
  //   }
  // }

  return {
    addAction, act, dispatch,
    addGoal,
    getState, printState,
    obtain
    // live, go
  }
}