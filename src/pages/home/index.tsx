import * as React from 'react';
import { connect } from 'react-redux';
import Search from '../components/search';
import Spans from '../components/spans';

interface HomeProps {
  location?: any;
}

export class Home extends React.Component<HomeProps, {}> {

  public render() {
    return (
      <div>
        <Search location={this.props.location} />
        <Spans />
      </div>
    );
  }
}

const mapStateToProps = (state: {}, props: HomeProps): HomeProps => {
  return {
    location: props.location
  }
}

export default connect(mapStateToProps)(Home);