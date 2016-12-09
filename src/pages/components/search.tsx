import * as React from 'react';
import { Card, Input, Select, Button, Row, Col, Form, DatePicker, InputNumber } from 'antd';
import { connect } from 'react-redux';
import { State, ZipkinState } from 'src/flux/reducers';
import * as Actions from 'src/flux/actions';
import './search.scss';
import * as moment from 'moment';

const Option = Select.Option;
const { RangePicker } = DatePicker;

const selectBefore = (names: Array<string>, onServiceChange: any) => {
  return (
    <Select ref= 'service'
      showSearch
      style={{ width: 200 }}
      onChange={onServiceChange}
      placeholder='Select a service'>
      {
        ['All Services'].concat(names.sort())
          .map(name => <Option key={name} value={name}>{name}</Option>)
      }
    </Select>
  );
}

interface SearchProps {
  getServiceNames?: any;
  getTraces?: any;
  zipkin?: ZipkinState;
}

interface SearchState {
  service?: string;
  start?: moment.Moment;
  end?: moment.Moment;
}

export class Search extends React.Component<SearchProps, SearchState> {

  constructor() {
    super();
    this.state = {
      service: undefined,
      start: moment().startOf('day'),
      end: moment()
    }
  }

  public readonly refs: {
    annotation: Input;
    service: Select;
  }

  public componentWillMount(): void {
    this.props.getTraces(undefined, 0, new Date().getTime(), 100, null);
    this.props.getServiceNames();
  }

  public onSubmit = (e): void => {
    e.preventDefault();
    const annotationQuery = this.refs.annotation.refs.input.value;
    const serviceName = this.state.service === 'All Services' ? undefined : this.state.service;
    this.props.getTraces(serviceName, this.state.start.valueOf(), 
      this.state.end.valueOf(), 100, annotationQuery);
  }

  public onServiceChange = (service: string): void => {
    this.setState({ service });
  }

  public onDateRangeChange = (range): void => {
    this.setState({
      start: range[0],
      end: range[1]
    })
  }

  public render(): JSX.Element {
    return (
      <Form
        horizontal
        className='search-form'
        onSubmit={this.onSubmit}
        >
        <Row gutter={20}>
          <Col span={18}>
            <Input
              ref='annotation'
              addonBefore={selectBefore(this.props.zipkin.services, this.onServiceChange)}
              placeholder='Enter optional annotation query' />
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <RangePicker
              showTime
              format='YYYY-MM-DD HH:mm:ss'
              defaultValue={[this.state.start, this.state.end]}
              ranges={{ Today: [moment().startOf('day'), moment()], 
                        'This Month': [moment().startOf('month'), moment()] }}
              onChange={this.onDateRangeChange}
              />
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={3}>
            <Input addonBefore='>=' addonAfter='ms' placeholder='0' />
          </Col>
          <Col span={21} style={{ textAlign: 'right' }}>
            <Button type='primary' htmlType='submit'>Find Traces</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const mapStateToProps = (state: State, props: SearchProps): SearchProps => {
  return {
    zipkin: state.zipkin
  };
}

const mapDispatchToProps = (dispatch): SearchProps => {
  return {
    getServiceNames: () => dispatch(Actions.getServiceNames()),
    getTraces: (serviceName: string, start: number, 
      end: number, limit: number, minDuration: number) => 
      dispatch(Actions.getTraces(serviceName, start, end, limit, 
        minDuration)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);