import * as React from 'react';
import { connect } from 'react-redux';
import { Tabs, Icon } from 'antd';
import * as jsonFormat from 'json-format';
import Actions from 'src/flux/actions';
import { State, ZipkinState } from 'src/flux/reducers';
import { SpanNode } from 'src/zipkin';
import Search from './search';
import Tree from './tree';

const TabPane = Tabs.TabPane;

interface TraceProps {
  location?: any;
  getTrace?: (traceId: string) => void;
  params?: {
    traceId: string,
  };
  zipkin?: ZipkinState;
}

export class Trace extends React.Component<TraceProps, {}> {

  public componentWillMount(): void {
    const { traceId } = this.props.params;
    this.props.getTrace(traceId);
  }

  public render(): JSX.Element {
    if (!this.props.zipkin.trace) {
      return <div />;
    }
    const { trace, trace_json } = this.props.zipkin;
    return (
      <div>
        <h1>{trace.getServiceName()} / {trace.span.traceId}</h1>
        <Search />
        <Tabs defaultActiveKey='1'>
          <TabPane tab={<span><Icon type='line-chart' /> Timeline</span>} key='1'>
            <Tree root={trace} />
          </TabPane>
          <TabPane tab={<span><Icon type='file-text' /> JSON</span>} key='2'>
            <pre style={{ overflow: 'auto' }}>
              {jsonFormat(trace_json)}
            </pre>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = (state: State, props: TraceProps): TraceProps => {
  return {
    location: props.location,
    params: props.params,
    zipkin: state.zipkin,
  };
};

const mapDispatchToProps = (dispatch): TraceProps => {
  return {
    getTrace: (traceId: string) => dispatch(Actions.zipkin.getTrace(traceId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Trace);