import React from "react";
import "./App.css";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

import LoginPage from "./pages/login/login-page";
import HomePage from "./pages/home/home-page";
import PostListPage from "./pages/tag-list/tag-list-page";
import PostDetailPage from "./pages/tag-detail/tag-detail-page";
import PostEditPage from "./pages/tag-edit/tag-edit-page";
import RepositoryListPage from "./pages/repository-list/repository-list-page";

import authService from "./services/auth.service";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      login: "",
      showElements: false,
    };
  }

  componentDidMount() {
    authService.getGithubUser().then((res) => {
      this.setState({ name: res.name });
      this.setState({ login: res.login });
      this.setState({ showElements: true });
    });
  }

  logout() {
    authService.clearLoggedUser();
    window.location.reload();
  }

  redirectGitHubLogin() {
    window.location.href = "http://localhost:8002";
  }

  loadUserData() {
    authService.getGithubUser().then((res) => {
      this.setState({ name: res.name });
      this.setState({ login: res.login });
    });
  }

  render() {
    return (
      <BrowserRouter>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link to="/" className="navbar-brand">
            Github App
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
              <Link to="/repository-list" className="nav-item nav-link">
                Repositórios
              </Link>
              <Link to="/tag-list" className="nav-item nav-link">
                Tags
              </Link>
            </div>
            <div className="nav-user">
              {this.state.login ? (
                <>
                  <div className="nav-user__info">
                    <h4>{this.state.name}</h4>
                    <p>{this.state.login}</p>
                  </div>
                  <button
                    className="btn btn-outline-dark"
                    onClick={(e) => this.logout()}
                  >
                    Sair
                  </button>
                </>
              ) : null}

              {!this.state.login && this.state.showElements ? (
                <>
                  <button
                    className="btn btn-outline-dark"
                    onClick={(e) => this.redirectGitHubLogin()}
                  >
                    Login com o GitHub
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </nav>
        <Route
          path="/login"
          component={(props) => (
            <LoginPage {...props} onLogin={() => this.loadUserData()} />
          )}
        />
        <Route path="/" exact={true} component={HomePage} />
        <Route path="/tag-list" exact={true} component={PostListPage} />
        <Route path="/tag-detail/:id" exact={true} component={PostDetailPage} />
        <Route path="/tag-add" exact={true} component={PostEditPage} />
        <Route path="/tag-edit/:id" exact={true} component={PostEditPage} />
        <Route
          path="/repository-list"
          exact={true}
          component={RepositoryListPage}
        />
      </BrowserRouter>
    );
  }
}

export default App;
