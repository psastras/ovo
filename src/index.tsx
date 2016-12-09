import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Navbar from './pages/components/navbar';
import Footer from './pages/components/footer';
import Home from './pages/home';
import store from './flux';
import './index.scss';
const history = syncHistoryWithStore(browserHistory, store);

const layout = (component: JSX.Element) => React.createClass({
  render() {
    return (
      <div style={{ minHeight: '100%', position: 'relative' }}>
        <Navbar />
          {component}
        <Footer />
      </div>
    );
  },
});

ReactDOM.render(
  <Provider store={store}>
    <div style={{ flex: 1 }}>
      <Router history={history}>
        <Route path='*' component={layout(<Home />)} />
      </Router>
    </div>
  </Provider>,
  document.getElementById('container'),
);