import test from 'ava';
import { parseSpans } from 'src/zipkin';
// tslint:disable-next-line:no-var-requires
const spanRpc = require('./span-rpc.json');
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

test('should be able to parse span-rpc.json', (t) => {
  const spans = parseSpans(spanRpc);

  t.deepEqual([...spans.entries()].length, 5);
  t.deepEqual(spans.getServiceName(), 'zipkin-query');
  t.deepEqual(spans.children.length, 1);
  t.deepEqual(spans.sr, 1458702548467000);
  t.deepEqual(spans.ss, 1458702548853000);
  t.deepEqual(spans.getSeviceSpanStats().get(spans.getServiceName()).duration, spans.ss - spans.sr);
});

test('should return a list of dependency links', async (t) => {
  const payload = [{parent: 'frontend', child: 'backend', callCount: 17}];
  const Zipkin = ZikpinInjector({
    superagent: {
      get: (path: string) =>
        { return { query: () => { return { text: JSON.stringify(payload) }; } }; },
    },
  });

  const dependencies = await Zipkin.getDependencies();
  t.deepEqual(dependencies, payload);
});