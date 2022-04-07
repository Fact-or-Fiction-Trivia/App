import React, { useEffect } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { fetchAdminQuestions } from "../../redux/reducers/admin";
const AdminQuestions = ({ getQuestions, questions }) => {
  useEffect(() => {
    getQuestions();
  }, [getQuestions]);
  return (
    <div className="dashboard-container">
      <Helmet>
        <title>Questions List</title>
      </Helmet>
      <h1>Questions</h1>
      <ul>
        {questions.map((question) => (
          <li>
            <Link to={`/admin/manage-questions/${question.id}`}>
              {question.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { questions } = state.admin;
  return { questions };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getQuestions() {
      dispatch(fetchAdminQuestions());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminQuestions);
