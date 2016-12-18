import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BackTop } from 'antd';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Navbar from './pages/components/navbar';
import store from './flux';
import './index.scss';
import './index.less';

// tslint:disable-next-line
const Animate = require('rc-animate');
// tslint:disable-next-line:no-var-requires
const enUS = require('antd/lib/locale-provider/en_US');
// tslint:disable-next-line:no-var-requires
const LocaleProvider = require('antd').LocaleProvider;
const history = syncHistoryWithStore(browserHistory, store);

const layout = (component: any) => React.createClass({
  render() {
    return (
      <div>
        <Navbar location={location} params={this.props.params} />
        <Animate transitionName='fade' transitionAppear>
          <div style={{
            margin: '1em auto 0', maxWidth: '1550px', minWidth: '780px',
            padding: '0 2em',
          }}>
            {React.createElement(component, {
              location: this.props.location,
              params: this.props.params,
            })}
          </div>
        </Animate>
      </div>
    );
  },
});

declare var System;

ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={enUS}>
      <div>
        <BackTop />
        <Router history={history}>
          <Route path='/trace/:traceId'
            getComponent={() => System.import('./pages/trace').then(c => layout(c.default))} />
          <Route path='/dependencies'
            getComponent={() => System.import('./pages/dependencies')
            .then(c => layout(c.default))} />
          <Route path='/'
            getComponent={() => System.import('./pages/home').then(c => layout(c.default))} />
        </Router>
      </div>
    </LocaleProvider>
  </Provider>,
  document.getElementById('container'),
);