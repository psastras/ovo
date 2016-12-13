import * as React from 'react';
import { push } from 'react-router-redux';
import { Menu, Icon, Affix, Input, Button, Form } from 'antd';
import { Link } from 'react-router';
import { State } from 'src/flux/reducers';
import { connect } from 'react-redux';

interface NavbarProps {
  location?: any;
  params?: {
    traceId?: string;
  };
  pushRoute?: (route: string) => void;
};

export class Navbar extends React.Component<NavbarProps, {}> {

  public readonly refs: {
    trace: Input;
  };

  public render(): JSX.Element {
    const path = this.props.location.pathname;
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
          <Menu.Item key={`/trace/${this.props.params.traceId}`}>
            <Form onSubmit={this.handleSubmitTrace}>
              View Trace
              <Input ref='trace'
                defaultValue={ this.props.params.traceId }
                placeholder='Enter trace id'
                style={{ marginLeft: '1em', width: '15em' }} />
              <Button style={{ marginLeft: '1em' }} type='primary' htmlType='submit'>Go</Button>
            </Form>
          </Menu.Item>
          <Menu.Item key='github' style={{ float: 'right' }}>
            <a href='https://github.com/psastras/ovo' target='_blank'><Icon type='github' /></a>
          </Menu.Item>
        </Menu>
      </Affix>
    );
  }

  private handleSubmitTrace = (e): void => {
    e.preventDefault();
    const traceId = this.refs.trace.refs.input.value as string;
    if (traceId && traceId.length > 0) {
      this.props.pushRoute(`/trace/${traceId}`);
    }
  }
}

const mapStateToProps = (state: State, props: NavbarProps): NavbarProps => {
  return {
    location: props.location,
    params: props.params,
  };
};

const mapDispatchToProps = (dispatch): NavbarProps => {
  return {
    pushRoute: (route: string) => dispatch(push(route)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);