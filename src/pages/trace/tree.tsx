import * as React from 'react';
import { SpanNode } from 'src/zipkin';
import './tree.scss';

interface TreeProps {
  root: SpanNode;
}

export default class Tree extends React.Component<TreeProps, {}> {
  public render(): JSX.Element {
    const { root } = this.props;
    console.log(root);
    return (
      <div className='tree'>
        <div>
          <div><h2>Service</h2></div>
          <div><h2>Timeline</h2></div>
        </div>
        <div className='tree-label'>
          <div></div>
          <div>0ms</div>
        </div>
        {this.renderNode(root)}
      </div>
    );
  }

  private renderNode(node: SpanNode, root: SpanNode = node, level = 0): JSX.Element[] {
    const width = 100; // percentage of the width to use, need to leave some room for overflow
    
    const { duration } = root.span;
    const rootSr = root.sr || root.span.timestamp;
    const rootSs = root.ss || root.span.timestamp + duration;

    // the receiving service bar
    const nodeSr = node.sr || node.span.timestamp;
    const nodeSs = node.ss || node.span.timestamp + duration;
    const nodeOffset = (nodeSr - rootSr) / duration * width;
    const nodeWidth = (nodeSs - nodeSr) / duration * width;

    // if the client send / receive time is available in the annotations
    const nodeCr = node.cr;
    const nodeCs = node.cs;
    
    let nodeClientOffset, nodeClientWidth;
    if (nodeCr && nodeCs) {
      nodeClientOffset = (nodeCs - rootSr) / duration * width;
      nodeClientWidth = (nodeCr - nodeCs) / duration * width;
      console.log(nodeClientWidth);
      console.log(nodeWidth);
    }

    return [
      <div key={node.span.id}>
        <div style={{ paddingLeft: `${level * 5}px` }}>
          {node.getServiceName() || '--' }
        </div>
        <div>
        <div className='tree-chart'>
          <div style={{ width: `${nodeClientWidth || nodeWidth}%`,
            left: `${nodeClientOffset || nodeOffset}%` }} />
          <div style={{ width: `${nodeWidth}%`, left: `${nodeOffset}%` }} />
          <div style={{ left: `${nodeOffset}%` }}>
            {Math.round(node.span.duration / 1000)} ms: {node.span.name}
          </div>
        </div>
        </div>
      </div>,
    ].concat(...node.children.map(child => this.renderNode(child, node, level + 1)))
  }
}