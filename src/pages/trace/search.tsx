import * as React from 'react';
import { connect } from 'react-redux';
import { State, ZipkinState, TreeState } from 'src/flux/reducers';
import { Tag, Row, Col, Checkbox } from 'antd';
import Actions from 'src/flux/actions';
import './search.scss';

const CheckableTag = Tag.CheckableTag;

interface SearchProps {
  zipkin?: ZipkinState;
  tree?: TreeState;
  filterService?: any;
  setAnnotationDetailsDisplay?: any;
  resetServiceFilters?: any;
}

export class Search extends React.Component<SearchProps, {}> {

  public componentWillMount(): void {
    this.props.resetServiceFilters();
  }

  public render(): JSX.Element {
    if (!this.props.zipkin || !this.props.zipkin.trace) {
      return undefined;
    }
    const { trace } = this.props.zipkin;
    const { filter } = this.props.tree;
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
              <CheckableTag
                key={name}
                checked={!filter.has(name)}
                onChange={(checked: boolean) => this.handleServiceTagCheck(checked, name)}
                >
                {name} x {stat.count}
              </CheckableTag>,
            )}
          </Col>
        </Row>
      </div>
    );
  }

  private handleServiceTagCheck(checked: boolean, name: string): void {
    if (checked === this.props.tree.filter.has(name)) {
      this.props.filterService(name);
    }
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
    filterService: (name: string) => dispatch(Actions.tree.filterService(name)),
    resetServiceFilters: () => dispatch(Actions.tree.resetServiceFilters()),
    setAnnotationDetailsDisplay: (display: boolean) =>
      dispatch(Actions.tree.setDefaultAnnotationDetailsDisplay(display)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);