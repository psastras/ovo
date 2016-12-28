import { createAction } from 'redux-actions';
import * as Zipkin from 'src/zipkin';
import * as NProgress from 'nprogress';

export const getServiceNames = createAction('GET_SERVICE_NAMES', async () => {
  try {
    NProgress.start();
    return await Zipkin.getServices();
  } finally {
    NProgress.done();
  }
});

export interface TraceQuery {
  serviceName: string;
  start: number;
  end: number;
  minDuration: number;
  spanName: string;
  queryAnnotation: string;
  limit: number;
}

export const getTraces = createAction('GET_TRACES', async (query: TraceQuery) => {
  try {
    NProgress.start();
    return await Zipkin.getTraces(query.serviceName, query.start, query.end, query.limit,
      query.minDuration, query.spanName, query.queryAnnotation);
  } finally {
    NProgress.done();
  }
});

export const getTrace = createAction('GET_TRACE', async (traceId: string) => {
  try {
    NProgress.start();
    return await Zipkin.getTrace(traceId);
  } finally {
    NProgress.done();
  }
});

export const getSpans = createAction('GET_SPANS', async (serviceName: string) => {
  try {
    NProgress.start();
    return await Zipkin.getSpans(serviceName);
  } finally {
    NProgress.done();
  }
});

export const getDependencies = createAction('GET_DEPENDENCIES', async (endTs: number) => {
  try {
    NProgress.start();
    return await Zipkin.getDependencies(endTs);
  } finally {
    NProgress.done();
  }
});

export default {
  getServiceNames,
  getSpans,
  getTraces,
  getTrace,
  getDependencies,
};