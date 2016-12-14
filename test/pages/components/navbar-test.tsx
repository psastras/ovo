declare var window;
window.matchMedia = () => {
  return { matches : false, addListener : () => {}, removeListener: () => {} };
};

import test from 'ava';
import * as React from 'react';
import { shallow } from 'enzyme';
import { Navbar } from 'src/pages/components/navbar';

test('navbar should render links', (t) => {
  const location = { pathname: '/' };
  const params = { traceId: 'traceId' };

  const wrapper = shallow(<Navbar location={location} params={params} />);
  t.deepEqual(wrapper.find('a').length, 1);
});