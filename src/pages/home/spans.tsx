import * as React from 'react';
import { Select, Card, Tag, Row, Col, Alert  } from 'antd';
import { connect } from 'react-redux';
import { State, ZipkinState } from 'src/flux/reducers';
import { SpanNode } from 'src/zipkin';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import * as moment from 'moment';

const Option = Select.Option;

interface TraceProps {
  trace: SpanNode;
}

interface TraceState {
  sort: 'old' | 'new' | 'long' | 'short';
}

interface TracesProps {
  zipkin?: ZipkinState;
  location?: any;
  pushRoute?: (route: string | Object) => void;
}

export class Trace extends React.Component<TraceProps, {}> {
  public render(): JSX.Element {
    const { trace } = this.props;
    const serviceSpanStats = trace.getSeviceSpanStats();
    const serviceName = trace.getServiceName();
    return (
      <Link to={`/trace/${trace.span.traceId}`}>
        <Card title={
          <span>
            <span className='card-span-title'>{serviceName}</span>
            <span className='card-span-name'>{trace.span.name}</span>
          </span>}
          extra={
           <span className='card-span-subtitle'>
            {moment(trace.span.timestamp / 1000).fromNow()} / {trace.span.traceId} /&nbsp;
            {((trace.span.duration || 0) / 1000).toFixed(2)} ms
           </span>}
          bordered={false}>
          {[...serviceSpanStats.entries()].map((entry, i) => {
            const [name, { count, duration }] = entry;
            const text = `${name} x ${count} ${(duration / 1000).toFixed(2)} ms`;
            return (
              <Tag key={i}>
                {text}
              </Tag>
            );
          })}
        </Card>
      </Link>
    );
  }
}

export class Traces extends React.Component<TracesProps, TraceState> {

  constructor() {
    super();
    this.state = {
      sort: 'new',
    };
  }

  public componentWillReceiveProps(props): void {
    if (props.location.query.sort) {
      this.setState({ sort: props.location.query.sort });
    }
  }

  public render(): JSX.Element {
    const { zipkin } = this.props;
    if (!zipkin.traces || zipkin.traces.length === 0) {
      return (
        <Alert message='No traces to display'
          description='Enter search information above to start.'
          type='info'
        />
      );
    }
    return (
      <div style={{ margin: '2em 0' }}>
        <Row>
          <Col span={12}>
            Showing results for {zipkin.traces.length} spans
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <span style={{ marginRight: '1em' }}>Sort results by:</span>
            <Select
              onChange={this.onSortChange}
              value={this.state.sort}
              style={{ width: '200px', margin: '0 0 1em 0' }}>
              <Option value='new'>Newest first</Option>
              <Option value='old'>Oldest first</Option>
              <Option value='short'>Shortest first</Option>
              <Option value='long'>Longest first</Option>
            </Select>
          </Col>
        </Row>
        <div>
          {zipkin.traces
            .sort((a, b) => {
              switch(this.state.sort) {
                case 'new': return a.span.timestamp < b.span.timestamp ? 1 : -1;
                case 'old': return a.span.timestamp < b.span.timestamp ? -1 : 1;
                case 'short': return (a.span.duration || 0) < (b.span.duration || 0) ? -1 : 1;
                case 'long': return (a.span.duration || 0) < (b.span.duration || 0) ? 1 : -1;
                default: return 0;
              }
            })
            .map((trace, i) => <Trace key={i} trace={trace} />)}
        </div>
      </div>
    );
  }

  private onSortChange = (value) => {
    this.props.pushRoute({
      query: Object.assign({}, this.props.location.query, { sort: value }),
    });
  }
}

const mapDispatchToProps = (dispatch): TracesProps => {
  return {
    pushRoute: (route) => dispatch(push(route)),
  };
};

const mapStateToProps = (state: State, props: TracesProps): TracesProps => {
  return {
    location: props.location,
    zipkin: state.zipkin,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Traces);