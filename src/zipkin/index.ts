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
  annotations: Annotation[];
  binaryAnnotations: any[];
}

export class SpanStats {
  public count: number = 0;
  public duration: number = 0;

  public accumulate(span: Span): this {
    this.count++;
    const sr = span.annotations.find(annotation => annotation.value === 'sr');
    const ss = span.annotations.find(annotation => annotation.value === 'ss');
    if (sr && ss && sr.timestamp && ss.timestamp) {
      this.duration += ss.timestamp - sr.timestamp;
    }
    return this;
  }
}

export class SpanNode {

  public readonly span: Span;
  public readonly children: SpanNode[];

  constructor(span: Span, children: SpanNode[]) {
    this.span = span;
    this.children = children;
  }

  public getServiceName(): string {
    let maybeAnnotation = (this.span.annotations || [])
      .filter(annotation => annotation && annotation.endpoint && annotation.value)
      .filter(annotation => annotation.value === 'sr' || annotation.value === 'ss')
      .find(annotation => !!annotation.endpoint.serviceName);
    if (maybeAnnotation) {
      return maybeAnnotation.endpoint.serviceName;
    }

    // fall back to using the client annotatio name
    maybeAnnotation = (this.span.annotations || [])
      .filter(annotation => annotation && annotation.endpoint && annotation.value)
      .filter(annotation => annotation.value === 'cs' || annotation.value === 'cr')
      .find(annotation => !!annotation.endpoint.serviceName);

    return maybeAnnotation ? maybeAnnotation.endpoint.serviceName : undefined;
  }

  public getSeviceSpanStats(spanNode = this as SpanNode,
                            serviceSpanStats = new Map<string, SpanStats>()):
                            Map<string, SpanStats> {
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
export const parseSpans = (spans: Span[]): SpanNode => {
  const spanMap = new Map<string, SpanNode>();
  for (let span of spans) {
    spanMap.set(span.id, new SpanNode(span, []));
  }

  let root = undefined;
  for (let span of spans) {
    const spanNode = spanMap.get(span.id);
    if (!span.parentId) {
      root = spanNode;
    } else if (spanMap.has(span.parentId)) {
      spanMap.get(span.parentId).addChild(spanNode);
    } else {
      // no parent id in the span, the data might not be there yet :(
    }
  }
  return root;
};

export const getTrace = async (traceId: string): Promise<any> => {
  const response = await request.get(`${zipkinUrl}/api/v1/trace/${traceId}`);
  return parseSpans(JSON.parse(response.text) as Span[]);
};

export const getServices = async (): Promise<string[]> => {
  const response = await request.get(`${zipkinUrl}/api/v1/services`);
  return JSON.parse(response.text);
};

export const getTraces = async (serviceName: string, start: number,
  end: number, limit: number, minDuration: number, spanName = 'all',
  annotationQuery?: string, ): Promise<SpanNode[]> => {
  const response = await request.get(`${zipkinUrl}/api/v1/traces`)
    .query({
      serviceName,
      limit: limit > 0 ? limit : 100,
      endTs: end,
      lookback: end - start,
      minDuration: minDuration > 0 ? minDuration : undefined,
      spanName,
      annotationQuery,
    });
  return (JSON.parse(response.text) as Span[][])
    .map(spans => parseSpans(spans))
    .filter(node => !!node);
};