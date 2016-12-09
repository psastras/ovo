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
  end: number, limit: number, minDuration: number) => {
  try {
    NProgress.start();
    return await Zipkin.getTraces(serviceName, start, end, limit, minDuration);
  } finally {
    NProgress.done();
  }
});