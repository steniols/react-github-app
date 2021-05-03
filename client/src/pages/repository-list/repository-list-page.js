import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PageTop from "../../components/page-top/page-top.component";
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
      toast.error("Não foi possível listar os repositórios.");
    }
  }

  loader() {
    if (this.state.loader) {
      return <Loader></Loader>;
    } else {
      return this.state.repos.length <= 0 ? (
        <p>Nenhum registro encontrado</p>
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
          <span className="input-group-append bg-white border-left-0">
            <span className="input-group-text bg-transparent">
              <i className="fa fa-search"></i>
            </span>
          </span>
        </div>

        {this.loader()}

        {this.state.repos.map((repo) => (
          <Link to={"/repository-detail/" + repo.name} key={repo.id}>
            <div className="card">
              <div className="card-body">
                <h4>{repo.name}</h4>
                <p className="mt-1">{repo.description}</p>
                <p>
                  {repo.tags
                    ? repo.tags.map((r) => (
                        <span className="badge badge-primary" key={r.id}>
                          {r.title}
                        </span>
                      ))
                    : null}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }
}

export default RepositoryPage;
