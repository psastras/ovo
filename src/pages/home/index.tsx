import * as React from 'react';
import Search from '../components/search';
import Spans from '../components/spans';

export default class extends React.Component<{}, {}> {
  public render() {
    return (
      <div>
        <Search />
        <Spans />
      </div>
    );
  }
}