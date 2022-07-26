import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { TextField } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { useHistory } from "react-router-dom";
import { fetchAdminQuestions } from "../../redux/reducers/admin";
import "./dashboard.scss";

const AdminQuestions = ({ getQuestions, questions }) => {
  const [formattedQuestions, setFormattedQuestions] = useState([]);
  useEffect(() => {
    getQuestions();
  }, [getQuestions]);
  useEffect(() => {
    if (questions.length > 0) {
      formatQuestions(questions);
    }
  }, [questions]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = () => {
    getQuestions(searchTerm);
  };
  const history = useHistory();

  const formatQuestions = (questions) => {
    const formatted = [];

    questions?.forEach((question) => {
      const tags = [];
      question.tags.forEach((tag) => tags.push(tag.name));

      formatted.push({
        ...question,
        tags,
      });
    });
    setFormattedQuestions(formatted);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      sortable: true,
      width: 90,
    },
    {
      field: "text",
      headerName: "Text",
      sortable: true,
      width: 400,
    },
    {
      field: "tags",
      headerName: "Tags",
      sortable: true,
      width: 200,
    },
  ];

  return (
    <>
      <div className="questionsHeader">
        <h1 style={{ marginBottom: 0, marginRight: "1rem" }}>
          Manage Questions
        </h1>

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
          rows={formattedQuestions}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          onRowClick={({ id }) => {
            history.push(`/admin/manage-questions/${id}`);
          }}
        />
      </div>
    </>
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
