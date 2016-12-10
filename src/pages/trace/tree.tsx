import * as React from 'react';
import { SpanNode } from 'src/zipkin';
import './tree.scss';

interface TreeProps {
  root: SpanNode;
}

export default class Tree extends React.Component<TreeProps, {}> {
  public render(): JSX.Element {
    const { root } = this.props;
    return (
      <div className='tree'>
        <div>
          <div><h2>Service</h2></div>
          <div><h2>Timeline</h2></div>
        </div>
        <div className='tree-label'>
          <div>&nbsp;</div>
          <div>
            <div>
              {this.renderLabels(root)}
            </div>
          </div>
        </div>
        <div>
          <div>&nbsp;</div>
          <div></div>
        </div>
        {this.renderNode(root)}
      </div>
    );
  }

  private renderLabels(root: SpanNode): JSX.Element[] {
    const { duration } = root.span;

     // number of markers to display (never with a smaller interval than 1)
    const numIntervals = Math.min(10, Math.floor(duration / 1000));
    const interval = Math.floor(duration / numIntervals);
    const labels = [];
    for (let i = 0; i < numIntervals; i++) {
      const offset = (i / numIntervals) * 100;
      labels.push(
        <div key={i} style={{ left: `${offset}%`}}>{Math.round(i * interval / 1000)} ms</div>
      );
    }
    return labels;
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