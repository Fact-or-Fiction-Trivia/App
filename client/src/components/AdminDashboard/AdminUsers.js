import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { fetchAdminUsers, updateAdminUser } from "../../redux/reducers/admin";
import { DataGrid } from "@material-ui/data-grid";
import { TextField } from "@material-ui/core";

const AdminUsers = ({ getUsers, users, updateUser }) => {
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = () => {
    getUsers(searchTerm);
  };
  const columns = [
    {
      field: "username",
      headerName: "Username",
      width: 150,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      type: "email",
      width: 250,
      editable: true,
    },
    {
      field: "affiliation",
      headerName: "Affiliation",
      sortable: false,
      width: 160,
    },
    {
      field: "points",
      headerName: "Points",
      type: "number",
      description: "Double click to edit.",
      width: 160,
      editable: true,
    },
  ];

  return (
    <div className="dashboard-container">
      <Helmet>
        <title>Users</title>
      </Helmet>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ marginBottom: 0, marginRight: "1rem" }}>Users</h1>

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
          rows={users}
          columns={columns}
          pageSize={10}
          checkboxSelection
          disableSelectionOnClick
          onCellEditCommit={({ value, id }) => {
            updateUser({ userId: id, body: { points: value } });
          }}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { users } = state.admin;
  return {
    users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUsers(searchTerm) {
      dispatch(fetchAdminUsers(searchTerm));
    },
    updateUser(data) {
      dispatch(updateAdminUser(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsers);
