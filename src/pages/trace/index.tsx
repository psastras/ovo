import * as React from 'react';
import { connect } from 'react-redux';
import * as Actions from 'src/flux/actions';
import { State, ZipkinState } from 'src/flux/reducers';
import { SpanNode } from 'src/zipkin';
import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

interface TraceProps {
  location?: any;
  getTrace?: any;
  params?: any;
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
    const { trace } = this.props.zipkin;
    return (
      <div>
        <h1>{trace.getServiceName()} / {trace.span.traceId}</h1>
        {this.buildTree(trace)}
      </div>
    );
  }

  private buildTree(node: SpanNode, path: string[] = []): JSX.Element {
    const serviceName = node.getServiceName();
    const newPath = path.concat(node.span.id);
    if (!node.span.parentId) {
      return (
        <Tree defaultExpandAll>
          <TreeNode title={serviceName} key={newPath.join('-')}>
            {node.children.map(child => this.buildTree(child, newPath))}
          </TreeNode>
        </Tree>
      );
    } else {
      if (node.children.length > 0) {
        return (
          <TreeNode title={`${node.getServiceName()}`} key={newPath.join('-')}>
            {node.children.map(child => this.buildTree(child, newPath))}
          </TreeNode>
        );
      } else {
        return <TreeNode title={`${node.getServiceName()}`} key={newPath.join('-')} />;
      }
    }
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
    getTrace: (traceId: string) => dispatch(Actions.getTrace(traceId)),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Trace);