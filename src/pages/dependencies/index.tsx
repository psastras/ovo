import * as React from 'react';
import { connect } from 'react-redux';
import Actions from 'src/flux/actions';
import * as moment from 'moment';

interface DependenciesProps {
  location?: any;
  fetchDependencies?: (endTs: number) => void;
}

export class Dependencies extends React.Component<DependenciesProps, {}> {

  public componentWillMount(): void {
    this.props.fetchDependencies(moment().valueOf());
  }

  public render(): JSX.Element {
    return (
      <div>
        <h1>Under Construction</h1>
      </div>
    );
  }
}

const mapStateToProps = (state: {}, props: DependenciesProps): DependenciesProps => {
  return {
    location: props.location,
  };
};

const mapDispatchToProps = (dispatch): DependenciesProps => {
  return {
    fetchDependencies: (endTs: number) => dispatch(Actions.zipkin.getDependencies(endTs)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dependencies);