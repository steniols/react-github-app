import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import PageTop from "../../components/page-top/page-top.component";
import githubService from "../../services/github.service";
import "./repository-list.page.css";

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
      console.log(res);
    } catch (error) {
      console.log(error);
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

        {this.state.repos.map((repo) => (
          <Link to={"/repository-detail/" + repo.name} key={repo.id}>
            <div className="repository-card">
              {/* <div className="repository-card__img">
                <img src="https://picsum.photos/200/300" alt="" />
              </div> */}
              <div className="repository-card__text">
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }
}

export default RepositoryPage;
