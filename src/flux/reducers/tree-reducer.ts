import { handleActions, ActionMeta } from 'redux-actions';

export interface TreeState {
  display: boolean;
  filter: Set<string>;
}

export default handleActions({
  FILTER_SERVICE: (state: TreeState, action: ActionMeta<any, {}>) => {
    if (!action.error) {
      const { filter } = state;
      const serviceName = action.payload;
      if (filter.has(serviceName)) {
        filter.delete(serviceName);
      } else {
        filter.add(serviceName);
      }
      return Object.assign({}, state, {
        filter: new Set<string>(filter),
      });
    }
    return state;
  },
  RESET_SERVICE_FILTERS: (state: TreeState, action: ActionMeta<any, {}>) => {
    return Object.assign({}, state, {
      filter: new Set<string>(),
    });
  },
  SET_DEFAULT_ANNOTATION_DETAILS_DISPLAY: (state: TreeState, action: ActionMeta<any, {}>) => {
    if (!action.error) {
      return Object.assign({}, state, {
        display: action.payload,
      });
    }
    return state;
  },
}, {
  display: undefined,
  filter: new Set<string>(),
});
