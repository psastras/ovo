import * as React from 'react';
import { Card, Input, Select, Button, Row, Col, Form, DatePicker, InputNumber } from 'antd';
import { connect } from 'react-redux';
import { State, ZipkinState } from 'src/flux/reducers';
import { push } from 'react-router-redux';
import * as Actions from 'src/flux/actions';
import './search.scss';
import * as moment from 'moment';

const Option = Select.Option;
const { RangePicker } = DatePicker;

const selectBefore = (names: string[], onServiceChange: any, defaultValue: string) => {
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
  getServiceNames?: any;
  getTraces?: any;
  pushRoute?: any;
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
};

export class Search extends React.Component<SearchProps, SearchState> {

  public readonly refs: {
    annotation: Input;
    service: Select;
  }

  constructor() {
    super();
    this.state = {
      annotationQuery: undefined,
      duration: 0,
      end: moment().valueOf(),
      service: undefined,
      spans: 100,
      start: moment().startOf('day').valueOf(),
    };
  }

  public componentWillMount(): void {
    this.props.getServiceNames();
  }

  public componentWillReceiveProps(props: SearchProps): void {
    const { query } = props.location;
    const newState = {
      service: query.service || this.state.service,
      start: parseInt(query.start || this.state.start),
      end: parseInt(query.end || this.state.end),
      duration: parseInt(query.duration || this.state.duration),
      spans: parseInt(query.spans || this.state.spans),
      annotationQuery: query.annotationQuery || this.state.annotationQuery,
    };
    if (newState.service !== this.state.service ||
      newState.start !== this.state.start ||
      newState.end !== this.state.end ||
      newState.duration !== this.state.duration ||
      newState.spans !== this.state.spans ||
      newState.annotationQuery !== this.state.annotationQuery) {
      this.props.getTraces(newState.service, newState.start,
        newState.end, newState.spans,
        newState.duration, newState.annotationQuery);
      this.setState(newState);
    }
  }

  public onSubmit = (e): void => {
    e.preventDefault();
    const annotationQuery = this.refs.annotation.refs.input.value;
    const serviceName = this.state.service === 'All Services' ? undefined : this.state.service;
    const newState = {
      service: serviceName,
      start: this.state.start,
      end: this.state.end,
      duration: this.state.duration,
      spans: this.state.spans,
      annotationQuery: this.state.annotationQuery,
    };
    this.setState(newState);
    this.props.getTraces(newState.service, newState.start,
        newState.end, newState.spans,
        newState.duration, newState.annotationQuery);
    this.props.pushRoute({
      query: Object.assign({}, this.props.location.query || {}, newState),
    });
  }

  public onServiceChange = (service: string): void => {
    this.setState({ service });
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
                'This Month': [moment().startOf('month'), moment()],
                'Today': [moment().startOf('day'), moment()],
              }}
              onChange={this.onDateRangeChange}
              />
          </Col>
        </Row>
        <Row gutter={10}>
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
          <Col span={18} style={{ textAlign: 'right' }}>
            <Button type='primary' htmlType='submit'>Find Traces</Button>
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
    getServiceNames: () => dispatch(Actions.getServiceNames()),
    getTraces: (serviceName: string, start: number,
      end: number, limit: number, minDuration: number) =>
      dispatch(Actions.getTraces(serviceName, start, end, limit,
        minDuration)),
    pushRoute: (route) => dispatch(push(route))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);