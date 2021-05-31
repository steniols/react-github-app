import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import LazyLoad from "react-lazyload";
import PageTop from "../../components/page-top.component";
import Loader from "../../components/loader.component";
import githubService from "../../services/github.service";

class RepositoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null,
      repos: [],
      loader: true,
      searchTerm: "",
    };
  }

  componentDidMount() {
    githubService
      .getUser()
      .then((res) =>
        !res ? this.setState({ redirectTo: "/" }) : this.loadRepos()
      );
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.searchTerm !== prevState.searchTerm) {
      let filteredRepos = [];
      this.setState({ repos: [], loader: true });
      try {
        filteredRepos = await githubService.getRepos(this.state.searchTerm);
      } catch (error) {
        console.log(error);
      }
      this.setState({ repos: filteredRepos, loader: false });
    }
  }

  async loadRepos(search = false) {
    try {
      let res = await githubService.getRepos(search);
      this.setState({ repos: res, loader: false });
    } catch (error) {
      const errorMessages = error?.response?.data?.message;
      if (errorMessages) {
        const errorsTranslated = errorMessages.map((err) => this.props.t(err));
        errorsTranslated.map((e) => toast.error(e));
      } else {
        toast.error(
          "O servidor não está respondendo, tente novamente mais tarde."
        );
      }
    }
  }

  loader() {
    if (this.state.loader) {
      return <Loader></Loader>;
    } else {
      return this.state.repos.length <= 0 ? (
        <p data-cy="no-found-records">Nenhum registro encontrado</p>
      ) : null;
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="container">
        <PageTop title={"Repositórios"} desc={"Lista dos repositórios"} />

        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control border-right-0"
            placeholder="Procurar repositórios..."
            onChange={(event) =>
              this.setState({ searchTerm: event.target.value })
            }
          />
          <span className="input-group-append bg-white border-left-0 border-right-4">
            <span className="input-group-text bg-transparent">
              <i className="fa fa-search"></i>
            </span>
          </span>
        </div>

        {this.loader()}

        {this.state.repos.map((repo) => (
          <LazyLoad height={200} debounce={100} key={repo.id}>
            <Link to={"/repository-detail/" + repo.name} data-cy="list-item">
              <div className="card">
                <div className="card-body">
                  <h4>{repo.name}</h4>
                  <p className="mt-1">{repo.description}</p>
                  <p>
                    {repo.tags_desc
                      ? repo.tags_desc.split(",").map((r) => (
                          <span className="badge badge-primary" key={r}>
                            {r}
                          </span>
                        ))
                      : null}
                  </p>
                </div>
              </div>
            </Link>
          </LazyLoad>
        ))}
      </div>
    );
  }
}

export default withTranslation("common")(RepositoryPage);
