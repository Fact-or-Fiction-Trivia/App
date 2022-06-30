import React, { Component } from "react";
import { Link } from "react-router-dom";

// UI stuff
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import * as routes from "../../constants/routes";
import { connect } from "react-redux";
import { reset } from "../../redux/reducers/auth";

import Logo from "../../assets/images/FoFHorizontalLogo.png";
import transparentOwl from "../../images/large_icon_transparent.png";
import navStyles from "./Navigation.module.scss";

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
    this.props.history.push("/");
    window.location.reload();
  };

  render() {
    const { hootPoints, isAdmin, isLoggedIn, signedInUser } = this.props;
    const navItems = [
      {
        name: "Play Now",
        route: routes.GAME,
      },
      { name: "Leaderboard", route: routes.LEADERBOARD },
      { name: "Submit a Question", route: routes.SUBMIT_QUESTION },
      { name: "Profile", route: `/profile/${signedInUser}` },
      { name: "About/FAQ", route: routes.ABOUT },
    ];

    if (isAdmin) {
      navItems.unshift({
        name: "Admin Dashboard",
        route: routes.ADMIN_DASHBOARD,
      });
    }

    const fullList = (
      <List component="nav">
        {navItems.map((item) => (
          <Link to={item.route} onClick={this.toggleDrawer("top", false)}>
            <ListItem button>
              <ListItemText primary={item.name} />
            </ListItem>
          </Link>
        ))}

        {isLoggedIn ? (
          <ListItem button component="a" onClick={this.signOut}>
            <ListItemText primary="Sign Out" />
          </ListItem>
        ) : (
          <Link
            to={routes.SIGN_IN}
            style={{ textDecoration: "none" }}
            onClick={this.toggleDrawer("top", false)}
          >
            <ListItem button>
              <ListItemText primary="Sign In" />
            </ListItem>
          </Link>
        )}
      </List>
    );

    return (
      <div className={styles.root}>
        <AppBar position="fixed" className={styles.appBar}>
          <Toolbar style={{ minHeight: "64px" }}>
            <Link to={routes.LANDING} style={{ textDecoration: "none" }}>
              <img
                src={Logo}
                alt="Fact or Fiction Logo"
                style={{ height: "59px", marginTop: "3px" }}
              />
            </Link>
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
              {fullList}
            </SwipeableDrawer>
            <div className={navStyles.buttonContainer}>
              {isLoggedIn && (
                <Link to={`/profile/${signedInUser}`}>
                  <div className={navStyles.hootContainer}>
                    <img src={transparentOwl} alt="Fact or Fiction Owl" />
                    <span className={navStyles.hootPoints}>{hootPoints}</span>
                    <span className={navStyles.hootLabel}>hoots</span>
                  </div>
                </Link>
              )}
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

const mapState = (state) => {
  const { auth } = state.auth;
  return {
    hootPoints: auth.points,
    isLoggedIn: !!auth.id,
    isAdmin: auth.role === "Admin",
    signedInUser: auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    signOutUser() {
      dispatch(reset());
    },
  };
};

export default connect(mapState, mapDispatch)(NavigationAuthBase);
