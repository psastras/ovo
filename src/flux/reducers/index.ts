import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

export class State {
  public readonly routing: any;
}

export default combineReducers<State>({
  routing: routerReducer,
});