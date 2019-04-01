import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Row,
  Col,
  Alert,
  Button,
  Form,
  FormGroup,
  ButtonGroup,
  Input
} from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';

import Widget from '../../components/Widget';
import Footer from '../../components/Footer';

import s from './Login.scss'; // eslint-disable-line
import { loginUser } from '../../actions/user';

class Login extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    isFetching: PropTypes.bool,
    org_type: PropTypes.string,
    location: PropTypes.any, // eslint-disable-line
    errorMessage: PropTypes.string,
  };

  static defaultProps = {
    isAuthenticated: false,
    isFetching: false,
    location: {},
    org_type: null,
    errorMessage: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      login: '',
      password: '',
    };
  }

  changeLogin = (event) => {
    this.setState({login: event.target.value});
  }

  changePassword = (event) => {
    this.setState({password: event.target.value});
  }

  doLogin = (e) => {
    this.props.dispatch(
      loginUser({
        login: this.state.login,
        password: this.state.password,
      }),
    );
    e.preventDefault();
  }

  render() {
    const {from} = this.props.location.state || {
      from: {pathname: '/app'},
    };

    if (this.props.isAuthenticated) {
      // cant access login page while logged in
      return <Redirect to={from} />;
    }

    return (
        <div className={s.root}>
          <Row>
            <Col xs={{size: 10, offset: 1}} sm={{size: 6, offset: 3}} lg={{size:4, offset: 4}}>
              <p className="text-center">Happiness box App</p>
              <Widget className={s.widget}>
                <h4 className="mt-0">Login Happiness box App</h4>
                <p className="fs-sm text-muted">
                  계정이 없다면 관리자에게 문의해주세요
                </p>
                <Form className="mt" onSubmit={this.doLogin}>
                  {this.props.errorMessage && (
                    <Alert size="sm" color="danger">
                      {this.props.errorMessage}
                    </Alert>
                  )}
                  <FormGroup className="form-group">
                    <Input
                      className="no-border"
                      value={this.state.login}
                      onChange={this.changeLogin}
                      type="text"
                      required
                      name="username"
                      placeholder="Username"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      className="no-border"
                      value={this.state.password}
                      onChange={this.changePassword}
                      type="password"
                      required
                      name="password"
                      placeholder="Password"
                    />
                  </FormGroup>

                  <div className="d-flex justify-content-end" style={{marginTop: "10px"}}>
                    <ButtonGroup>
                      <Button color="success" size="sm" type="submit">
                        {this.props.isFetching ? '로그인 중...' : '로그인'}
                      </Button>
                    </ButtonGroup>
                  </div>
                </Form>
              </Widget>
            </Col>
          </Row>
        <Footer className="text-center" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    isAuthenticated: state.auth.isAuthenticated,
    org_type: state.auth.org_type,
    errorMessage: state.auth.errorMessage,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(Login)));