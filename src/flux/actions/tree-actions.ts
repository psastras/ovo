import { createAction } from 'redux-actions';

export const setDefaultAnnotationDetailsDisplay =
  createAction('SET_DEFAULT_ANNOTATION_DETAILS_DISPLAY', (display: boolean) => {
    return display;
});

export const filterService = createAction('FILTER_SERVICE', (name: string) => {
  return name;
});

export const resetServiceFilters = createAction('RESET_SERVICE_FILTERS', () => {
  return;
});