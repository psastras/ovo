import test from 'ava';
// tslint:disable-next-line:no-var-requires
const ZikpinInjector = require('inject-loader!../../src/zipkin');

test('should return a list of services', async t => {
  const payload = [ 'service' ];
  const Zipkin = ZikpinInjector({
    superagent: {
      get: (path: string) => { return { text: JSON.stringify(payload) }; },
    },
  });

  const services = await Zipkin.getServices();
  t.deepEqual(services, payload);
});

test('should return a list of span names', async t => {
  const payload = [ 'get' ];
  const Zipkin = ZikpinInjector({
    superagent: {
      get: (path: string) =>
        { return { query: () => { return { text: JSON.stringify(payload) }; } }; },
    },
  });

  const spans = await Zipkin.getSpans('service');
  t.deepEqual(spans, payload);
});

test('should return a trace as a span node', async t => {
  const payload = [{ traceId: 'traceId', id: 'id', name: 'name', timestamp: 0, duration: 1 }];
  const Zipkin = ZikpinInjector({
    superagent: {
      get: (path: string) => { return { text: JSON.stringify(payload) }; },
    },
  });

  const trace = await Zipkin.getTrace('traceId');
  t.deepEqual(trace[0].span, payload[0]);
});

test('should return a list of traces as a span node', async t => {
  const payload = [[{ traceId: 'traceId', id: 'id', name: 'name', timestamp: 0, duration: 1 }]];
  const Zipkin = ZikpinInjector({
    superagent: {
      get: (path: string) =>
        { return { query: () => { return { text: JSON.stringify(payload) }; } }; },
    },
  });

  const trace = await Zipkin.getTraces();
  t.deepEqual(trace[0].span, payload[0][0]);
});