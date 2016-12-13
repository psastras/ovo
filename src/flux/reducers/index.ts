import { handleActions, ActionMeta } from 'redux-actions';
import { message } from 'antd';
import { SpanNode } from 'src/zipkin';

export interface ZipkinState {
  services: string[];
  spans: string[];
  traces: SpanNode[];
  trace: SpanNode;
  trace_json: Object;
}

export interface TreeState {
  display: boolean;
}

export interface State {
  routing: any;
  zipkin: ZipkinState;
  tree: TreeState;
}

export const treeReducer = handleActions({
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
});

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
  GET_SPANS: (state: ZipkinState, action: ActionMeta<any, {}>) => {
    if (action.error) {
      message.error(`Error fetching spans from Zipkin`);
    } else {
      return Object.assign({}, state, {
        spans: action.payload,
      });
    }
  },
  GET_TRACE: (state: ZipkinState, action: ActionMeta<any, {}>) => {
    if (action.error) {
      message.error(`Error fetching trace from Zipkin`);
    } else {
      return Object.assign({}, state, {
        trace: action.payload[0],
        trace_json: action.payload[1],
      });
    }
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
}, {
  services: [],
  spans: [],
  trace: undefined,
  trace_json: undefined,
  traces: [],
});