import * as React from 'react';
import { connect } from 'react-redux';

interface DependenciesProps {
  location?: any;
}

export class Dependencies extends React.Component<DependenciesProps, {}> {

  public render() {
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

export default connect(mapStateToProps)(Dependencies);