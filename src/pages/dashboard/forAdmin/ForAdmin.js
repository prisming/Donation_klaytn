import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Circle from 'react-circle';

import {
  Row,
  Col,
  Alert,
  Button,
  ButtonGroup,
  Breadcrumb,
  BreadcrumbItem,
  Progress,
  Badge,
  ListGroup,
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Table,
  Carddeck,
  Card
} from 'reactstrap';

import dbSchema from '../../../images/prisming_db_schema.png';
import Widget from '../../../components/Widget';
import s from './ForAdmin.scss';
import {fetchBoxStatus} from '../../../actions/posts'

class ForAdmin extends Component {
  /* eslint-disable */
  static propTypes = {
    isFetching: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    status: PropTypes.array,
  };
  /* eslint-enable */

  static defaultProps = {
    isFetching: false,
    posts: [],
    status: [],
  };

  state = {
    isDropdownOpened: false,
  };

  componentWillMount() {
    this.props.dispatch(fetchBoxStatus());
  }


  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    console.log(this.state);
    return (
      <div className={s.root}>
        <Breadcrumb>
          <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
          <BreadcrumbItem active>Dashboard</BreadcrumbItem>
        </Breadcrumb>
        <h1 className="mb-lg">행복상자 현황 {this.props.isFetching ? "(불러오는 중입니다)" : ""}</h1>
        {!this.props.isFetching &&
        <Row>
          <Col sm={4}>
            <div className="d-flex justify-content-center">
                <h3 className="mb-lg">수령 전</h3>
            </div>
            <div className="d-flex justify-content-center">
                <h3 className="mb-lg">{this.props.status.filter((x) => x=="0").length} 개</h3>
            </div>
            <div className="d-flex justify-content-center">
            <Circle
              size={200}
              progress={(this.props.status.filter((x) => x=="0").length/(this.props.status.length - 1)* 100).toFixed(1)}
              progressColor="Maroon"
              bgColor="Moccasin"
              textStyle={{
                 font: 'bold 5rem Helvetica, Arial, sans-serif' // CSSProperties: Custom styling for percentage.
              }}
              percentSpacing={10}
              roundedStroke
              showPercentage // Boolean: Show/hide percentage.
              showPercentageSymbol
            />
            </div>
          </Col>
          <Col sm={4}>
            <div className="d-flex justify-content-center">
                <h3 className="mb-lg">수령 완료</h3>
            </div>
            <div className="d-flex justify-content-center">
                <h3 className="mb-lg">{this.props.status.filter((x) => x=="1").length} 개</h3>
            </div>
            <div className="d-flex justify-content-center">
            <Circle
              size={200}
              progress={(this.props.status.filter((x) => x=="1").length/(this.props.status.length - 1) * 100).toFixed(1)}
              progressColor="Maroon"
              bgColor="Moccasin"
              textStyle={{
                 font: 'bold 5rem Helvetica, Arial, sans-serif' // CSSProperties: Custom styling for percentage.
              }}
              percentSpacing={10}
              roundedStroke
              showPercentage // Boolean: Show/hide percentage.
              showPercentageSymbol
            />
            </div>
          </Col>
          <Col sm={4}>
            <div className="d-flex justify-content-center">
                <h3 className="mb-lg">최종 수혜 완료</h3>
            </div>
            <div className="d-flex justify-content-center">
                <h3 className="mb-lg">{this.props.status.filter((x) => x=="2").length} 개</h3>
            </div>
            <div className="d-flex justify-content-center">
            <Circle
              size={200}
              progress={(this.props.status.filter((x) => x=="2").length/(this.props.status.length - 1) * 100).toFixed(1)}
              progressColor="Maroon"
              bgColor="Moccasin"
              textStyle={{
                 font: 'bold 5rem Helvetica, Arial, sans-serif' // CSSProperties: Custom styling for percentage.
              }}
              percentSpacing={10}
              roundedStroke
              showPercentage // Boolean: Show/hide percentage.
              showPercentageSymbol
            />
            </div>
          </Col>
          <hr/>
        </Row>
      }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
    status: state.posts.status,
  };
}

export default connect(mapStateToProps)(withStyles(s)(ForAdmin));