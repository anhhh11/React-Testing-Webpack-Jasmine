import React from 'react'
import im, {Map, List} from 'immutable';
import Agent from '../libs/agent'
import _ from 'lodash'
window.im = im;
var Hello = React.createClass({
  componentWillMount(){
    this.env = im.fromJS({
      "maps": {
        1: {2: 0, 3: 0},
        2: {4: 0, 5: 0},
        3: {6: 0, 7: 0},
        4: {8: 0},
        5: {9: 0},
        6: {9: 0},
        7: {},
        8: {},
        9: {},
        10: {}
      }
    });
  },
  createThenRunAgent: function () {
    this.agent = Agent(im.fromJS({
      path: [],
      currentPosition: 1,
      destination: 10
    }), this.env);
    this.agent.addAction('go', (position) => {
      return (state, env) => {
        const nextState = state.set("currentPosition", position);
        return {nextState, nextEnv: env};
      }
    });
    this.agent.addGoal('toDestination', (state, env) => {
      return state.get("path").last() === state.get("destination");
    });
    this.agent.printState();
    this.agent.obtain('toDestination', List(['go']));
  },
  render() {
    // require('../libs/iterative-deepening').run();
    // require('../libs/uniform-cost-search').run();
    require('../libs/a-star-search').run();
    // require('../libs/dfs').run();
    // require('../libs/bfs').run();

    return (
      <div>
        <h1>Hello 12345!!</h1>
      </div>
    )
  }
});
export default Hello
