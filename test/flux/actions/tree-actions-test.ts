import test from 'ava';
import * as TreeActions from 'src/flux/actions/tree-actions';

test('constructs a valid action to set annotations to display', (t) => {
  const action = TreeActions.setDefaultAnnotationDetailsDisplay(true);

  t.deepEqual(action.type, 'SET_DEFAULT_ANNOTATION_DETAILS_DISPLAY');
  t.true(action.payload);
});

test('constructs a valid action to filter services', (t) => {
  const action = TreeActions.filterService('service');

  t.deepEqual(action.type, 'FILTER_SERVICE');
  t.deepEqual(action.payload, 'service');
});

test('constructs a valid action to reset filter services', (t) => {
  const action = TreeActions.resetServiceFilters();

  t.deepEqual(action.type, 'RESET_SERVICE_FILTERS');
  t.deepEqual(action.payload, undefined);
});