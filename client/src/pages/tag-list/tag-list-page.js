import React from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import PageTop from "../../components/page-top/page-top.component";
import Loader from "../../components/loader.component";
import githubService from "../../services/github.service";
import tagsService from "../../services/tags.service";
import { toast } from "react-toastify";

class PostListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      redirectTo: null,
    };
  }

  componentDidMount() {
    githubService
      .getUser()
      .then((res) =>
        !res ? this.setState({ redirectTo: "/" }) : this.loadTags()
      );
  }

  async loadTags() {
    try {
      let res = await tagsService.list();
      this.setState({ tags: res.data.data });
    } catch (error) {
      toast.error("Não foi possível listar os tags.");
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    return (
      <div className="container">
        <PageTop title={"Tags"} desc={"Listagem dos tags"}>
          <button
            className="btn btn-primary"
            onClick={() => this.props.history.push("/tag-add")}
          >
            Adicionar
          </button>
        </PageTop>

        {this.state.tags.length <= 0 ? <Loader /> : null}

        {this.state.tags.map((tag) => (
          <Link to={"/tag-detail/" + tag.id} key={tag.id}>
            <div className="card">
              <div className="card-img">
                <img src={tag.imageUrl} alt="" />
              </div>
              <div className="card-text">
                <h4>{tag.title}</h4>
                <p>{tag.content}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }
}

export default PostListPage;
