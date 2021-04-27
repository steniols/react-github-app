import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import PageTop from "../../components/page-top/page-top.component";
import Loader from "../../components/loader.component";
import githubService from "../../services/github.service";
import "./repository-list.page.css";
import { toast } from "react-toastify";

class RepositoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      redirectTo: null,
    };
  }

  componentDidMount() {
    githubService
      .getUser()
      .then((res) =>
        !res ? this.setState({ redirectTo: "/" }) : this.loadRepos()
      );
  }

  async loadRepos() {
    try {
      let res = await githubService.getRepos();
      this.setState({ repos: res });
    } catch (error) {
      toast.error("Não foi possível listar os repositórios.");
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="container">
        <PageTop
          title={"Repositórios"}
          desc={"Lista dos repositórios"}
        ></PageTop>

        {this.state.repos.length <= 0 ? <Loader /> : null}

        {this.state.repos.map((repo) => (
          <Link to={"/repository-detail/" + repo.name} key={repo.id}>
            <div className="repository-card">
              <div className="repository-card__text">
                <h4>{repo.name}</h4>
                <p className="mt-1">{repo.description}</p>
                <p>
                  {repo.tags
                    ? repo.tags.map((r) => (
                        <span className="badge badge-primary" key={r}>
                          {r}
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
