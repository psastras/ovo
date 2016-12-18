import * as React from 'react';
import { Card, Input, Select, Button, Row, Col, Form, DatePicker, InputNumber, Icon } from 'antd';
import { connect } from 'react-redux';
import { State, ZipkinState } from 'src/flux/reducers';
import { push } from 'react-router-redux';
import Actions from 'src/flux/actions';
import * as moment from 'moment';

const Option = Select.Option;
const { RangePicker } = DatePicker;

const selectBefore = (names: string[], onServiceChange: (serviceName: string) => void,
  defaultValue: string) => {
  return (
    <Select ref='service'
      showSearch
      style={{ width: 200 }}
      onChange={onServiceChange}
      value={defaultValue || 'All Services'} >
      {
        ['All Services'].concat(names.sort())
          .map(name => <Option key={name} value={name}>{name}</Option>)
      }
    </Select>
  );
};

interface SearchProps {
  getServiceNames?: () => void;
  getSpans?: (serviceName: string) => void;
  getTraces?: (serviceName: string, start: number,
      end: number, limit: number, minDuration: number,
      spanName: string, annotationQuery: string) => void;
  pushRoute?: (route: string | Object) => void;
  zipkin?: ZipkinState;
  location?: any;
};

interface SearchState {
  service?: string;
  start?: number;
  end?: number;
  duration?: number;
  spans?: number;
  annotationQuery?: string;
  method?: string;
};

export class Search extends React.Component<SearchProps, SearchState> {

  public readonly refs: {
    annotation: Input;
    service: Select;
  };

  constructor() {
    super();
    this.state = {
      annotationQuery: undefined,
      duration: 0,
      end: moment().valueOf(),
      method: undefined,
      service: undefined,
      spans: 100,
      start: moment().subtract(1, 'months').valueOf(),
    };
  }

  public componentWillMount(): void {
    this.props.getServiceNames();
    const query = this.props.location.query;
    const newState = {
      annotationQuery: query.annotationQuery || this.state.annotationQuery,
      duration: parseInt(query.duration || this.state.duration, 10),
      end: parseInt(query.end || this.state.end, 10),
      method: query.method || this.state.method,
      service: query.service || this.state.service,
      spans: parseInt(query.spans || this.state.spans, 10),
      start: parseInt(query.start || this.state.start, 10),
    };
    if (newState.service !== this.state.service ||
      newState.start !== this.state.start ||
      newState.end !== this.state.end ||
      newState.method !== this.state.method ||
      newState.duration !== this.state.duration ||
      newState.spans !== this.state.spans ||
      newState.annotationQuery !== this.state.annotationQuery) {
      if (newState.service) {
        this.props.getSpans(newState.service);
      }
      this.props.getTraces(newState.service, newState.start,
        newState.end, newState.spans,
        newState.duration, newState.method, newState.annotationQuery);
      this.setState(newState);
    }
  }

  public onSubmit = (e): void => {
    e.preventDefault();
    const annotationQuery = this.refs.annotation.refs.input.value;
    const serviceName = this.state.service === 'All Services' ? undefined : this.state.service;
    const newState = {
      annotationQuery: this.state.annotationQuery,
      duration: this.state.duration,
      end: this.state.end,
      method: this.state.method,
      service: serviceName,
      spans: this.state.spans,
      start: this.state.start,
    };
    this.setState(newState);
    this.props.getTraces(newState.service, newState.start,
      newState.end, newState.spans,
      newState.duration, newState.method, newState.annotationQuery);
    this.props.pushRoute({
      query: Object.assign({}, this.props.location.query || {}, newState),
    });
  }

  public onServiceChange = (service: string): void => {
    this.setState({ service });
    if (service && service !== 'All Services') {
      this.props.getSpans(service);
    }
  }

  public onDateRangeChange = (range): void => {
    this.setState({
      end: range[1].valueOf(),
      start: range[0].valueOf(),
    });
  }

  public onDurationChange = (e): void => {
    const { value } = e.target;
    const reg = /^(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({ duration: value });
    }
  }

  public onSpanChange = (e): void => {
    const { value } = e.target;
    const reg = /^(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({ spans: value });
    }
  }

  public onMethodChange = (e): void => {
    this.setState({ method: e });
  }

  public render(): JSX.Element {
    return (
      <Form
        horizontal
        className='search-form'
        onSubmit={this.onSubmit}
        >
        <Row gutter={10}>
          <Col span={18}>
            <Input
              ref='annotation'
              addonBefore={selectBefore(this.props.zipkin.services, this.onServiceChange,
                this.state.service)}
              placeholder='Enter optional annotation query' />
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <RangePicker
              showTime
              format='YYYY-MM-DD HH:mm:ss'
              defaultValue={[moment(this.state.start), moment(this.state.end)]}
              ranges={{
                'Last month': [moment().subtract(1, 'months'), moment()],
                'Last week': [moment().subtract(1, 'weeks'), moment()],
                'Last day': [moment().subtract(1, 'days'), moment()], // tslint:disable-line
              }}
              onChange={this.onDateRangeChange}
              />
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={6}>
            <Select
              showSearch
              placeholder='Select a method'
              onChange={this.onMethodChange}
              >
              <Option key='All' value='all'>All</Option>
              {this.props.zipkin.spans.map(span =>
                <Option key={span} value={span}>{span}</Option>,
              )}
            </Select>
          </Col>
          <Col span={3}>
            <Input
              addonBefore='>='
              addonAfter='ms'
              placeholder='0'
              value={this.state.duration}
              onChange={this.onDurationChange} />
          </Col>
          <Col span={3}>
            <Input
              addonAfter='spans'
              placeholder='100'
              value={this.state.spans}
              onChange={this.onSpanChange} />
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button type='primary' htmlType='submit'><Icon type='search' /> Find Traces</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const mapStateToProps = (state: State, props: SearchProps): SearchProps => {
  return {
    location: props.location,
    zipkin: state.zipkin,
  };
};

const mapDispatchToProps = (dispatch): SearchProps => {
  return {
    getServiceNames: () => dispatch(Actions.zipkin.getServiceNames()),
    getSpans: (serviceName: string) => dispatch(Actions.zipkin.getSpans(serviceName)),
    getTraces: (serviceName: string, start: number,
      end: number, limit: number, minDuration: number,
      spanName: string, annotationQuery: string) =>
      dispatch(Actions.zipkin.getTraces(serviceName, start, end, limit,
        minDuration, spanName, annotationQuery)),
    pushRoute: (route) => dispatch(push(route)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);