import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { TextField, Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { Link, useHistory } from "react-router-dom";
import { fetchAdminQuestions } from "../../redux/reducers/admin";
import { REVIEW, REVIEW_CONTEST } from "../../constants/routes";
const AdminQuestions = ({ getQuestions, questions }) => {
  useEffect(() => {
    getQuestions();
  }, [getQuestions]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = () => {
    getQuestions(searchTerm);
  };
  const history = useHistory();
  const columns = [
    {
      field: "text",
      headerName: "Text",
      sortable: true,
      width: 400,
    },
    {
      field: "source",
      headerName: "Source",
      sortable: true,
      width: 250,
    },
    {
      field: "explanation",
      headerName: "Explanation",
      sortable: true,
      width: 250,
    },
  ];
  return (
    <div className="dashboard-container">
      <Helmet>
        <title>Questions List</title>
      </Helmet>
      <Link to={REVIEW}>Review Submitted Questions</Link>
      <Link to={REVIEW_CONTEST}>Review Contested Questions</Link>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ marginBottom: 0, marginRight: "1rem" }}>Questions</h1>

        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={({ target: { value } }) => setSearchTerm(value)}
          onKeyDown={({ key }) => {
            if (key === "Enter") {
              handleSearch();
            }
          }}
        />
      </div>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={questions}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          onRowClick={({ id }) => {
            history.push(`/admin/manage-questions/${id}`);
          }}
        />
      </div>
      {/* <ul>
        {questions.map((question) => (
          <li>
            <Link to={`/admin/manage-questions/${question.id}`}>
              {question.text}
            </Link>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

const mapStateToProps = (state) => {
  const { questions } = state.admin;
  return { questions };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getQuestions(searchTerm) {
      dispatch(fetchAdminQuestions(searchTerm));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminQuestions);
