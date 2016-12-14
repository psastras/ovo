import { handleActions, ActionMeta } from 'redux-actions';
import { message } from 'antd';
import { SpanNode } from 'src/zipkin';

const defaultErrorDurationS = 3;

export interface ZipkinState {
  services: string[];
  spans: string[];
  traces: SpanNode[];
  trace: SpanNode;
  trace_json: Object;
}

const tryExtractErrorMessage = (action: ActionMeta<any, any>): string => {
  try {
    const response = JSON.parse(action.payload.response.text);
    return response.message;
  } catch (e) {
    // no-op
  }
};

export default handleActions({
  GET_SERVICE_NAMES: (state: ZipkinState, action: ActionMeta<any, {}>) => {
    if (action.error) {
      const errorMessage = tryExtractErrorMessage(action);
      message.error(`Error fetching service names from Zipkin: ${errorMessage}`,
        defaultErrorDurationS);
    } else {
      return Object.assign({}, state, {
        services: action.payload,
      });
    }
    return state;
  },
  GET_SPANS: (state: ZipkinState, action: ActionMeta<any, {}>) => {
    if (action.error) {
      const errorMessage = tryExtractErrorMessage(action);
      message.error(`Error fetching spans from Zipkin: ${errorMessage}`, defaultErrorDurationS);
    } else {
      return Object.assign({}, state, {
        spans: action.payload,
      });
    }
  },
  GET_TRACE: (state: ZipkinState, action: ActionMeta<any, {}>) => {
    if (action.error) {
      const errorMessage = tryExtractErrorMessage(action);
      message.error(`Error fetching trace from Zipkin: ${errorMessage}`, defaultErrorDurationS);
    } else {
      return Object.assign({}, state, {
        trace: action.payload[0],
        trace_json: action.payload[1],
      });
    }
  },
  GET_TRACES: (state: ZipkinState, action: ActionMeta<any, {}>) => {
    if (action.error) {
      const errorMessage = tryExtractErrorMessage(action);
      message.error(`Error fetching traces from Zipkin: ${errorMessage}`, defaultErrorDurationS);
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