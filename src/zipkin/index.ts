import * as _request from 'superagent';
import * as moment from 'moment';
const request = _request;

const zipkinUrl = 'http://localhost:9411';

export interface Annotation {
  timestamp: number;
  value: 'cs' | 'sr' | 'ss' | 'cr';
  endpoint: {
    serviceName: string;
  }
}

export interface Span {
  traceId: string;
  id: string;
  parentId?: string;
  name: string;
  timestamp: number;
  duration: number;
  annotations: Array<Annotation>;
  binaryAnnotations: Array<any>;
}

export class SpanStats {
  count: number = 0;
  duration: number = 0;

  public accumulate(span: Span): this {
    this.count++;

    const sr = span.annotations.find(annotation => annotation.value === 'sr').timestamp;
    const ss = span.annotations.find(annotation => annotation.value === 'ss').timestamp;
    this.duration += ss - sr;
    return this;
  }
}

export class SpanNode {
  
  readonly span: Span;
  readonly children: Array<SpanNode>;

  constructor(span: Span, children: Array<SpanNode>) {
    this.span = span;
    this.children = children;
  }

  public getServiceName(): string {
    return this.span.annotations
      .filter(annotation => annotation.value === 'sr' || annotation.value === 'ss')
      .find(annotation => !!annotation.endpoint.serviceName)
      .endpoint.serviceName;
  }

  public getSeviceSpanStats(spanNode = this as SpanNode,
    serviceSpanStats = new Map<string, SpanStats>()): Map<string, SpanStats> {
    const serviceName = spanNode.getServiceName();
    if (!serviceSpanStats.has(serviceName)) {
      serviceSpanStats.set(serviceName, new SpanStats());
    }
    serviceSpanStats.get(serviceName).accumulate(spanNode.span);

    for (let child of spanNode.children) {
      child.getSeviceSpanStats(child, serviceSpanStats);
    }
    return serviceSpanStats;
  }

  public addChild(spanNode: SpanNode): void {
    this.children.push(spanNode);
  }
}

/**
 * Converts a trace array to a trace tree.
 */
export const parseSpans = (spans: Array<Span>): SpanNode => {
  const spanMap = new Map<string, SpanNode>();
  for (let span of spans) {
    spanMap.set(span.id, new SpanNode(span, []));
  }

  let root = undefined;
  for (let span of spans) {
    const spanNode = spanMap.get(span.id);
    if (!span.parentId) {
      root = spanNode;
    } else {
      spanMap.get(span.parentId).addChild(spanNode);
    }
  }
  return root;
}

export const getServices = async (): Promise<Array<string>> => {
  const response = await request.get(`${zipkinUrl}/api/v1/services`);
  return JSON.parse(response.text);
}

export const getTraces = async (serviceName: string, start: number, 
  end: number, limit: number, minDuration: number, spanName: string = 'all',
  annotationQuery?: string, ): Promise<Array<SpanNode>> => {
  const response = await request.get(`${zipkinUrl}/api/v1/traces`)
    .query({
      serviceName,
      limit: limit > 0 ? limit : 100,
      endTs: end,
      lookback: end - start,
      minDuration: minDuration > 0 ? minDuration : undefined,
      spanName,
      annotationQuery
    });
  return (JSON.parse(response.text) as Array<Array<Span>>).map(spans => parseSpans(spans));
}