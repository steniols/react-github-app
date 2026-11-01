import React from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HomePage from "./pages/home/home-page";
import TagListPage from "./pages/tag-list/tag-list-page";
import TagDetailPage from "./pages/tag-detail/tag-detail-page";
import TagEditPage from "./pages/tag-edit/tag-edit-page";
import RepositoryListPage from "./pages/repository-list/repository-list-page";
import RepositoryDetailPage from "./pages/repository-detail/repository-detail-page";

import githubService from "./services/github.service";
import { apiUrl } from "./services/api";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      login: "",
      showElements: false,
      menuOpen: false,
    };
  }

  componentDidMount() {
    // The OAuth callback redirects here with the credentials in the query string
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    const token = params.get("token");
    if (username && token) {
      localStorage.setItem("loginGithub", username);
      localStorage.setItem("tokenGithub", token);
      window.history.replaceState(null, "", window.location.pathname);
    }

    githubService.getUser().then((res) => {
      this.setState({ name: res.name, login: res.login, showElements: true });
    });
  }

  async logout() {
    await githubService.clearLoggedUser().catch(() => null);
    window.location = "/";
  }

  redirectGitHubLogin() {
    window.location = apiUrl("/github");
  }

  render() {
    const closeMenu = () => this.setState({ menuOpen: false });
    return (
      <BrowserRouter>
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top navbar-dark">
          <div className="container">
            <Link to="/" className="navbar-brand" onClick={closeMenu}>
              Github App
            </Link>
            <button
              className="navbar-toggler custom-toggler"
              type="button"
              aria-controls="navbarMenu"
              aria-expanded={this.state.menuOpen}
              aria-label="Menu"
              onClick={() => this.setState({ menuOpen: !this.state.menuOpen })}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className={`collapse navbar-collapse ${this.state.menuOpen ? "show" : ""}`}
              id="navbarMenu"
            >
              <div className="navbar-nav">
                {this.state.login ? (
                  <>
                    <Link to="/" className="nav-item nav-link" onClick={closeMenu}>
                      Home
                    </Link>
                    <Link to="/repository-list" className="nav-item nav-link" onClick={closeMenu}>
                      Repositórios
                    </Link>
                    <Link to="/tag-list" className="nav-item nav-link" onClick={closeMenu}>
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
                    <button className="btn btn-dark" onClick={() => this.logout()}>
                      Sair
                    </button>
                  </>
                ) : null}

                {!this.state.login && this.state.showElements ? (
                  <button
                    className="btn btn-dark"
                    onClick={() => this.redirectGitHubLogin()}
                    data-cy="button-login"
                  >
                    <i className="fa fa-github mr-2"></i>
                    Login com o GitHub
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </nav>
        <main>
          <Switch>
            <Route path="/" exact={true}>
              <HomePage login={this.state.login} showElements={this.state.showElements} />
            </Route>
            <Route path="/tag-list" exact={true} component={TagListPage} />
            <Route path="/tag-detail/:id" exact={true} component={TagDetailPage} />
            <Route path="/tag-add" exact={true} component={TagEditPage} />
            <Route path="/tag-edit/:id" exact={true} component={TagEditPage} />
            <Route path="/repository-list" exact={true} component={RepositoryListPage} />
            <Route path="/repository-detail/:id" exact={true} component={RepositoryDetailPage} />
            <Route>
              <div className="container">
                <h2 className="page-top">Página não encontrada</h2>
                <Link to="/">Voltar para o início</Link>
              </div>
            </Route>
          </Switch>
        </main>
        <footer className="navbar navbar-default navbar-static-bottom mt-auto">
          <div className="container">
            <p className="navbar-text navbar-left">
              <i>&copy; Github App</i> by{" "}
              <a href="https://steniols.github.io/" target="_blank" rel="noreferrer">
                steniols
              </a>
            </p>
          </div>
        </footer>
        <ToastContainer theme="colored" />
      </BrowserRouter>
    );
  }
}

export default App;
