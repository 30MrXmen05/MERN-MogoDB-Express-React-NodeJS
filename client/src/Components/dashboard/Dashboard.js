import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "react-bootstrap/Spinner";
import { getCurrentProfile } from "../../actions/profile";
import { Link } from "react-router-dom";

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);
  return loading && profile === null ? (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  ) : (
    // <Spinner />
    <Fragment>
      <h1 class="large text-primary">Dashboard</h1>
      <p class="lead">
        <i class="fas fa-user"></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>have a profile</Fragment>
      ) : (
        <Fragment>
          <p>
            You have not created Profile yet, Please click on below link for
            Create your Profile.
          </p>
          <Link to="/profile-create" className="btn btn-primary my-1">
            Create Profile Now
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
