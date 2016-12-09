import { handleActions, ActionMeta } from 'redux-actions';
import { message } from 'antd';
import { SpanNode } from 'src/zipkin';

export interface ZipkinState {
  services: Array<string>;
  traces: Array<SpanNode>;
  trace: SpanNode;
}

export interface State {
  routing: any;
  zipkin: ZipkinState;
}

export const zipkinReducer = handleActions({
  GET_SERVICE_NAMES: (state: ZipkinState, action: ActionMeta<any, {}>) => {
    if (action.error) {
      message.error(`Error fetching service names from Zipkin`);
    } else {
      return Object.assign({}, state, {
        services: action.payload,
      });
    }
    return state;
  },
  GET_TRACES: (state: ZipkinState, action: ActionMeta<any, {}>) => {
    if (action.error) {
      message.error(`Error fetching traces from Zipkin`);
    } else {
      return Object.assign({}, state, {
        traces: action.payload,
      });
    }
  },
  GET_TRACE: (state: ZipkinState, action: ActionMeta<any, {}>) => {
    if (action.error) {
      message.error(`Error fetching trace from Zipkin`);
    } else {
      return Object.assign({}, state, {
        trace: action.payload,
      });
    }
  },
}, {
  services: [],
  traces: [],
  trace: undefined,
});