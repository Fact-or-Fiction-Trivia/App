import React, { Component } from "react";
import { Link } from "react-router-dom";
import MediaQuery from "react-responsive";

// UI stuff
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import * as routes from "../../constants/routes";
import { connect } from "react-redux";
import { reset } from "../../redux/reducers/auth";

import Logo from "../../assets/images/FoFHorizontalLogo.png";

// const Navigation = ({ clearStateOnSignout }) => {
//   return (
//     <AuthUserContext.Consumer>
//       {(authUser) => (
//         <>
//           {authUser !== null ? (
//             <NavigationAuth
//               authUser={authUser}
//               clearStateOnSignout={clearStateOnSignout}
//             />
//           ) : (
//             <NavigationNonAuth />
//           )}
//         </>
//       )}
//     </AuthUserContext.Consumer>
//   );
// };

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    height: "64px",
    zIndex: 1,
    overflow: "hidden",
    position: "absolute",
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    height: "64px",
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar,
});

class NavigationAuthBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      top: false,
      mostRecentQuizURL: "",
      isAdmin: false,
      noQuizzes: false,
      open: false,
    };
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  signOut = () => {
    this.props.signOutUser();
    this.toggleDrawer("top", false);
  };

  handleAdminClick = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  render() {
    const fullList = (
      <div>
        <MediaQuery query="(max-width: 415px)">
          <List component="nav">
            {this.props.authUser &&
            this.props.authUser.roles.includes("ADMIN") ? (
              <>
                <ListItem button onClick={this.handleAdminClick}>
                  <ListItemText primary="Admin Dashboard" />
                  {this.state.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <Link
                      to={routes.ADMIN_DASHBOARD}
                      style={{ textDecoration: "none" }}
                    >
                      <ListItem
                        button
                        onClick={this.toggleDrawer("top", false)}
                      >
                        <ListItemText inset primary="Dashboard Home" />
                      </ListItem>
                    </Link>
                    <Link
                      to={routes.CREATE_NEW_QUIZ}
                      style={{ textDecoration: "none" }}
                    >
                      <ListItem
                        button
                        onClick={this.toggleDrawer("top", false)}
                      >
                        <ListItemText inset primary="Create New Quiz" />
                      </ListItem>
                    </Link>
                    <Link
                      to={routes.MANAGE_QUIZZES}
                      style={{ textDecoration: "none" }}
                    >
                      <ListItem
                        button
                        onClick={this.toggleDrawer("top", false)}
                      >
                        <ListItemText inset primary="Manage Quizzes" />
                      </ListItem>
                    </Link>
                    <Link
                      to={routes.MANAGE_USERS}
                      style={{ textDecoration: "none" }}
                    >
                      <ListItem
                        button
                        onClick={this.toggleDrawer("top", false)}
                      >
                        <ListItemText inset primary="Manage Users" />
                      </ListItem>
                    </Link>
                    <Link
                      to={routes.ADMIN_LEADERBOARD}
                      style={{ textDecoration: "none" }}
                    >
                      <ListItem
                        button
                        onClick={this.toggleDrawer("top", false)}
                      >
                        <ListItemText inset primary="Party Leaders" />
                      </ListItem>
                    </Link>
                  </List>
                </Collapse>
              </>
            ) : null}
            <Link
              to={routes.GAME}
              style={{ textDecoration: "none" }}
              onClick={this.toggleDrawer("top", false)}
            >
              <ListItem button>
                <ListItemText primary={"Play"} />
              </ListItem>
            </Link>
            <Link
              to={routes.LEADERBOARD}
              style={{ textDecoration: "none" }}
              onClick={this.toggleDrawer("top", false)}
            >
              <ListItem button>
                <ListItemText primary="Leaderboard" />
              </ListItem>
            </Link>
            <Link
              to={routes.SUBMIT_QUESTION}
              className="mobile-only"
              style={{ textDecoration: "none" }}
              onClick={this.toggleDrawer("top", false)}
            >
              <ListItem button>
                <ListItemText primary="Submit A Question" />
              </ListItem>
            </Link>
            <Link
              // to={`/profile/${this.state.signedInUser}`}
              to={routes.SUBMIT_QUESTION}
              style={{ textDecoration: "none" }}
              onClick={this.toggleDrawer("top", false)}
            >
              <ListItem button>
                <ListItemText primary="Submit a question" />
              </ListItem>
            </Link>
            <Link
              to={routes.ABOUT}
              style={{ textDecoration: "none" }}
              onClick={this.toggleDrawer("top", false)}
            >
              <ListItem button>
                <ListItemText primary="About/FAQ" />
              </ListItem>
            </Link>
            <ListItem button component="a" onClick={this.signOut}>
              <ListItemText primary="Sign Out" />
            </ListItem>
          </List>
        </MediaQuery>
        <MediaQuery query="(min-width: 416px)">
          <List component="nav">
            {this.props.authUser &&
            this.props.authUser.roles.includes("ADMIN") ? (
              <Link
                to={routes.ADMIN_DASHBOARD}
                style={{ textDecoration: "none" }}
                onClick={this.toggleDrawer("top", false)}
              >
                <ListItem button>
                  <ListItemText primary="Admin Dashboard" />
                </ListItem>
              </Link>
            ) : null}
            <Link
              to={this.state.mostRecentQuizURL}
              style={{ textDecoration: "none" }}
              onClick={this.toggleDrawer("top", false)}
            >
              <ListItem button disabled={this.state.noQuizzes}>
                <ListItemText
                  primary={
                    this.state.noQuizzes
                      ? "No Available Quizzes"
                      : "Take Today's Quiz"
                  }
                />
              </ListItem>
            </Link>
            <Link
              to={routes.LEADERBOARD}
              style={{ textDecoration: "none" }}
              onClick={this.toggleDrawer("top", false)}
            >
              <ListItem button>
                <ListItemText primary="Leaderboard" />
              </ListItem>
            </Link>
            <Link
              //to={`/profile/${this.state.signedInUser}`}
              to={routes.SUBMIT_QUESTION}
              style={{ textDecoration: "none" }}
              onClick={this.toggleDrawer("top", false)}
            >
              <ListItem button>
                <ListItemText primary="Submit a question" />
              </ListItem>
            </Link>
            <Link
              to={routes.ABOUT}
              style={{ textDecoration: "none" }}
              onClick={this.toggleDrawer("top", false)}
            >
              <ListItem button>
                <ListItemText primary="About/FAQ" />
              </ListItem>
            </Link>
            <ListItem button component="a" onClick={this.signOut}>
              <ListItemText primary="Sign Out" />
            </ListItem>
          </List>
        </MediaQuery>
      </div>
    );

    return (
      <div className={styles.root}>
        <AppBar position="fixed" className={styles.appBar}>
          <Toolbar style={{ minHeight: "64px" }}>
            <Link to={routes.LANDING} style={{ textDecoration: "none" }}>
              <img
                src={Logo}
                alt="PolitIQ"
                style={{ height: "59px", marginTop: "3px" }}
              />
            </Link>
            <div>
              <SwipeableDrawer
                classes={{ paper: styles.drawerPaper }}
                id="menu-appbar"
                anchororigin={{ vertical: "top", horizontal: "right" }}
                transformorigin={{ vertical: "top", horizontal: "right" }}
                onClose={this.toggleDrawer("top", false)}
                anchor="top"
                open={this.state.top}
                onOpen={this.toggleDrawer("top", true)}
                style={{ marginTop: "1vh" }}
              >
                <div
                  tabIndex={0}
                  role="button"
                  // onClick={this.toggleDrawer('top', false )}
                  onKeyDown={this.toggleDrawer("top", false)}
                >
                  {fullList}
                </div>
              </SwipeableDrawer>
            </div>
            <div style={{ marginLeft: "auto", marginRight: "0" }}>
              <Link
                to={`/profile/${this.state.signedInUser}`}
                style={{ textDecoration: "none", color: "white" }}
              >
                <IconButton aria-haspopup="true" color="inherit">
                  <AccountCircle />
                </IconButton>
              </Link>
              <IconButton
                aria-label="Menu"
                color="inherit"
                onClick={this.toggleDrawer("top", true)}
              >
                <MenuIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    signOutUser() {
      dispatch(reset());
    },
  };
};

const NavigationAuth = connect(null, mapDispatch)(NavigationAuthBase);

export default NavigationAuth;
