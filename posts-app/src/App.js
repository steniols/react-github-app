import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

import HomePage from "./pages/home/home-page";
import LoginPage from "./pages/login/login-page";
import PostListPage from "./pages/tag-list/tag-list-page";
import PostDetailPage from "./pages/tag-detail/tag-detail-page";
import PostEditPage from "./pages/tag-edit/tag-edit-page";
import authService from "./services/auth.service";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
    };
  }

  componentDidMount() {
    this.loadUserData();
  }

  loadUserData() {
    let userData = authService.getLoggedUser();
    if (userData) {
      this.setState({ userData: userData });
    }
  }

  logout() {
    authService.clearLoggedUser();
    window.location.reload();
  }

  render() {
    return (
      <BrowserRouter>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link to="/" className="navbar-brand">
            Post App
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarMenu"
            aria-controls="navbarMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarMenu">
            <div className="navbar-nav">
              <Link to="/" className="nav-item nav-link">
                Home
              </Link>
              <Link to="/post-list" className="nav-item nav-link">
                Posts
              </Link>
            </div>
            {this.state.userData ? (
              <div className="nav-user">
                <div className="nav-user__info">
                  <h4>{this.state.userData.name}</h4>
                  <p>{this.state.userData.email}</p>
                </div>
                <button
                  className="btn btn-outline-dark"
                  onClick={(e) => this.logout()}
                >
                  Sair
                </button>
              </div>
            ) : null}
          </div>
        </nav>
        <Route path="/" exact={true} component={HomePage} />
        <Route
          path="/login"
          component={(props) => (
            <LoginPage {...props} onLogin={() => this.loadUserData()} />
          )}
        />
        <Route path="/post-list" exact={true} component={PostListPage} />
        <Route
          path="/post-detail/:id"
          exact={true}
          component={PostDetailPage}
        />
        <Route path="/post-add" exact={true} component={PostEditPage} />
        <Route path="/post-edit/:id" exact={true} component={PostEditPage} />
      </BrowserRouter>
    );
  }
}

export default App;
