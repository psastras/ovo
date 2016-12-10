import { applyMiddleware, createStore } from 'redux';
import { combineReducers } from 'redux';
import * as promiseMiddleware from 'redux-promise';
import { zipkinReducer} from './reducers';
import { browserHistory } from 'react-router';
import { routerMiddleware as createRouterMiddleware } from 'react-router-redux';
import { routerReducer } from 'react-router-redux';

const routerMiddleware = createRouterMiddleware(browserHistory);
const middleware = [routerMiddleware, promiseMiddleware];

declare const process;
if (process.env.NODE_ENV === 'development') {
  // tslint:disable-next-line:no-var-requires
  const createReduxLogger = require('redux-logger');
  middleware.push(createReduxLogger());
}

const store = createStore(
  combineReducers({
    routing: routerReducer,
    zipkin: zipkinReducer,
  }),
  applyMiddleware(...middleware),
);

export default store;