import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import PageTop from "../../components/page-top/page-top.component";
import githubService from "../../services/github.service";

class RepositoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      redirectTo: null,
    };
  }

  componentDidMount() {
    // githubService
    //   .getUser()
    //   .then((res) => (!res ? this.setState({ redirectTo: "/" }) : null));

    this.loadRepos();
  }

  async loadRepos() {
    try {
      let res = await githubService.getRepos();
      this.setState({ repos: res });
      console.log(res);
    } catch (error) {
      console.log(error);
      // alert("Não foi possível listar os repositórios.");
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
          desc={"Lisrepoem dos repositórios"}
        ></PageTop>

        {this.state.repos.map((repo) => (
          <Link to={"/repo-detail/" + repo.id} key={repo.id}>
            <div className="tag-card">
              <div className="tag-card__img">
                <img src="https://picsum.photos/200/300" />
              </div>
              <div className="tag-card__text">
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
