import * as React from 'react';
import * as moment from 'moment';
import * as jsonFormat from 'json-format';
import { Timeline, Tabs, Alert, Icon, Button } from 'antd';
import { connect } from 'react-redux';
import { Annotation, BinaryAnnotation, SpanNode } from 'src/zipkin';
import { State, TreeState as FluxTreeState } from 'src/flux/reducers';

import './tree.scss';

// tslint:disable-next-line
const Animate = require('rc-animate');
// tslint:disable-next-line:variable-name
const Time = Timeline.Item as any;
const TabPane = Tabs.TabPane;

interface TreeProps {
  root?: SpanNode;
  display?: boolean;
}

interface TreeState {
  nodeMeta?: Map<string, NodeMeta>;
  width?: number;
}

interface NodeMeta {
  details: boolean;
  expanded: boolean;
}

interface AnnotationsProps {
  node: SpanNode;
  annotations: Annotation[];
  binaryAnnotations: BinaryAnnotation[];
}

export class Annotations extends React.Component<AnnotationsProps, {}> {

  public render(): JSX.Element {
    const { annotations, binaryAnnotations } = this.props;
    return (
      <Animate transitionName='fade' transitionAppear transitionDisappear>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='Annotations' key='1'>
            <div className='annotations'>
              <div>
                <Timeline>
                  {annotations
                    .sort((a, b) => a.timestamp < b.timestamp ? -1 : 1)
                    .map((annotation, i) =>
                      <Time key={i}>
                        <p>
                          {moment(annotation.timestamp / 1000).format('YYYY-MM-DD HH:mm:ss.SSSS')}
                        </p>
                        <p>{this.getAnnotationValue(annotation)}</p>
                        <p>
                          {annotation.endpoint.ipv4}
                          {annotation.endpoint.port ? `:${annotation.endpoint.port}` : undefined}
                          <span> ({annotation.endpoint.serviceName})</span>
                        </p>
                      </Time>)
                  }
                </Timeline>
              </div>
              <div>
                {binaryAnnotations && binaryAnnotations.length > 0 ? [...binaryAnnotations
                  .reduce((map, a) => {
                    if (!map.has(a.endpoint.serviceName)) {
                      map.set(a.endpoint.serviceName, []);
                    }
                    map.get(a.endpoint.serviceName).push(a);
                    return map;
                  }, new Map<string, BinaryAnnotation[]>()).entries()]
                  .map(([serviceName, a], i) =>
                    <div key={i} className='binary-annotations'>
                      <div>
                        {serviceName}
                      </div>
                      <div>
                        {a.map((annotation, j) =>
                          <div key={j}>
                            <div>{annotation.key}</div>
                            <div>{annotation.value}</div>
                            {annotation.endpoint.ipv4 ?
                              <div>
                                {annotation.endpoint.ipv4}
                                {annotation.endpoint.port ?
                                  `:${annotation.endpoint.port}`
                                  : undefined
                                }
                              </div> : undefined
                            }
                          </div>,
                        )}
                      </div>
                    </div>,
                ) :
                  <Alert message='No binary annotations available' type='info' />
                }
              </div>
            </div>
          </TabPane>
          <TabPane tab='JSON' key='2'>
            <pre style={{ maxHeight: '300px', overflow: 'auto' }}>
              {jsonFormat(this.props.node)}
            </pre>
          </TabPane>
        </Tabs>
      </Animate>
    );
  }

  private getAnnotationValue(annotation: Annotation): string {
    switch (annotation.value) {
      case 'sr': return 'Server Receive';
      case 'ss': return 'Server Send';
      case 'cr': return 'Client Receive';
      case 'cs': return 'Client Send';
      default: return annotation.value;
    }
  }
}

export class Tree extends React.Component<TreeProps, TreeState> {

  constructor(props: TreeProps) {
    super();
    this.state = {
      nodeMeta: [...props.root.entries()].reduce((map, [node, level]) => {
      map.set(node.span.id, { details: false, expanded: level < 2 });
      return map;
    }, new Map<string, NodeMeta>()),
      width: 95,
    };
  }

  public componentWillReceiveProps(props: TreeProps): void {
    const nodeMeta = [...props.root.entries()].reduce((map, [node, level]) => {
      map.set(node.span.id, { details: false, expanded: level < 2 });
      return map;
    }, new Map<string, NodeMeta>());
    this.setState({ nodeMeta });
  }

  public render(): JSX.Element {
    const { root } = this.props;
    return (
      <div>
        <div className='tree-form'>
          <Button onClick={this.handleExpandAll} style={{ marginRight: '1em' }}>Expand All</Button>
          <Button onClick={this.handleCollapseAll}>Collapse All</Button>
        </div>
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
      </div>
    );
  }

  private handleExpandAll = (): void => {
    const { nodeMeta } = this.state;
    for (let id of nodeMeta.keys()) {
      const oldMeta = nodeMeta.get(id);
      nodeMeta.set(id, Object.assign({}, oldMeta, { expanded: true }));
    }
    this.setState({ nodeMeta });
  }

  private handleCollapseAll = (): void => {
    const nodeMeta = [...this.props.root.entries()].reduce((map, [node, level]) => {
      const oldMeta = this.state.nodeMeta.get(node.span.id);
      map.set(node.span.id, Object.assign({}, oldMeta, { expanded: level < 2 }));
      return map;
    }, new Map<string, NodeMeta>());
    this.setState({ nodeMeta });
  }

  private handleRowClick = (id: string): void => {
    if (this.props.display) {
      return;
    }
    const { nodeMeta } = this.state;
    const oldMeta = nodeMeta.get(id);
    nodeMeta.set(id, Object.assign({}, oldMeta, { details: !oldMeta.details }));
    this.setState({ nodeMeta });
  }

  private handleServiceClick = (id: string): void => {
    const { nodeMeta } = this.state;
    const oldMeta = nodeMeta.get(id);
    nodeMeta.set(id, Object.assign({}, oldMeta, { expanded: !oldMeta.expanded }));
    this.setState({ nodeMeta });
  }

  private renderLabels(root: SpanNode): JSX.Element[] {
    const { duration } = root.span;
    const { width } = this.state;

    // number of markers to display (never with a smaller interval than 1)
    const numIntervals = Math.min(10, Math.floor(duration / 1000));
    const interval = Math.floor(duration / numIntervals);
    const labels = [];
    for (let i = 0; i < numIntervals; i++) {
      const offset = (i / numIntervals) * width;
      labels.push(
        <div key={i} style={{ left: `${offset}%` }}>{Math.round(i * interval / 1000)}ms</div>,
      );
    }
    return labels;
  }

  private renderNode(node: SpanNode, root: SpanNode = node, level = 0): JSX.Element[] {
    const { nodeMeta, width } = this.state;

    const { duration } = root.span;
    const rootSr = root.sr || root.span.timestamp;
    const rootSs = root.ss || root.span.timestamp + duration;

    // the receiving service bar
    const nodeSr = node.sr || node.span.timestamp;
    const nodeSs = node.ss || node.span.timestamp + node.span.duration;
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

    const meta = nodeMeta.get(node.span.id);

    let ret = [
      <div className='tree-row' key={node.span.id}>
        <div className='tree-service-name'
          style={{ paddingLeft: `${level * 5}px` }}
          onClick={() => this.handleServiceClick(`${node.span.id}`)}>
          {node.children && node.children.length > 0 ?
            <Icon type={meta.expanded ? 'caret-down' : 'caret-right'}
              style={{verticalAlign: 'middle', fontSize: '0.75em', marginRight: '0.5em' }}/>
          : <span style={{ marginLeft: '1em' }}></span> }
          <span style={{ verticalAlign: 'middle' }}>
            {node.getServiceName() || '--'}
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <div className='tree-chart'
            style={this.props.display ? undefined : { cursor: 'pointer' }}
            onClick={() => this.handleRowClick(`${node.span.id}`)}>
            <div style={{
              left: `${nodeClientOffset || nodeOffset}%`,
              width: `${nodeClientWidth || nodeWidth}%`,
            }} />
            <div style={{ width: `${nodeWidth}%`, left: `${nodeOffset}%` }} />
            <div style={{ left: `${nodeOffset}%` }}>
              {Math.round(node.span.duration / 1000)}ms: {node.span.name}
            </div>
          </div>
          {this.props.display || meta.details ?
            <div className='tree-details'>
              <Annotations
                node={node}
                annotations={node.span.annotations}
                binaryAnnotations={node.span.binaryAnnotations} />
            </div> :
            undefined
          }
        </div>
      </div>,
    ];

    if (meta.expanded) {
      ret = ret.concat(...node.children.map(child => this.renderNode(child, node, level + 1)));
    }

    return ret;
  }
}

const mapStateToProps = (state: State, props: TreeProps): TreeProps => {
  return {
    display: state.tree.display,
  };
};

export default connect(mapStateToProps)(Tree);