import test from 'ava';
import * as TreeActions from 'src/flux/actions/tree-actions';
import reducer from 'src/flux/reducers/tree-reducer';

test('should handle the filter service action', (t) => {
  const initialState = {
    filter: new Set<string>(),
  };

  const action = TreeActions.filterService('service');
  let mutatedState = reducer(initialState, action);

  t.true(mutatedState.filter.has('service'));
  mutatedState = reducer(initialState, action);
  t.false(mutatedState.filter.has('service'));
});

test('should handle the reset service filters action', (t) => {
  const initialState = {
    filter: new Set<string>('service'),
  };

  const action = TreeActions.resetServiceFilters();
  const mutatedState = reducer(initialState, action);
  t.deepEqual(mutatedState.filter.size, 0);
});

test('should handle the default annotation display action', (t) => {
  const initialState = {
    display: false,
  };

  let action = TreeActions.setDefaultAnnotationDetailsDisplay(true);
  let mutatedState = reducer(initialState, action);
  t.true(mutatedState.display);

  action = TreeActions.setDefaultAnnotationDetailsDisplay(false);
  mutatedState = reducer(initialState, action);
  t.false(mutatedState.display);
});