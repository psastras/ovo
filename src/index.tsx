import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BackTop } from 'antd';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Navbar from './pages/components/navbar';
import Home from './pages/home';
import Trace from './pages/trace';
import store from './flux';
import './index.scss';

// tslint:disable-next-line
const Animate = require('rc-animate');
// tslint:disable-next-line:no-var-requires
const enUS = require('antd/lib/locale-provider/en_US');
// tslint:disable-next-line:no-var-requires
const LocaleProvider = require('antd').LocaleProvider;
const history = syncHistoryWithStore(browserHistory, store);

const layout = (component: JSX.Element) => React.createClass({
  render() {
    return (
      <div>
        <Navbar location={location} />
        <Animate transitionName='fade' transitionAppear>
          <div style={{
            margin: '1em auto 0', maxWidth: '1550px', minWidth: '780px',
            padding: '0 2em',
          }}>
            {React.cloneElement(component, {
              location: this.props.location,
              params: this.props.params,
            })}
          </div>
        </Animate>
      </div>
    );
  },
});

ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={enUS}>
      <div>
        <BackTop />
        <Router history={history}>
          <Route path='/trace/:traceId' component={layout(<Trace />)} />
          <Route path='/' component={layout(<Home />)} />
        </Router>
      </div>
    </LocaleProvider>
  </Provider>,
  document.getElementById('container'),
);