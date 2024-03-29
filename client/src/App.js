import React from "react";
import "./App.css";
import { BrowserRouter, Link, Route } from "react-router-dom";

import HomePage from "./pages/home/home-page";
import TagListPage from "./pages/tag-list/tag-list-page";
import TagDetailPage from "./pages/tag-detail/tag-detail-page";
import TagEditPage from "./pages/tag-edit/tag-edit-page";
import RepositoryListPage from "./pages/repository-list/repository-list-page";
import RepositoryDetailPage from "./pages/repository-detail/repository-detail-page";

import githubService from "./services/github.service";
import env from "react-dotenv";

import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
toast.configure();

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
    githubService.getUser().then((res) => {
      this.setState({ name: res.name });
      this.setState({ login: res.login });
      this.setState({ showElements: true });
    });
  }

  logout() {
    githubService.clearLoggedUser();
    window.location = "/";
  }

  redirectGitHubLogin() {
    const api_url = env.API_URL ? `${env.API_URL}/github` : "/github";
    window.location = api_url;
  }

  loadUserData() {
    githubService.getUser().then((res) => {
      this.setState({ name: res.name });
      this.setState({ login: res.login });
    });
  }

  render() {
    return (
      <BrowserRouter>
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top navbar-dark">
          <div className="container">
            <Link to="/" className="navbar-brand">
              Github App
            </Link>
            <button
              className="navbar-toggler custom-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarMenu"
              aria-controls="navbarMenu"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarMenu">
              <div className="navbar-nav">
                {this.state.login ? (
                  <>
                    <Link to="/" className="nav-item nav-link">
                      Home
                    </Link>
                    <Link to="/repository-list" className="nav-item nav-link">
                      Repositórios
                    </Link>
                    <Link to="/tag-list" className="nav-item nav-link">
                      Tags
                    </Link>
                  </>
                ) : null}
              </div>
              <div className="d-lg-none">
                <hr />
              </div>
              <div className="nav-user">
                {this.state.login ? (
                  <>
                    <div className="nav-user__info">
                      <h4 data-cy="github-name">{this.state.name}</h4>
                      <p data-cy="github-login">{this.state.login}</p>
                    </div>
                    <button
                      className="btn btn-dark"
                      onClick={(e) => this.logout()}
                    >
                      Sair
                    </button>
                  </>
                ) : null}

                {!this.state.login && this.state.showElements ? (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={(e) => this.redirectGitHubLogin()}
                      data-cy="button-login"
                    >
                      Login com o GitHub
                    </button>
                  </>
                ) : null}
              </div>
              <div className="d-lg-none"></div>
            </div>
          </div>
        </nav>
        <main>
          <Route path="/" exact={true} component={HomePage} />
          <Route path="/tag-list" exact={true} component={TagListPage} />
          <Route
            path="/tag-detail/:id"
            exact={true}
            component={TagDetailPage}
          />
          <Route path="/tag-add" exact={true} component={TagEditPage} />
          <Route path="/tag-edit/:id" exact={true} component={TagEditPage} />
          <Route
            path="/repository-list"
            exact={true}
            component={RepositoryListPage}
          />
          <Route
            path="/repository-detail/:id"
            exact={true}
            component={RepositoryDetailPage}
          />
        </main>
        <footer className="navbar navbar-default navbar-static-bottom mt-auto">
          <div className="container">
            <p className="navbar-text navbar-left">
              <i>&copy; Github App</i> by{" "}
              <Link
                to={{ pathname: "https://steniols.github.io/" }}
                target="_blank"
              >
                steniols
              </Link>
            </p>
          </div>
        </footer>
      </BrowserRouter>
    );
  }
}

export default App;
