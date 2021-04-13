import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import PageTop from "../../components/page-top/page-top.component";
import authService from "../../services/auth.service";
import tagsService from "../../services/tags.service";

class RepositoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      redirectTo: null,
    };
  }

  componentDidMount() {
    authService
      .getGithubUser()
      .then((res) => (!res ? this.setState({ redirectTo: "/" }) : null));

    // let loggedUser = authService.getGithubUser();
    // console.log(loggedUser);
    // if (!loggedUser) {
    //   this.setState({ redirectTo: "/" });
    // }
  }
  async loadRepos() {
    // try {
    //   let res = await tagsService.list();
    //   this.setState({ tags: res.data.data });
    // } catch (error) {
    //   console.log(error);
    //   alert("Não foi possível listar os tags.");
    // }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="container">
        <PageTop
          title={"Repositórios"}
          desc={"Listagem dos repositórios"}
        ></PageTop>
        <p>To do...</p>

        {/* {this.state.tags.map((tag) => (
          <Link to={"/tag-detail/" + tag.id} key={tag.id}>
            <div className="tag-card">
              <div className="tag-card__img">
                <img src={tag.imageUrl} />
              </div>
              <div className="tag-card__text">
                <h4>{tag.title}</h4>
                <p>{tag.content}</p>
              </div>
            </div>
          </Link>
        ))} */}
      </div>
    );
  }
}

export default RepositoryPage;
