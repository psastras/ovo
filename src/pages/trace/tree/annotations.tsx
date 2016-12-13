import * as React from 'react';
import * as moment from 'moment';
import * as jsonFormat from 'json-format';
import { Annotation, BinaryAnnotation, SpanNode } from 'src/zipkin';
import { Timeline, Tabs, Alert } from 'antd';

// tslint:disable-next-line
const Animate = require('rc-animate');
// tslint:disable-next-line:variable-name
const Time = Timeline.Item as any;
const TabPane = Tabs.TabPane;

interface AnnotationsProps {
  node: SpanNode;
  annotations: Annotation[];
  binaryAnnotations: BinaryAnnotation[];
}

export default class Annotations extends React.Component<AnnotationsProps, {}> {

  public render(): JSX.Element {
    const { annotations, binaryAnnotations, node } = this.props;
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
              {jsonFormat(node.span)}
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