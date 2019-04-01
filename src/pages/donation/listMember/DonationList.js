import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Table,
  Breadcrumb,
  BreadcrumbItem,
  Button
} from 'reactstrap';

import s from './DonationList.scss';
import withMeta from '../../../core/withMeta';
import Widget from '../../../components/Widget';
import { fetchDonationsMember } from '../../../actions/posts';

class DonationList extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    posts: PropTypes.array, // eslint-disable-line
    isFetching: PropTypes.bool,

  };

  static defaultProps = {
    isFetching: false,
    posts: [],
  };

  static meta = {
    title: 'Posts list',
    description: 'About description',
  };

  componentWillMount() {
    this.props.dispatch(fetchDonationsMember(this.props.name));
  }

  render() {
    return (
      <div className={s.root}>
        <Breadcrumb>
          <BreadcrumbItem>YOU ARE HERE</BreadcrumbItem>
          <BreadcrumbItem active>기부내역</BreadcrumbItem>
        </Breadcrumb>
        <h1>기부내역</h1>
        <Widget
          className="pb-0"
          title={
            <div>
              <div className="pull-right mt-n-xs">
                <Link to="/app/donation/new" className="btn btn-sm btn-inverse">
                  기부 등록
                </Link>
              </div>
              <h5 className="mt-0">
                <span className="fw-semi-bold">목록</span>
              </h5>
            </div>
          }
        >
          <div className="widget-table-overflow">
            <Table striped>
              <thead>
              <tr>
                <th>List ID</th>
                <th>Donation ID</th>
                <th>멤버사</th>
                <th>수정버튼</th>
              </tr>
              </thead>
              <tbody>
              {this.props.posts &&
              this.props.posts.map(post => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td><Link to={`/app/donation/${post.donation_id}`}>{post.donation_id}</Link></td>
                  <td>{post.affiliation}</td>
                  <td><Link to={`/app/donation/edit/${post.donation_id}`}><Button outline color="info" size="sm"> 수정 </Button></Link></td>
                </tr>
              ))}
              {this.props.posts &&
              !this.props.posts.length && (
                <tr>
                  <td colSpan="100">No posts yet</td>
                </tr>
              )}
              {this.props.isFetching && (
                <tr>
                  <td colSpan="100">Loading...</td>
                </tr>
              )}
              </tbody>
            </Table>
          </div>
        </Widget>
      </div>
    );
  }
}



// <td>{new Date(post.updatedAt).toLocaleString()}</td>

function mapStateToProps(state) {
  return {
    isFetching: state.posts.isFetching,
    posts: state.posts.posts,
    name: state.auth.name,
  };
}

export default connect(mapStateToProps)(withStyles(s)(withMeta(DonationList)));