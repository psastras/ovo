import test from 'ava';
import Actions from 'src/flux/actions';

test('exports tree actions', (t) => {
  t.not(Actions.tree, undefined);
});

test('exports zipkin actions', (t) => {
  t.not(Actions.zipkin, undefined);
});