declare var window;
window.matchMedia = window.matchMedia || (() => {
    return { matches: false, addListener: () => {}, removeListener: () => {} };
});

import test from 'ava';
import reducer from 'src/flux/reducers/zipkin-reducer';

test('should handle the get service names action', (t) => {
  const servicesPayload = [ 'service' ];
  const initialState = {};
  const mutatedState =
    reducer(initialState, { type: 'GET_SERVICE_NAMES', payload: servicesPayload });
  t.deepEqual(mutatedState.services, servicesPayload);
});

test('should handle the get spans action', (t) => {
  const spansPayload = [[{ id: {} }]];
  const initialState = {};
  const mutatedState = reducer(initialState, { type: 'GET_SPANS', payload: spansPayload });
  t.deepEqual(mutatedState.spans, spansPayload);
});

test('should handle the get trace action', (t) => {
  const tracePayload = { id: {} };
  const traceJSON = JSON.stringify(tracePayload);
  const initialState = {};
  const mutatedState =
    reducer(initialState, { type: 'GET_TRACE', payload: [ tracePayload, traceJSON ] });
  t.deepEqual(mutatedState.trace, tracePayload);
  t.deepEqual(mutatedState.trace_json, traceJSON);
});

test('should handle the get traces action', (t) => {
  const tracesPayload = [[{ id: {} }]];
  const initialState = {};
  const mutatedState =
    reducer(initialState, { type: 'GET_TRACES', payload: tracesPayload });
  t.deepEqual(mutatedState.traces, tracesPayload);
});