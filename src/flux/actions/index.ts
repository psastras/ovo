import { Action } from 'redux';
import { createAction } from 'redux-actions';
import * as NProgress from 'nprogress';
import * as moment from 'moment';
import * as Zipkin from 'src/zipkin';
export default Action;

export const getServiceNames = createAction('GET_SERVICE_NAMES', async () => {
  try {
    NProgress.start();
    return await Zipkin.getServices();
  } finally {
    NProgress.done();
  }
});

export const getTraces = createAction('GET_TRACES', async (serviceName: string, start: number,
  end: number, limit: number, minDuration: number, spanName: string, queryAnnotation: string) => {
  try {
    NProgress.start();
    return await Zipkin.getTraces(serviceName, start, end, limit, minDuration, spanName,
      queryAnnotation);
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

export const setDefaultAnnotationDetailsDisplay =
  createAction('SET_DEFAULT_ANNOTATION_DETAILS_DISPLAY', (display: boolean) => {
    return display;
});

export const filterService = createAction('FILTER_SERVICE', (name: string) => {
  return name;
});

export const resetServiceFilters = createAction('RESET_SERVICE_FILTERS', () => {
  return;
})