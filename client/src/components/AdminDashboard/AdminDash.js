import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
const AdminDash = (props) => {
  return (
    <div className="dashboard-container">
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <Link to="/admin/questions">Questions</Link>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDash);
