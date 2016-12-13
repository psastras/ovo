declare var window;
window.matchMedia = window.matchMedia || (() => {
    return { matches: false, addListener: () => {}, removeListener: () => {} };
});

import test from 'ava';
import { treeReducer, zipkinReducer } from 'src/flux/reducers';

test('should export the tree reducer', (t) => {
  t.not(treeReducer, undefined);
});

test('should export the zipkin reducer', (t) => {
  t.not(zipkinReducer, undefined);
});