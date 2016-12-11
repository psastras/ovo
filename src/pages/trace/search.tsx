import * as React from 'react';
import { connect } from 'react-redux';
import { State, ZipkinState, TreeState } from 'src/flux/reducers';
import { Tag, Row, Col, Checkbox } from 'antd';
import * as Actions from 'src/flux/actions';
import './search.scss';

interface SearchProps {
  zipkin?: ZipkinState;
  tree?: TreeState;
  setAnnotationDetailsDisplay?: any;
}

export class Search extends React.Component<SearchProps, {}> {
  public render(): JSX.Element {
    if (!this.props.zipkin || !this.props.zipkin.trace) {
      return undefined;
    }
    const { trace } = this.props.zipkin;
    const stats = trace.getSeviceSpanStats();
    return (
      <div className='search-box'>
        <Row>
          <Col span={12}>
            <span style={{ marginRight: '2em' }}>{trace.span.duration / 1000} ms</span>
            <span style={{ marginRight: '2em' }}>{stats.size} services</span>
            {[...stats.entries()].reduce((accum, [name, stat]) => accum += stat.count, 0)} spans
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Checkbox style={{ marginRight: '1em' }}
              defaultChecked={this.props.tree.display}
              onChange={(e: any) => this.props.setAnnotationDetailsDisplay(e.target.checked)}>
              Show annotations by default
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {[...stats.entries()].map(([name, stat]) =>
              <Tag
                key={name}
                >
                {name} x {stat.count}
              </Tag>,
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state: State, props: SearchProps): SearchProps => {
  return {
    tree: state.tree,
    zipkin: state.zipkin,
  };
};

const mapDispatchToProps = (dispatch): SearchProps => {
  return {
    setAnnotationDetailsDisplay: (display: boolean) =>
      dispatch(Actions.setDefaultAnnotationDetailsDisplay(display)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);