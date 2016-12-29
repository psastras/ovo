import test from 'ava';
// tslint:disable-next-line:no-var-requires
const ZipkinActionsInjector = require('inject-loader!../../../src/flux/actions/zipkin-actions');

test('constructs a valid action to get service names', async t => {
  const ZipkinActions = ZipkinActionsInjector({
    'src/zipkin': {
      getServices: () => { return [ 'service' ]; },
    },
  });

  const action = ZipkinActions.getServiceNames();
  t.deepEqual(action.type, 'GET_SERVICE_NAMES');
  const payload = await action.payload;
  t.deepEqual(payload, [ 'service' ]);
});

test('constructs a valid action to get traces', async t => {
  const traces = [ { id: {} } ];
  const ZipkinActions = ZipkinActionsInjector({
    'src/zipkin': {
      getTraces: () => { return traces; },
    },
  });

  const action = ZipkinActions.getTraces({});
  t.deepEqual(action.type, 'GET_TRACES');
  const payload = await action.payload;
  t.deepEqual(payload, traces);
});

test('constructs a valid action to get a trace', async t => {
  const trace = { id: {} };
  const ZipkinActions = ZipkinActionsInjector({
    'src/zipkin': {
      getTrace: () => { return trace; },
    },
  });

  const action = ZipkinActions.getTrace();
  t.deepEqual(action.type, 'GET_TRACE');
  const payload = await action.payload;
  t.deepEqual(payload, trace);
});

test('constructs a valid action to get spans', async t => {
  const spans = [[{ id: {} }]];
  const ZipkinActions = ZipkinActionsInjector({
    'src/zipkin': {
      getSpans: () => { return spans; },
    },
  });

  const action = ZipkinActions.getSpans();
  t.deepEqual(action.type, 'GET_SPANS');
  const payload = await action.payload;
  t.deepEqual(payload, spans);
});

test('constructs a valid action to get dependencies', async (t) => {
  const dependencies = [{parent: 'frontend', child: 'backend', callCount: 17}];
  const ZipkinActions = ZipkinActionsInjector({
    'src/zipkin': {
      getDependencies: () => { return dependencies; },
    },
  });

  const action = ZipkinActions.getDependencies();
  t.deepEqual(action.type, 'GET_DEPENDENCIES');
  const payload = await action.payload;
  t.deepEqual(payload, dependencies);
});