import * as React from 'react';
import { Menu, Icon, Affix, Input } from 'antd';
import { Link } from 'react-router';
import { State } from 'src/flux/reducers';
import { connect } from 'react-redux';

interface NavbarProps {
  path?: string;
};

export class Navbar extends React.Component<NavbarProps, {}> {
  public render(): JSX.Element {
    const { path } = this.props;
    return (
      <Affix>
        <Menu
          selectedKeys={[path]}
          mode='horizontal'
          className='navbar'
          >
          <Menu.Item key='/'>
            <Link to='/'>Explore Tracing Data</Link>
          </Menu.Item>
        </Menu>
      </Affix>
    );
  }
}

const mapStateToProps = (state: State, props: NavbarProps): NavbarProps => {
  return {
    path: state.routing.locationBeforeTransitions.pathname,
  };
};

export default connect(mapStateToProps)(Navbar);